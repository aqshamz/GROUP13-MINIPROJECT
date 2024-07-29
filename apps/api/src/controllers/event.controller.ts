import { Request, Response } from 'express';
import { Prisma } from '@prisma/client';
import prisma from '../prisma'
import multer, { diskStorage } from 'multer';



const storage = diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === 'picture') {
      cb(null, "public/pictures");
    } else if (file.fieldname === 'thumbnail') {
      cb(null, "public/thumbnails");
    }
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage }).fields([
  { name: 'picture', maxCount: 1 },
  { name: 'thumbnail', maxCount: 1 },
]);

export const createEvent = async (req: Request, res: Response): Promise<void> => {
  upload(req, res, async (err: any) => {
    if (err) {
      return res.status(500).send({ message: "Error uploading files", error: err });
    }

    const { name, description, datetime, locationId, categoryId, availableSeats, price, eventType } = req.body;

    // Type assertion for req.files
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };

    // Ensure req.files is defined and of type Express.Multer.File[]
    const pictureFile = files['picture']?.[0];
    const thumbnailFile = files['thumbnail']?.[0];

    const picturePath = pictureFile ? pictureFile.path : undefined;
    const thumbnailPath = thumbnailFile ? thumbnailFile.path : undefined;

    try {
      const organizerId = req.user?.id;
      console.log(`req.user--> ${req.user?.id}`)
      // Check if the user exists
      if (!organizerId || isNaN(parseInt(organizerId))) {
        return res.status(400).json({ error: 'Invalid organizer ID' });
      }

      const userExists = await prisma.user.findUnique({
        where: {
          id: parseInt(organizerId),
        },
      });

      if (!userExists) {
        return res.status(400).send({ message: "User does not exist" });
      }

      const event = await prisma.event.create({
        data: {
          name: String(name),
          description: String(description),
          datetime: new Date(String(datetime)),
          locationId: parseInt(locationId),
          picture: String(picturePath),
          thumbnail: String(thumbnailPath),
          organizerId: parseInt(organizerId),
          categoryId: parseInt(categoryId),
          availableSeats: parseInt(availableSeats),
          price: parseFloat(price),
          eventType: eventType,
          
        },
      });

      

      return res.status(200).send({ message: "Event created successfully", data: event });
    } catch (err) {
      console.error("Error saving event:", err);
      return res.status(500).send({ message: "Error saving event", error: err });
    }
  });
};




export const getAllEvents = async (req: Request, res: Response) => {
  const { page = 1, pageSize = 6, categoryId, locationId, query } = req.query;
  const skip = (Number(page) - 1) * Number(pageSize);
  const take = Number(pageSize);

  console.log(`Fetching events with page: ${page}, pageSize: ${pageSize}, skip: ${skip}, take: ${take}`);

  try {
    const where: Prisma.EventWhereInput = {
      OR: query ? [
        { name: { contains: query as string } },
        { description: { contains: query as string } }
      ] : undefined,
    };

    if (categoryId) {
      where.categoryId = Number(categoryId);
    }

    if (locationId) {
      where.locationId = Number(locationId);
    }

    const total = await prisma.event.count({ where });
    const events = await prisma.event.findMany({ skip, take, where, orderBy: {
      id: 'desc', 
    } });

    console.log(`Total events: ${total}`);
    console.log(`Fetched events: ${events.length}`);

    return res.status(200).send({
      message: "success",
      data: events,
      total,
    });
  } catch (err) {
    console.error("Error fetching events:", err);
    return res.status(500).send({
      message: "error",
      data: JSON.stringify(err),
    });
  }
};




export const getEventById = async (req: Request, res: Response) => {
  const { id } = req.params;
  console.log('Received request for event ID:', id);
  console.log('Request method:', req.method);
  console.log('Request URL:', req.url);

  try {
    const event = await prisma.event.findUnique({
      where: { id: Number(id) }
    });

    if (event) {
      return res.status(200).send({
        message: "success",
        data: event
      });
    } else {
      return res.status(404).send({
        message: "Event not found",
        data: null
      });
    }
  } catch (err) {
    return res.status(500).send({
      message: "error",
      data: JSON.stringify(err)
    });
  }
};

export const getAllCategories = async (req: Request, res: Response): Promise<void> => {
  try {
    const categories = await prisma.category.findMany();
    res.status(200).send({
      message: "success",
      data: categories
    });
  } catch (error) {
    res.status(500).send({
      message: "error",
      data: JSON.stringify(error)
    });
  }
};

export const getCategoryById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const category = await prisma.category.findUnique({
      where: { id: Number(id) }
    });

    if (category) {
      return res.status(200).send({
        message: "success",
        data: category
      });
    } else {
      return res.status(404).send({
        message: "Category not found",
        data: null
      });
    }
  } catch (err) {
    return res.status(500).send({
      message: "error",
      data: JSON.stringify(err)
    });
  }
};

export const getEventsByCategory = async (req: Request, res: Response) => {
  const { categoryId, page = 1, pageSize = 6, query } = req.query;
  const skip = (Number(page) - 1) * Number(pageSize);
  const take = Number(pageSize);

  console.log(`Fetching events by category with page: ${page}, pageSize: ${pageSize}, skip: ${skip}, take: ${take}, query: ${query}`);

  try {
    const where: Prisma.EventWhereInput = {
      categoryId: Number(categoryId),
      OR: query ? [
        { name: { contains: query as string } },
        { description: { contains: query as string } }
      ] : undefined,
    };

    const total = await prisma.event.count({ where });
    const events = await prisma.event.findMany({ skip, take, where, orderBy: {
      id: 'desc', 
    } });

    console.log(`Total events: ${total}`);
    console.log(`Fetched events: ${events.length}`);

    return res.status(200).send({
      message: "success",
      data: events,
      total,
    });
  } catch (err) {
    console.error("Error fetching events by category:", err);
    return res.status(500).send({
      message: "error",
      data: JSON.stringify(err),
    });
  }
};

export const getAllLocations = async (req: Request, res: Response): Promise<void> => {
  try {
    const locations = await prisma.location.findMany();
    res.status(200).send({
      message: "success",
      data: locations
    });
  } catch (error) {
    res.status(500).send({
      message: "error",
      data: JSON.stringify(error)
    });
  }
};

export const getLocationById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const location = await prisma.location.findUnique({
      where: { id: Number(id) }
    });

    if (location) {
      return res.status(200).send({
        message: "success",
        data: location
      });
    } else {
      return res.status(404).send({
        message: "Location not found",
        data: null
      });
    }
  } catch (err) {
    return res.status(500).send({
      message: "error",
      data: JSON.stringify(err)
    });
  }
};

export const getEventsByLocation = async (req: Request, res: Response) => {
  const { locationId, page = 1, pageSize = 6, query } = req.query;
  const skip = (Number(page) - 1) * Number(pageSize);
  const take = Number(pageSize);

  console.log(`Fetching events by location with page: ${page}, pageSize: ${pageSize}, skip: ${skip}, take: ${take}, query: ${query}`);

  try {
    const where: Prisma.EventWhereInput = {
      locationId: Number(locationId),
      OR: query ? [
        { name: { contains: query as string } },
        { description: { contains: query as string } }
      ] : undefined,
    };

    const total = await prisma.event.count({ where });
    const events = await prisma.event.findMany({ skip, take, where, orderBy: {
      id: 'desc', 
    } });

    console.log(`Total events: ${total}`);
    console.log(`Fetched events: ${events.length}`);

    return res.status(200).send({
      message: "success",
      data: events,
      total,
    });
  } catch (err) {
    console.error("Error fetching events by location:", err);
    return res.status(500).send({
      message: "error",
      data: JSON.stringify(err),
    });
  }
};

export const getEventsByCategoryAndLocation = async (req: Request, res: Response) => {
  const { categoryId, locationId, page = 1, pageSize = 6, query } = req.query;
  const skip = (Number(page) - 1) * Number(pageSize);
  const take = Number(pageSize);

  console.log(`Fetching events by category and location with page: ${page}, pageSize: ${pageSize}, skip: ${skip}, take: ${take}, query: ${query}`);

  try {
    const where: Prisma.EventWhereInput = {
      categoryId: Number(categoryId),
      locationId: Number(locationId),
      OR: query ? [
        { name: { contains: query as string } },
        { description: { contains: query as string } }
      ] : undefined,
    };

    const total = await prisma.event.count({ where });
    const events = await prisma.event.findMany({ skip, take, where, orderBy: {
      id: 'desc', 
    } });

    console.log(`Total events: ${total}`);
    console.log(`Fetched events: ${events.length}`);

    return res.status(200).send({
      message: "success",
      data: events,
      total,
    });
  } catch (err) {
    console.error("Error fetching events by category and location:", err);
    return res.status(500).send({
      message: "error",
      data: JSON.stringify(err),
    });
  }
};

export const createEventDiscount = async (req: Request, res: Response): Promise<void> => {
  const { eventId } = req.params; // Get eventId from URL parameters
  const { code, discountPercentage, validFrom, validTo } = req.body;

  try {
    // Validate the input
    if (!eventId || isNaN(parseInt(eventId))) {
      res.status(400).json({ error: 'Invalid event ID' });
      return;
    }
    if (!code || typeof code !== 'string') {
      res.status(400).json({ error: 'Invalid discount code' });
      return;
    }
    if (!discountPercentage || isNaN(parseInt(discountPercentage)) || parseInt(discountPercentage) <= 0) {
      res.status(400).json({ error: 'Invalid discount percentage' });
      return;
    }
    if (!validFrom || isNaN(Date.parse(validFrom))) {
      res.status(400).json({ error: 'Invalid validFrom date' });
      return;
    }
    if (!validTo || isNaN(Date.parse(validTo))) {
      res.status(400).json({ error: 'Invalid validTo date' });
      return;
    }

    // Check if the event exists
    const eventExists = await prisma.event.findUnique({
      where: {
        id: parseInt(eventId),
      },
    });

    if (!eventExists) {
      res.status(400).send({ message: "Event does not exist" });
      return;
    }

    // Create the event discount
    const eventDiscount = await prisma.eventDiscount.create({
      data: {
        eventId: parseInt(eventId),
        code: String(code),
        discountPercentage: parseInt(discountPercentage),
        validFrom: new Date(String(validFrom)),
        validTo: new Date(String(validTo)),
      },
    });

    res.status(200).send({ message: "Event discount created successfully", data: eventDiscount });
  } catch (err) {
    console.error("Error creating event discount:", err);
    res.status(500).send({ message: "Error creating event discount", error: err });
  }
};



export const applyEventDiscount = async (req: Request, res: Response): Promise<void> => {
  const { eventId } = req.params;
  const { code } = req.body;

  try {
    if (!eventId || isNaN(parseInt(eventId))) {
      res.status(400).json({ error: 'Invalid event ID' });
      return;
    }

    const currentDate = new Date();

    const eventDiscount = await prisma.eventDiscount.findFirst({
      where: {
        eventId: parseInt(eventId),
        code: code,
        validFrom: {
          lte: currentDate,
        },
        validTo: {
          gte: currentDate,
        },
      },
    });

    if (!eventDiscount) {
      res.status(400).json({ error: 'Invalid or expired discount code' });
      return;
    }

    const event = await prisma.event.findUnique({
      where: {
        id: parseInt(eventId),
      },
    });

    if (!event) {
      res.status(400).send({ message: "Event does not exist" });
      return;
    }

    const discountAmount = (event.price.toNumber() * eventDiscount.discountPercentage) / 100;
    const discountedPrice = event.price.toNumber() - discountAmount;

    res.status(200).json({ 
      message: 'Discount applied successfully', 
      discount: eventDiscount, 
      discountedPrice 
    });
  } catch (err) {
    console.error("Error applying discount:", err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const createComment = async (req: Request, res: Response) => {
  const userId = req.user?.id as number | undefined;

  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const { eventId, rating, text } = req.body;

  try {
    // Ensure eventId and rating are numbers
    const eventIdNum = parseInt(eventId, 10);
    const ratingNum = parseFloat(rating);

    // Check if the user has completed a transaction for the event
    const transaction = await prisma.transaction.findFirst({
      where: {
        userId: userId,
        eventId: eventIdNum,
        status: 'Completed'
      },
      
    });

    if (!transaction) {
      return res.status(403).json({ message: 'You need to purchase a ticket for this event before commenting.' });
    }

    // Create the comment
    const comment = await prisma.comment.create({
      data: {
        transactionId: transaction.id,
        attendeeId: userId,
        rating: ratingNum,
        text
      }
    });

    res.status(201).json(comment);
  } catch (error: unknown) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const getCommentsByEvent = async (req: Request, res: Response) => {
  const { eventId } = req.params;

  try {
    const eventIdNum = parseInt(eventId, 10);

    const comments = await prisma.comment.findMany({
      where: {
        transaction: {
          eventId: eventIdNum,
        },
      },
      include: {
        transaction: {
          include: {
            user: true, // Include the user relation within the transaction
          },
        },
      },
      
    });

    res.status(200).json({ data: comments });
  } catch (error: unknown) {
    res.status(500).json({ error: (error as Error).message });
  }
};









