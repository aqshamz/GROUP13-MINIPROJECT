import { Request, Response } from 'express';
import prisma from '@/prisma';

export class ManagementController {

    async getEventById(req: Request, res: Response) {
        try {
            const user = req.user;
            if (!user) {
                return res.status(401).send("Unauthorized");
            }

            const [eventData, eventCount] = await Promise.all([
                prisma.event.findMany({
                    include: {
                        location: {
                            select: {
                                name: true,
                            },
                        },
                    },
                    where: {
                        organizerId: parseInt(user.id),
                    },
                }),
                prisma.event.count({
                    where: {
                        organizerId: parseInt(user.id),
                    },
                })
            ]);

            return res.status(200).send({
                message: "Success",
                data: eventData,
                count: eventCount
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: (error as Error).message });
        }
    }

    async getTransactionById(req: Request, res: Response) {
        try {
            const user = req.user;
            if (!user) {
                return res.status(401).send("Unauthorized");
            }

            const [transactionData, transactionCount] = await Promise.all([
                prisma.transaction.findMany({
                    include: {
                        user: {
                            select: {
                                username: true,
                            },
                        },
                        event: {
                            select: {
                                name: true,
                            },
                        }
                    },
                    where: {
                        event: {
                            organizerId: parseInt(user.id),
                        },
                    },
                }),
                prisma.transaction.count({
                    where: {
                        event: {
                            organizerId: parseInt(user.id),
                        },
                    },
                })
            ]);

            return res.status(200).send({
                message: "Success",
                data: transactionData,
                count: transactionCount
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: (error as Error).message });
        }
    }

    async getTicketById(req: Request, res: Response) {
        try {
            const user = req.user;
            if (!user) {
                return res.status(401).send("Unauthorized");
            }

            const [ticketData, ticketCount] = await Promise.all([
                prisma.ticket.findMany({
                    include: {
                        attendee: {
                            select: {
                                username: true,
                            },
                        },
                        event: {
                            select: {
                                name: true,
                                datetime: true,
                            },
                        }
                    },
                    where: {
                        event: {
                            organizerId: parseInt(user.id),
                        },
                    },
                }),
                prisma.ticket.count({
                    where: {
                        event: {
                            organizerId: parseInt(user.id),
                        },
                    },
                })
            ]);

            return res.status(200).send({
                message: "Success",
                data: ticketData,
                count: ticketCount
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: (error as Error).message });
        }
    }
}
