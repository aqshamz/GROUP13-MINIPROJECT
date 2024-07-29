import { createEvent,
      getAllEvents,
      getEventById,
      getAllCategories,
      getEventsByCategory,
      getAllLocations,
      getEventsByLocation,
      getEventsByCategoryAndLocation,
      createComment,
      getCommentsByEvent,
      // buyTicket,
      getCategoryById,
      getLocationById,
      createEventDiscount, 
      applyEventDiscount } from '@/controllers/event.controller';
import { Router } from 'express';
import { verifyToken, organizerGuard } from '@/middlewares/jwt.middleware';

export class EventRouter {
  private router: Router;
//   private eventController: EventController;

  constructor() {
    // this.eventController = new EventController();
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {

    this.router.get('/categories', getAllCategories);
    this.router.get('/categories/:id', getCategoryById);
    this.router.get('/eventsByCategory', getEventsByCategory);
    this.router.get('/locations', getAllLocations);
    this.router.get('/locations/:id', getLocationById);
    this.router.get('/eventsByLocation', getEventsByLocation);
    this.router.get('/eventsByCategoryAndLocation', getEventsByCategoryAndLocation);
    this.router.get('/events', getAllEvents);
    this.router.get('/:id', getEventById);
    this.router.get('/events/:eventId/comments', getCommentsByEvent);
    this.router.post('/add', verifyToken, organizerGuard, createEvent);
    this.router.post('/events/:eventId/discounts', createEventDiscount);
    this.router.post('/events/:eventId/apply-discount', applyEventDiscount);
   
    this.router.post('/comments', verifyToken, createComment);
    
    
  }

  getRouter(): Router {
    return this.router;
  }
}
