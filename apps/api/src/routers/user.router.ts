import { UserController } from '@/controllers/user.controller';
import { Router } from 'express';
import { validateCreateUser, checkUserExists, checkReferralCode, loginAttempt } from '@/middlewares/user.middleware'
import { verifyToken, customerGuard } from '@/middlewares/jwt.middleware';

export class UserRouter {
  private router: Router;
  private userController: UserController;

  constructor() {
    this.userController = new UserController();
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get('/', this.userController.getUsersData);
    this.router.post('/', validateCreateUser, checkUserExists, checkReferralCode, this.userController.createUserData);
    this.router.post('/login', loginAttempt, this.userController.loginUser);
    this.router.get('/ticket', verifyToken, customerGuard, this.userController.getTicketData);
  }

  getRouter(): Router {
    return this.router;
  }
}
