import request from 'supertest';
import express from 'express';
import { getAllEvents } from '../src/controllers/event.controller';
import prisma from '../src/prisma';
import App from '../src/app';

jest.mock("@/prisma")

describe('GET /api/event/events', () => {
    let app: express.Express;
  
    beforeAll(() => {
      const application = new App();
      app = application['app']; // Access the Express app instance from your App class
    });
  
    afterEach(() => {
      jest.clearAllMocks();
    });
  
    it('should fetch events successfully', async () => {
      // Mock data
      const events = [
        { id: 1, name: 'Event 1', description: 'Description 1', categoryId: 1, locationId: 1 },
        { id: 2, name: 'Event 2', description: 'Description 2', categoryId: 2, locationId: 2 },
      ];
      const total = events.length;
  
      // Mock Prisma calls
      (prisma.event.findMany as jest.Mock).mockResolvedValue(events);
      (prisma.event.count as jest.Mock).mockResolvedValue(total);
  
      const response = await request(app).get('/api/event/events');
  
      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        message: 'success',
        data: events,
        total,
      });
  
      expect(prisma.event.findMany).toHaveBeenCalledWith({
        skip: 0,
        take: 6,
        where: {},
        orderBy: { id: 'desc' },
      });
      expect(prisma.event.count).toHaveBeenCalledWith({ where: {} });
    });
  
    it('should handle errors gracefully', async () => {
      const error = new Error('Database error');
      (prisma.event.findMany as jest.Mock).mockRejectedValue(error);
  
      const response = await request(app).get('/api/event/events');
  
      expect(response.status).toBe(500);
      expect(response.body).toEqual({
        message: 'error',
        data: JSON.stringify(error),
      });
    });
  
    it('should apply query filters', async () => {
      const events = [
        { id: 1, name: 'Filtered Event 1', description: 'Description 1', categoryId: 1, locationId: 1 },
      ];
      const total = events.length;
  
      (prisma.event.findMany as jest.Mock).mockResolvedValue(events);
      (prisma.event.count as jest.Mock).mockResolvedValue(total);
  
      const response = await request(app)
        .get('/api/event/events')
        .query({ page: 2, pageSize: 1, categoryId: 1, locationId: 1, query: 'Filtered' });
  
      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        message: 'success',
        data: events,
        total,
      });
  
      expect(prisma.event.findMany).toHaveBeenCalledWith({
        skip: 1,
        take: 1,
        where: {
          OR: [
            { name: { contains: 'Filtered' } },
            { description: { contains: 'Filtered' } },
          ],
          categoryId: 1,
          locationId: 1,
        },
        orderBy: { id: 'desc' },
      });
      expect(prisma.event.count).toHaveBeenCalledWith({
        where: {
          OR: [
            { name: { contains: 'Filtered' } },
            { description: { contains: 'Filtered' } },
          ],
          categoryId: 1,
          locationId: 1,
        },
      });
    });
  });
