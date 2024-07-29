// mockMiddleware.ts
import { Request, Response, NextFunction } from 'express';

export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  // Mock user ID from token for testing purposes
  req.user = { id: '1', username: 'test', email: 'test-email' };
  next();
};

export const organizerGuard = (req: Request, res: Response, next: NextFunction) => {
  if (req.user?.role === 'Organizer') {
    next();
  } else {
    res.status(401).send("Unauthorized");
  }
};
