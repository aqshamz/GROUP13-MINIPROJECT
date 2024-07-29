import request from 'supertest';
import express, { Request, Response, NextFunction } from 'express';
import { createComment} from '../src/controllers/event.controller';
import { PrismaClient } from '@prisma/client';


import { verifyToken } from '../src/__mocks__/mockMiddleware';

const prisma = new PrismaClient();

jest.mock('@prisma/client', () => {
    const mockPrisma = {
      transaction: {
        findFirst: jest.fn(),
      },
      comment: {
        create: jest.fn(),
      },
    };
    return { PrismaClient: jest.fn(() => mockPrisma) };
  });
  
  const app = express();
  app.use(express.json());
  app.post('/comments', verifyToken, createComment);
  
  describe('POST /comments', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });
  
    it('should return 401 if the user is not authenticated', async () => {
      const response = await request(app).post('/comments').send({
        eventId: '1',
        rating: '5',
        text: 'Great event!',
      });
  
      expect(response.status).toBe(401);
      expect(response.body.message).toBe('Unauthorized');
    });
  
    it('should return 403 if the user has not completed a transaction for the event', async () => {
      (prisma.transaction.findFirst as jest.Mock).mockResolvedValue(null);
  
      const response = await request(app)
        .post('/comments')
        .set('Authorization', 'Bearer validToken') // Mocked token for authenticated user
        .send({
          eventId: '1',
          rating: '5',
          text: 'Great event!',
        });
  
      expect(response.status).toBe(403);
      expect(response.body.message).toBe('You need to purchase a ticket for this event before commenting.');
    });
  
    it('should create a comment if the user has completed a transaction for the event', async () => {
      const transaction = { id: 1, userId: '1', eventId: 1, status: 'Completed' }; // Ensure userId is a string
      const comment = {
        id: 1,
        transactionId: 1,
        attendeeId: '1', // Ensure attendeeId is a string
        rating: 5,
        text: 'Great event!',
      };
  
      (prisma.transaction.findFirst as jest.Mock).mockResolvedValue(transaction);
      (prisma.comment.create as jest.Mock).mockResolvedValue(comment);
  
      const response = await request(app)
        .post('/comments')
        .set('Authorization', 'Bearer validToken') // Mocked token for authenticated user
        .send({
          eventId: '1',
          rating: '5',
          text: 'Great event!',
        });
  
      expect(response.status).toBe(201);
      expect(response.body).toEqual(comment);
  
      expect(prisma.transaction.findFirst).toHaveBeenCalledWith({
        where: {
          userId: '1', // Ensure this is a string
          eventId: 1,
          status: 'Completed',
        },
      });
      expect(prisma.comment.create).toHaveBeenCalledWith({
        data: {
          transactionId: transaction.id,
          attendeeId: '1', // Ensure this is a string
          rating: 5,
          text: 'Great event!',
        },
      });
    });
  });