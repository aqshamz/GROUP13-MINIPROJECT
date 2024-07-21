import { Request, Response } from 'express';
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

    const { name, description, datetime, locationId, categoryId, organizerId, availableSeats, price, eventType } = req.body;

    // Type assertion for req.files
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };

    // Ensure req.files is defined and of type Express.Multer.File[]
    const pictureFile = files['picture']?.[0];
    const thumbnailFile = files['thumbnail']?.[0];

    const picturePath = pictureFile ? pictureFile.path : undefined;
    const thumbnailPath = thumbnailFile ? thumbnailFile.path : undefined;

    try {
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
  const { page = 1, pageSize = 5, categoryId, query } = req.query;
  const skip = (Number(page) - 1) * Number(pageSize);
  const take = Number(pageSize);

  console.log(`Fetching events with page: ${page}, pageSize: ${pageSize}, skip: ${skip}, take: ${take}`);

  try {
    const where: any = {
      OR: query ? [
        { title: { contains: query } },
        { description: { contains: query } }
      ] : undefined,
    };

    if (categoryId) {
      where.categoryId = Number(categoryId);
    }

    // Correctly using count method without nested select
    const total = await prisma.event.count({ where });
    const events = await prisma.event.findMany({ skip, take, where });

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
  const { categoryId, page = 1, pageSize = 5 } = req.query;
  const skip = (Number(page) - 1) * Number(pageSize);
  const take = Number(pageSize);

  console.log(`Fetching events for category ${categoryId} with page: ${page}, pageSize: ${pageSize}, skip: ${skip}, take: ${take}`);

  try {
    if (!categoryId) {
      return res.status(400).send({
        message: "categoryId query parameter is required",
      });
    }

    const total = await prisma.event.count({
      where: { categoryId: Number(categoryId) },
    });
    const events = await prisma.event.findMany({
      where: { categoryId: Number(categoryId) },
      skip,
      take,
    });

    console.log(`Total events for category ${categoryId}: ${total}`);
    console.log(`Fetched events: ${events.length}`);

    if (events.length === 0) {
      return res.status(404).send({
        message: "No events found for the given categoryId",
      });
    }

    return res.status(200).send({
      message: "success",
      data: events,
      total,
    });
  } catch (err) {
    console.error(`Error fetching events for category ${categoryId}:`, err);
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
  const { locationId, page = 1, pageSize = 5 } = req.query;
  const skip = (Number(page) - 1) * Number(pageSize);
  const take = Number(pageSize);

  console.log(`Fetching events for location ${locationId} with page: ${page}, pageSize: ${pageSize}, skip: ${skip}, take: ${take}`);

  try {
    if (!locationId) {
      return res.status(400).send({
        message: "locationId query parameter is required",
      });
    }

    const total = await prisma.event.count({
      where: { locationId: Number(locationId) },
    });
    const events = await prisma.event.findMany({
      where: { locationId: Number(locationId) },
      skip,
      take,
    });

    console.log(`Total events for location ${locationId}: ${total}`);
    console.log(`Fetched events: ${events.length}`);

    if (events.length === 0) {
      return res.status(404).send({
        message: "No events found for the given locationId",
      });
    }

    return res.status(200).send({
      message: "success",
      data: events,
      total,
    });
  } catch (err) {
    console.error(`Error fetching events for location ${locationId}:`, err);
    return res.status(500).send({
      message: "error",
      data: JSON.stringify(err),
    });
  }
};

export const getEventsByCategoryAndLocation = async (req: Request, res: Response) => {
  const { categoryId, locationId, page = 1, pageSize = 5 } = req.query;
  const skip = (Number(page) - 1) * Number(pageSize);
  const take = Number(pageSize);

  console.log(`Fetching events for category ${categoryId} and location ${locationId} with page: ${page}, pageSize: ${pageSize}, skip: ${skip}, take: ${take}`);

  try {
    if (!categoryId || !locationId) {
      return res.status(400).send({
        message: "categoryId and locationId query parameters are required",
      });
    }

    const total = await prisma.event.count({
      where: { 
        categoryId: Number(categoryId),
        locationId: Number(locationId)
      },
    });
    const events = await prisma.event.findMany({
      where: { 
        categoryId: Number(categoryId),
        locationId: Number(locationId)
      },
      skip,
      take,
    });

    console.log(`Total events for category ${categoryId} and location ${locationId}: ${total}`);
    console.log(`Fetched events: ${events.length}`);

    if (events.length === 0) {
      return res.status(404).send({
        message: "No events found for the given categoryId and locationId",
      });
    }

    return res.status(200).send({
      message: "success",
      data: events,
      total,
    });
  } catch (err) {
    console.error(`Error fetching events for category ${categoryId} and location ${locationId}:`, err);
    return res.status(500).send({
      message: "error",
      data: JSON.stringify(err),
    });
  }
};

// export const createComment = async (req: Request, res: Response): Promise<void> => {
//   const { userId, eventId, text } = req.body;

//   try {
//     // Check if userId is valid
//     if (!userId || isNaN(parseInt(userId))) {
//       res.status(400).json({ error: "Invalid user ID" });
//       return;
//     }

//     // Check if eventId is valid
//     if (!eventId || isNaN(parseInt(eventId))) {
//       res.status(400).json({ error: "Invalid event ID" });
//       return;
//     }

//     // Check if the user exists
//     const userExists = await prisma.user.findUnique({
//       where: {
//         id: parseInt(userId),
//       },
//     });

//     if (!userExists) {
//       res.status(400).send({ message: "User does not exist" });
//       return;
//     }

//     // Check if the event exists
//     const eventExists = await prisma.event.findUnique({
//       where: {
//         id: parseInt(eventId),
//       },
//     });

//     if (!eventExists) {
//       res.status(400).send({ message: "Event does not exist" });
//       return;
//     }

//     // Create the comment
//     const comment = await prisma.comment.create({
//       data: {
//         text: String(text),
//         userId: parseInt(userId),
//         eventId: parseInt(eventId),
//       },
//     });

//     res.status(200).send({ message: "Comment created successfully", data: comment });
//   } catch (err) {
//     console.error("Error creating comment:", err);
//     res.status(500).send({ message: "Error creating comment", error: err });
//   }
// };

// export const getCommentByEventId = async (req: Request, res: Response): Promise<void> => {
//   const { eventId } = req.params;

//   try {
//     // Check if eventId is valid
//     if (!eventId || isNaN(Number(eventId))) {
//       res.status(400).json({ error: "Invalid event ID" });
//       return;
//     }

//     // Check if the event exists
//     const eventExists = await prisma.event.findUnique({
//       where: {
//         id: Number(eventId),
//       },
//     });

//     if (!eventExists) {
//       res.status(404).send({ message: "Event does not exist" });
//       return;
//     }

//     // Get comments for the event
//     const comments = await prisma.comment.findMany({
//       where: {
//         eventId: Number(eventId),
//       },
//       include: {
//         user: {
//           select: {
//             id: true,
//             name: true,
//             email: true,
//           },
//         },
//       },
//     });

//     res.status(200).send({ message: "Comments retrieved successfully", data: comments });
//   } catch (err) {
//     console.error("Error retrieving comments:", err);
//     res.status(500).send({ message: "Error retrieving comments", error: err });
//   }
// };

// export const buyTicket = async (req: Request, res: Response): Promise<Response<any, Record<string, any>>> => {
//   const { eventId } = req.params; // Extract eventId from request parameters
//   const { userId } = req.body; // Extract userId from request body

//   try {
//     // Check if the user exists
//     const userExists = await prisma.user.findUnique({
//       where: { id: parseInt(userId) },
//     });

//     if (!userExists) {
//       return res.status(400).send({ message: "User does not exist" });
//     }

//     // Check if the event exists and has available seats
//     const event = await prisma.event.findUnique({
//       where: { id: parseInt(eventId) }, // Ensure eventId is properly parsed to integer
//     });

//     if (!event) {
//       return res.status(404).send({ message: "Event not found" });
//     }

//     if (event.availableSeats <= 0) {
//       return res.status(400).send({ message: "No available seats for this event" });
//     }

//     // Create a ticket for the user and decrement availableSeats
//     const createdTicket = await prisma.$transaction(async (prisma) => {
//         const ticket = await prisma.ticket.create({
//           data: {
//             userId: parseInt(userId),
//             eventId: parseInt(eventId),
//           },
//         });

//       await prisma.event.update({
//         where: { id: parseInt(eventId) },
//         data: {
//           availableSeats: {
//             decrement: 1,
//           },
//         },
//       });

//       return ticket;
//     });

//     return res.status(200).send({ message: "Ticket purchased successfully", data: createdTicket });
//   } catch (err) {
//     console.error("Error purchasing ticket:", err);
//     return res.status(500).send({ message: "Error purchasing ticket", error: err });
//   }
// };

// export const checkUserTicket = async (req: Request, res: Response) => {
//   const { userId, eventId } = req.body;

//   try {
//     const ticket = await prisma.ticket.findFirst({
//       where: {
//         userId: parseInt(userId),
//         eventId: parseInt(eventId),
//       },
//     });

//     if (!ticket) {
//       return res.status(400).send({ message: "User has not bought a ticket for this event" });
//     }

//     return res.status(200).send({ message: "User has bought a ticket for this event" });
//   } catch (error) {
//     console.error('Error checking user ticket:', error);
//     return res.status(500).send({ message: "Internal Server Error" });
//   }
// };

