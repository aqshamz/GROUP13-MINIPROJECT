import { PaymentController } from '@/controllers/payment.controller';
import { Router } from 'express';
import { verifyToken } from '@/middlewares/jwt.middleware';

export class PaymentRouter {
  private router: Router;
  private paymentController: PaymentController;

  constructor() {
    this.paymentController = new PaymentController();
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get('/points', verifyToken, this.paymentController.getUserPointsData);
    this.router.get('/discounts', verifyToken, this.paymentController.getUserDiscountData);
  }

  getRouter(): Router {
    return this.router;
  }
}