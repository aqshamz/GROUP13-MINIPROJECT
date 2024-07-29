import { ManagementController } from '@/controllers/management.controller';
import { Router } from 'express';
import { verifyToken, organizerGuard } from '@/middlewares/jwt.middleware';

export class ManagementRouter {
  private router: Router;
  private managementController: ManagementController;

  constructor() {
    this.managementController = new ManagementController();
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get('/eventbyid', verifyToken, organizerGuard, this.managementController.getEventById);
    this.router.get('/transactionbyid', verifyToken, organizerGuard, this.managementController.getTransactionById);
    this.router.get('/ticketbyid', verifyToken, organizerGuard, this.managementController.getTicketById);
    this.router.get('/allavailable', verifyToken, organizerGuard, this.managementController.getAllAvailable);
    this.router.get('/allbooked', verifyToken, organizerGuard, this.managementController.getAllBooked);
    this.router.get('/transactionstats', verifyToken, organizerGuard, this.managementController.getTransactionStats);
    this.router.get('/revenue', verifyToken, organizerGuard, this.managementController.getRevenue);
  }

  getRouter(): Router {
    return this.router;
  }
}