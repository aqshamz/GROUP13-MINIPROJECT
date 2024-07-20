import { Request, Response } from 'express';
import prisma from '@/prisma';
import { validationResult } from 'express-validator';
import { sign } from "jsonwebtoken"

export class PaymentController {
    async getUserPointsData(req: Request, res: Response) {
    const today = new Date();
      try {
        // Access user from the req object
        const user = req.user;
  
        if (!user) {
          return res.status(401).send("Unauthorized");
        }
  
        // Fetch user points data based on user id
        const pointsData = await prisma.userPoint.aggregate({
          where: {
            userId: parseInt(user.id),
            expiresAt: { gt: today }
          },
          _sum: {
            points: true, // Select the 'point' field for summation
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
        // Access user from the req object
        const user = req.user;
    
        if (!user) {
          return res.status(401).send("Unauthorized");
        }
    
        // Fetch user discount data based on user id and expiry date
        const discountData = await prisma.userDiscount.findFirst({
          where: {
            userId: parseInt(user.id), // Assuming 'userId' exists in userDiscount model
            expiresAt: { gt: today }, // Filter for discounts valid after today
          },
        });
    
        if (!discountData) {
          // Handle case where no valid discount is found (optional)
          return res.status(200).send({ message: "No valid discount found" });
        }
    
        return res.status(200).send({ message: "Success", data: discountData.discountPercentage });
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: (error as Error).message });
      }
    }
  }
