import { Request, Response, NextFunction } from "express";
import { body, validationResult } from "express-validator";
import prisma from '@/prisma';
import { compare } from "bcrypt";

export const validateCreateUser = [
  body('username')
    .trim()
    .notEmpty().withMessage('Username is required')
    .isLength({ min: 3 }).withMessage('Username must be at least 3 characters'),
  body('email')
    .trim()
    .isEmail().withMessage('Invalid email format')
    .notEmpty().withMessage('Email is required'),
  body('password')
    .trim()
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
  body('role')
    .trim()
    .notEmpty().withMessage('Role is required')
    .isIn(['Customer', 'Organizer']).withMessage('Invalid role'),
];

export const checkUserExists = async (req: Request, res: Response, next: NextFunction) => {
  const { username, email } = req.body;

  try {
    const [existingUsername, existingEmail] = await Promise.all([
      prisma.user.findFirst({ where: { username } }),
      prisma.user.findFirst({ where: { email } }),
    ]);

    if (existingUsername) {
      throw new Error('Username already exists');
    }

    if (existingEmail) {
      throw new Error('Email already exists');
    }

    next();
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
};

export const checkReferralCode = async (req: Request, res: Response, next: NextFunction) => {
  const { referralCode } = req.body;

  // Handle empty referral code
  if (!referralCode) {
    return next(); // If referral code is empty, skip the check and proceed
  }

  try {
    const referralChecker = await prisma.user.findFirst({
      where: { referralCode },
    });

    if (!referralChecker) {
      throw new Error('Referral Code not found');
    }

    next();
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
};

export const createUser = async (req: Request, res: Response) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { username, email, password, role, referralCode } = req.body;

  try {
    const user = await prisma.user.create({
      data: { username, email, password, role, referralCode }, // Include referralCode if provided
    });

    res.status(201).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating user' });
  }
};

export const loginAttempt = async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body
    try {
    const login = await prisma.user.findFirst({
        where: { email:email }
    })
    
    if(!login){
        throw new Error('Invalid email or password');
    }

    const isValidPassword = await compare(password, login.password)
    
    if(!isValidPassword){
        if(login.attempts === 2){
            const doSuspend = await prisma.user.update({
                data:{
                    attempts: login.attempts + 1,
                    suspend: true,
                },
                where: {
                    id:login.id
                }
            })
            throw new Error('Acount Suspended');
        }
    
        const doAttempt = await prisma.user.update({
            data:{
                attempts:login.attempts + 1
            },
            where: {
                id:login.id
            }
        })
        throw new Error('Invalid email or password');
    }
    
    if(login.suspend === true){
        throw new Error('Acount Suspended');
    }

    next();

    } catch (error) {
        res.status(400).json({ message: (error as Error).message });
    }
};

