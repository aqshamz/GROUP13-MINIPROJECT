import { Request, Response } from 'express';
import prisma from '@/prisma';
import { validationResult } from 'express-validator';
import { sign } from "jsonwebtoken"


import { TransactionStatus } from '@prisma/client';
import crypto from 'crypto';

export class PaymentController {
  
    async getUserPointsData(req: Request, res: Response) {
    const today = new Date();
      try {
        const user = req.user;
  
        if (!user) {
          return res.status(401).send("Unauthorized");
        }
  
        const pointsData = await prisma.userPoint.aggregate({
          where: {
            userId: parseInt(user.id),
            expiresAt: { gt: today }
          },
          _sum: {
            points: true, 
          },
        });
  
        return res.status(200).send({
          message: "Success",
          data: pointsData._sum.points,
        });
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: (error as Error).message });
      }
    }

    async getUserDiscountData(req: Request, res: Response) {
      const today = new Date();
      try {
        const user = req.user;
    
        if (!user) {
          return res.status(401).send("Unauthorized");
        }
    
        const discountData = await prisma.userDiscount.findFirst({
          where: {
            userId: parseInt(user.id), 
            expiresAt: { gt: today }, 
          },
        });
    
        if (!discountData) {
          return res.status(200).send({ message: "No valid discount found" });
        }
    
        return res.status(200).send({ message: "Success", data: discountData.discountPercentage });
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: (error as Error).message });
      }
    }

    async getTransactionData(req: Request, res: Response) {
      const today = new Date();
        try {
          const user = req.user;
    
          if (!user) {
            return res.status(401).send("Unauthorized");
          }
    
            const transactionData = await prisma.transaction.findMany({
              include: {
                event: {
                  select: {
                    name: true,
                  },
                },
              },
              where: {
                userId: parseInt(user.id),
              },
            });
    
          return res.status(200).send({
            message: "Success",
            data: transactionData,
          });
        } catch (error) {
          console.error(error);
          res.status(500).json({ message: (error as Error).message });
        }
      }

    async createTransaction(req: Request, res: Response) {
      // const errors = validationResult(req);
  
      // if (!errors.isEmpty()) {
      //   return res.status(400).json({ errors: errors.array() }); // Return validation errors
      // }
  
      const user = req.user;
      if (!user) {
        throw new Error('Unauthorized');
      }
      
      const { eventId, ticketAmount, totalAmount, pointAmount, discountAmount, finalAmount, discountId } = req.body;
  
      try {
        const transaction = await prisma.transaction.create({
          data: { userId: Number(user.id), 
                  eventId: Number(eventId), 
                  ticketAmount: Number(ticketAmount), 
                  totalAmount: Number(totalAmount), 
                  pointAmount: Number(pointAmount),
                  discountAmount: Number(discountAmount),
                  finalAmount: Number(finalAmount),
                  status: "Pending"
                 },
        });
  
        if(!transaction){
          throw new Error('Error creating transactions');
        }

        if(discountId){
          const discount = await prisma.userDiscount.update({
          data:{
            status:"Used",
          },
          where: {
              id: parseInt(discountId)
          }
          })
  
          if(!discount){
            throw new Error('Error creating transactions');
          }
        }

        res.status(201).json({ message: "Success Order Tickets" });
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: (error as Error).message });
      }
    }

    async finishTransaction(req: Request, res: Response) {

      const user = req.user;
      if (!user) {
        throw new Error('Unauthorized');
      }
      
      const { id, type } = req.body;
  
      try {
        let status;
        if(type == 1){
          status = TransactionStatus.Completed;
        }
        else{
          status = TransactionStatus.Cancelled;
        }
        // transaction
        const transaction = await prisma.transaction.update({
            data:{
                status:status,
            },
            where: {
                id: parseInt(id)
            }
        })
        console.log("transaction")
        // transaction
  
        if(!transaction){
          throw new Error('Error Payment');
        }

        const transactionData = await prisma.transaction.findFirst({
          where: {
            id: parseInt(id)
          },
        });
      
        if(!transactionData){
          throw new Error('Error Payment');
        }

        if(status === "Completed"){
          //discount
          // if(parseInt(discountUser) !== 0){
          //   const discount = await prisma.userDiscount.update({
          //       data:{
          //           status:"Used",
          //       },
          //       where: {
          //           id: parseInt(discountUser)
          //       }
          //   })
  
          //   if(!discount){
          //     throw new Error('Error Payment');
          //   }
          // }
  
          // point
          const today = new Date();
          let point = transactionData.pointAmount;
          const userPoints = await prisma.userPoint.findMany({
            where: {
              userId: parseInt(user.id),
              expiresAt: { gt: today }
            },
            orderBy: 
            {
                expiresAt: 'asc',
            },
          });
  
          if(!userPoints){
            throw new Error('Error Payment');
          }
  
          for (const userPoint of userPoints) {
            if (point <= 0) {
              break;
            }
      
            const pointsToUse = Math.min(point, userPoint.points);
      
            const pointUpd = await prisma.userPoint.update({
              where: { id: userPoint.id },
              data: {
                points: Math.max(userPoint.points - pointsToUse, 0), 
              },
            });
  
            if(!pointUpd){
              throw new Error('Error Payment');
            }
      
            point -= pointsToUse; 
          }

          // seat
          const eventId = transactionData.eventId;
          const ticketAmount = transactionData.ticketAmount;
          const dataEvent = await prisma.event.findFirst({
            where: {
              id: eventId
            },
          });
          if(!dataEvent){
            throw new Error('Error Payment');
          }
          const currentSeat = dataEvent.availableSeats;
          const cutSeat = await prisma.event.update({
            where: { id: dataEvent.id },
            data: {
              availableSeats: currentSeat - ticketAmount,
            },
          });
          if(!cutSeat){
            throw new Error('Error Payment');
          }

           // make ticket
          for(let i = 0; i < ticketAmount; i++){
            const timestamp = Date.now().toString(36); // Convert current timestamp to a base-36 string
            const randomString = crypto.randomBytes(4).toString('hex');
            let credentials = `${timestamp}-${randomString}`;
            let ticket = await prisma.ticket.create({
              data: { 
                eventId: Number(eventId), 
                attendeeId: Number(user.id),
                credentials
              },
            });
        
          }


        }


        res.status(201).json({ message: "Success Payment Tickets" }); 
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: (error as Error).message }); 
      }
    }

    async createFreeTicket(req: Request, res: Response) {

      const user = req.user;
      if (!user) {
        throw new Error('Unauthorized');
      }
      
      const { eventId, seat, amount } = req.body;
  
      try {
          const cutSeat = await prisma.event.update({
            where: { id: parseInt(eventId) },
            data: {
              availableSeats: seat - amount,
            },
          });
          if(!cutSeat){
            throw new Error('Error Making Ticket');
          }

          for(let i = 0; i < amount; i++){
            const timestamp = Date.now().toString(36);
            const randomString = crypto.randomBytes(4).toString('hex');
            let credentials = `${timestamp}-${randomString}`;
            await prisma.ticket.create({
              data: { 
                eventId: Number(eventId), 
                attendeeId: Number(user.id),
                credentials
              },
            });
          }

        res.status(201).json({ message: "Success Make Ticket Tickets" }); 
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: (error as Error).message }); 
      }
    }
  }
