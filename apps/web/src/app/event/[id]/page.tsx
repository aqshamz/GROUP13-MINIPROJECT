"use client"


import { useEffect, useState, FormEvent} from 'react';
import { Text, Input, Button, Box, Textarea, Stack, Image } from '@chakra-ui/react';
import { useParams } from 'next/navigation';
import { getEventById, getCommentsByEventId, createComment, buyTicket, getCategoryById, getLocationById } from '@/api/event';
import { Event, Comment, Location, Category } from '../../interfaces';

const EventPage = () => {
  const { id } = useParams();
  const [event, setEvent] = useState<Event | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [userId, setUserId] = useState<string>('');
  const [commentText, setCommentText] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [commentLoading, setCommentLoading] = useState(false);
  const [ticketLoading, setTicketLoading] = useState(false);
  const [location, setLocation] = useState<Location | null>(null);
  const [category, setCategory] = useState<Category | null>(null);
  const formattedThumbnail = event?.picture.replace(/\\/g, '/');

  useEffect(() => {
    const fetchEventDetails = async (eventId: number) => {
      try {
        const response = await getEventById(eventId);
        setEvent(response.data);
        const locationResponse = await getLocationById(response.data.locationId);
        setLocation(locationResponse);
        

        const categoryResponse = await getCategoryById(response.data.categoryId);
        setCategory(categoryResponse);
        console.log('category:', categoryResponse)
        if (categoryResponse) {
          console.log('Category Name:', categoryResponse.name);
        }
        const commentsResponse = await getCommentsByEventId(eventId);
        setComments(commentsResponse.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching event details:', error);
        setLoading(false);
      }
    };

    if (id) {
      const eventId = parseInt(id as string, 10);
      if (!isNaN(eventId)) {
        fetchEventDetails(eventId);
      } else {
        console.error('Invalid event ID:', id);
        setLoading(false);
      }
    } else {
      console.error('Event ID is undefined');
      setLoading(false);
    }
  }, [id]);

  const handleCommentSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setCommentLoading(true);

    if (!userId || !commentText) {
      console.error('User ID and comment text are required');
      setCommentLoading(false);
      return;
    }

    try {
      const newComment = await createComment({ userId: parseInt(userId), eventId: parseInt(id as string), text: commentText });
      // Update comments state to include the new comment
      setComments([...comments, newComment.data]);
      setCommentText('');
    } catch (error) {
      console.error('Error creating comment:', error);
    } finally {
      setCommentLoading(false);
    }
  };

  const handleBuyTicket = async () => {
    setTicketLoading(true);

    try {
      await buyTicket({ userId: parseInt(userId), eventId: parseInt(id as string) });
      // Optionally update state or fetch updated event details
      console.log('Ticket purchased successfully');
      fetchEventDetails(parseInt(id as string));
    } catch (error) {
      console.error('Error purchasing ticket:', error);
      // Handle error, display message, or retry logic
    } finally {
      setTicketLoading(false);
    }
  };

  const isEventInFuture = () => {
    if (!event) return false; // If event data is not loaded yet
    const eventDate = new Date(event.date); // Assuming event.date is the date field of the event
    const today = new Date();
    return eventDate > today;
  };

  if (loading) {
    return <Text>Loading...</Text>;
  }

  if (!event) {
    return <Text>No event found</Text>;
  }

  return (
    
    <div className="container mx-auto p-4 mb-20">
    <Text as="h1" className="text-3xl font-bold mb-4">{event.title}</Text>
    <Image
        src={`http://localhost:5670/${formattedThumbnail}`}
        alt={`${event.title} picture`}
        width={350} // Adjust width as needed
        height={200} // Adjust height as needed
        className="rounded-md my-2"
    />
    <Text className="text-lg mb-2">{event.description}</Text>
    <Text className="text-lg mb-4">Date: {event.date}</Text>
    <Text className="text-lg mb-2">Location: {location ? location.name : 'Loading...'}</Text>
      <Text className="text-lg mb-2">Category: {category ? category.name : 'Loading...'}</Text>
      {!isEventInFuture() && (
        <Text className="text-lg mb-2">Available Seats: {event.availableSeats}</Text>
      )}
    <Text className="text-lg mb-4">Price: Rp{event.price}</Text>

    {isEventInFuture() ? (
        <div className="mb-4">
          <Input
            placeholder="Enter Your User ID"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            required
            className="mb-2 p-2 border rounded"
          />
          <Button
            onClick={handleBuyTicket}
            isLoading={ticketLoading}
            disabled={ticketLoading}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Buy Ticket
          </Button>
        </div>
      ) : (
        <>
          <form onSubmit={handleCommentSubmit} className="mb-8">
            <Stack spacing={3}>
              <Input
                placeholder="Your User ID"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                required
                className="p-2 border rounded"
              />
              <Textarea
                placeholder="Your Comment"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                required
                className="p-2 border rounded"
              />
              <Button type="submit" isLoading={commentLoading} className="bg-blue-500 text-white px-4 py-2 rounded">
                Submit Comment
              </Button>
            </Stack>
          </form>

          <div className="mt-8">
            <Text as="h2" className="text-2xl font-bold mb-4">Comments</Text>
            {comments.length === 0 ? (
              <Text>No comments yet.</Text>
            ) : (
              comments.map((comment) => (
                <div key={comment.id} className="mb-4 p-4 border rounded-md shadow-md">
                  <Text as="strong" className="block">{comment.user?.name || 'Unknown User'}:</Text>
                  <Text>{comment.text}</Text>
                </div>
              ))
            )}
          </div>
        </>
      )}

    </div>
  );
};

export default EventPage;