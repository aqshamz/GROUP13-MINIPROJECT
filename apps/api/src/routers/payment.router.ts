import { PaymentController } from '@/controllers/payment.controller';
import { Router } from 'express';
import { verifyToken, customerGuard } from '@/middlewares/jwt.middleware';

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
    this.router.post('/order', verifyToken, customerGuard, this.paymentController.createTransaction);
    this.router.post('/transaction', verifyToken, customerGuard, this.paymentController.finishTransaction);
    this.router.get('/transaction', verifyToken, customerGuard, this.paymentController.getTransactionData);
    this.router.post('/ticket', verifyToken, customerGuard, this.paymentController.createFreeTicket);
  }

  getRouter(): Router {
    return this.router;
  }
}