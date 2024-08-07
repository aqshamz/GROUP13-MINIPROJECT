import { Request, Response } from 'express';
import prisma from '@/prisma';
import { validationResult } from 'express-validator';
import { compare, genSalt, hash } from "bcrypt";
import { sign } from "jsonwebtoken"

export class UserController {
  async getUsersData(req: Request, res: Response) {
    const userData = await prisma.user.findMany();

    return res.status(200).send(userData);
  }

  async createUserData(req: Request, res: Response) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() }); 
    }

    const { username, password, email, role, referralCode } = req.body;

    const referralCodeNew = username+Math.floor(Math.random() * 99999);

    const salt = await genSalt(10);
    const hashedPassword = await hash(password, salt)
    try {

      const user = await prisma.user.create({
        data: { username, password: hashedPassword, email, role, referralCode: referralCodeNew },
      });

      if(!user){
        throw new Error('Error creating user');
      }

      // update referral
      if(referralCode){
        const getIdReferred = await prisma.user.findFirst({
          where: { referralCode },
        });

        if(getIdReferred){
          const threeMonthsFromNow = new Date();
          threeMonthsFromNow.setMonth(threeMonthsFromNow.getMonth() + 3);
  
          const pointDb = await prisma.userPoint.create({
            data: { userId: getIdReferred.id, points: 10000, expiresAt: threeMonthsFromNow },
          });

          if(!pointDb){
            throw new Error('Error creating points')
          }

          const discountDb = await prisma.userDiscount.create({
            data: { userId: user.id, discountPercentage: 10, status:"Available", expiresAt: threeMonthsFromNow },
          });

          if(!discountDb){
            throw new Error('Error creating discount')
          }

        }else{
          res.status(400).json({ message: "Referral Code not found" });
        }
      }
      // update referral
      res.status(201).json({ message: "Success Create Account" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: (error as Error).message }); 
    }
  }

  async loginUser(req: Request, res: Response) {
    try {
      const { email, password } = req.body

        const login = await prisma.user.findFirst({
            where: {
                email:email
            }
        })

        if(!login){
          throw new Error('Invalid email or password');
        } 

        const suspendTimes = await prisma.user.update({
            data:{
                attempts:0,
                suspend:false
            },
            where: {
                id:login.id
            }
        })

        const jwtPayload = { id:login.id, username:login.username, email:email, role:login.role }
        const token = await sign(jwtPayload, "mySecretKey", { expiresIn: '1h' })
      
        return res.status(200).send({
            message:"Success",
            data: login,
            token: token,
        })


    } catch (error) {
      console.error(error);
      res.status(500).json({ message: (error as Error).message });
    }
  }

  async getTicketData(req: Request, res: Response) {
    // const today = new Date();
      try {
        const user = req.user;
  
        if (!user) {
          return res.status(401).send("Unauthorized");
        }
  
          const ticketData = await prisma.ticket.findMany({
            include: {
              event: {
                select: {
                  name: true,
                  datetime: true,
                  location: { // Include location data
                    select: { // Specify location data to fetch (optional)
                      name: true, // Example: Include location name
                    },
                  },
                },
              },
            },
            where: {
              attendeeId: parseInt(user.id),
            },
            orderBy: 
            {
              createdAt: 'desc',
            },
          });
  
        return res.status(200).send({
          message: "Success",
          data: ticketData,
        });
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: (error as Error).message });
      }
    }
}
