import request from 'supertest';
import express from 'express';
import { getEventsByCategory } from '../src/controllers/event.controller';
import prisma from '../src/prisma';
import App from '../src/app';

jest.mock("@/prisma")

describe('GET /api/event/eventsByCategory', () => {
    let app: express.Express;
  
    beforeAll(() => {
      const application = new App();
      app = application['app'];
      app.get('/api/event/eventsByCategory', getEventsByCategory);
    });
  
    afterEach(() => {
      jest.clearAllMocks();
    });
  
    it('should fetch events by category successfully', async () => {
      const events = [
        { id: 1, name: 'Event 1', description: 'Description 1', categoryId: 1 },
        { id: 2, name: 'Event 2', description: 'Description 2', categoryId: 1 },
      ];
      const total = events.length;
  
      (prisma.event.count as jest.Mock).mockResolvedValue(total);
      (prisma.event.findMany as jest.Mock).mockResolvedValue(events);
  
      const response = await request(app).get('/api/event/eventsByCategory').query({ categoryId: 1 });
  
      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        message: 'success',
        data: events,
        total,
      });
  
      expect(prisma.event.count).toHaveBeenCalledWith({
        where: {
          categoryId: 1,
        },
      });
      expect(prisma.event.findMany).toHaveBeenCalledWith({
        skip: 0,
        take: 6,
        where: {
          categoryId: 1,
        },
        orderBy: { id: 'desc' },
      });
    });
  
    it('should handle errors gracefully', async () => {
      const error = new Error('Database error');
      (prisma.event.count as jest.Mock).mockRejectedValue(error);
  
      const response = await request(app).get('/api/event/eventsByCategory').query({ categoryId: 1 });
  
      expect(response.status).toBe(500);
      expect(response.body).toEqual({
        message: 'error',
        data: JSON.stringify(error),
      });
    });
  
    it('should apply query filters', async () => {
      const events = [
        { id: 1, name: 'Filtered Event 1', description: 'Description 1', categoryId: 1 },
      ];
      const total = events.length;
  
      (prisma.event.count as jest.Mock).mockResolvedValue(total);
      (prisma.event.findMany as jest.Mock).mockResolvedValue(events);
  
      const response = await request(app)
        .get('/api/event/eventsByCategory')
        .query({ categoryId: 1, page: 2, pageSize: 1, query: 'Filtered' });
  
      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        message: 'success',
        data: events,
        total,
      });
  
      expect(prisma.event.count).toHaveBeenCalledWith({
        where: {
          categoryId: 1,
          OR: [
            { name: { contains: 'Filtered' } },
            { description: { contains: 'Filtered' } },
          ],
        },
      });
      expect(prisma.event.findMany).toHaveBeenCalledWith({
        skip: 1,
        take: 1,
        where: {
          categoryId: 1,
          OR: [
            { name: { contains: 'Filtered' } },
            { description: { contains: 'Filtered' } },
          ],
        },
        orderBy: { id: 'desc' },
      });
    });
  });