"use client"


import { useEffect, useState, FormEvent } from 'react';
import { Text, Input, Button, Box, Textarea, Stack, Image, CheckboxGroup, Checkbox } from '@chakra-ui/react';
import { useParams, usePathname } from 'next/navigation';
import { getEventById, getCommentsByEventId, createComment, getCategoryById, getLocationById, applyEventDiscount } from '@/api/event';
import { Event, Comment, Location, Category } from '../../interfaces';
import { getRoleAndUserIdFromCookie } from '@/utils/roleFromCookie';

import ReactStars from 'react-stars';

const EventPage = () => {
  const { id } = useParams();
  const pathname = usePathname();
  const [event, setEvent] = useState<Event | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  
  const [commentText, setCommentText] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [commentLoading, setCommentLoading] = useState(false);
  const [ticketLoading, setTicketLoading] = useState(false);
  const [discountCode, setDiscountCode] = useState<string>('');
  const [discountResult, setDiscountResult] = useState<{ message: string, discountedPrice?: number } | null>(null);
  const [discountLoading, setDiscountLoading] = useState(false);
  const [discountApplied, setDiscountApplied] = useState(false);
  const [location, setLocation] = useState<Location | null>(null);
  const [category, setCategory] = useState<Category | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [userId, setUserId] = useState<number | null>(null);
  const [rating, setRating] = useState<number>(0);
  const [hasCommented, setHasCommented] = useState<boolean>(false);

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

        const commentsResponse = await getCommentsByEventId(eventId);
        console.log('Fetched comments:', commentsResponse); // Log the full response
        setComments(commentsResponse.data || []);

        // Check if the user has already commented
        if (userId) {
          const userComments = commentsResponse.data.filter(comment => comment.attendeeId === userId);
          setHasCommented(userComments.length > 0);
        }

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
  }, [id, userId]);

  useEffect(() => {
    fetchUserRoleAndId();
  }, []);

  const fetchUserRoleAndId = async () => {
    const data = await getRoleAndUserIdFromCookie();
    if (data) {
      setUserRole(data.role);
      setUserId(data.userId);
      console.log("role: >>", data.role);
      console.log("id: >>", data.userId);
    }
  };

  const handleCommentSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setCommentLoading(true);

    if (!userId || !commentText || rating === 0) {
      console.error('User ID, comment text, and rating are required');
      setCommentLoading(false);
      return;
    }

    if (hasCommented) {
      console.error('You have already submitted a comment for this event.');
      setCommentLoading(false);
      return;
    }

    try {
      await createComment({ userId: parseInt(userId), eventId: parseInt(id as string), text: commentText, rating });

      // Fetch updated comments
      const refreshedComments = await getCommentsByEventId(parseInt(id as string));
      setComments(refreshedComments.data);
      
      // Set the state to indicate the user has commented
      setHasCommented(true);

      setCommentText('');
      setRating(0);
    } catch (error) {
      console.error('Error creating comment:', error);
    } finally {
      setCommentLoading(false);
    }
  };

  const handleApplyDiscount = async () => {
    setDiscountLoading(true);

    try {
      const response = await applyEventDiscount(parseInt(id as string), discountCode);
      setDiscountResult({
        message: response.message,
        discountedPrice: response.discountedPrice,
      });
      setDiscountApplied(true);
    } catch (error: any) {
      setDiscountResult({
        message: error.response?.data?.error || 'An error occurred while applying the discount',
      });
    } finally {
      setDiscountLoading(false);
    }
  };

  const isEventInFuture = () => {
    if (!event) return false;
    const eventDate = new Date(event.datetime);
    const today = new Date();
    return eventDate > today;
  };

  const handleCreatePromotion = () => {
    window.location.href = `${pathname}/discount`;
  };

  const formatDate = (dateString: string) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' } as const;
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', options).format(date);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID').format(price);
  };

  if (loading) {
    return <Text className="max-container padding-container mx-auto p-4 mb-20">Loading...</Text>;
  }

  if (!event) {
    return <Text className="max-container padding-container mx-auto p-4 mb-20">No event found</Text>;
  }

  return (
    <div className="max-container padding-container mx-auto p-4 mb-20">
      <div className="w-full mb-8">
        <Image
          src={`http://localhost:8000/${formattedThumbnail}`}
          alt={`${event.name} picture`}
          className="rounded-md my-2 mx-auto"
          boxSize="100%"
          maxW="100vw"
          height="auto"
          objectFit="cover"
        />
      </div>
      <div className="lg:flex lg:space-x-8">
        <div className="lg:w-2/3 space-y-6">
          <Text as="h1" className="text-4xl font-bold mb-4">{event.name}</Text>
          <Text className="text-2xl font-semibold mb-2">About this event</Text>
          <p className="text-lg mb-2">{event.description}</p>
          <div className="mb-6">
            <Text className="text-2xl font-semibold">Date</Text>
            <Text className="text-lg">{formatDate(event.datetime)}</Text>
          </div>
          <div className="mb-6">
            <Text className="text-2xl font-semibold">Location</Text>
            <Text className="text-lg">{location ? location.name : 'Loading...'}</Text>
          </div>
          <div className="mb-6">
            <Text className="text-2xl font-semibold">Category</Text>
            <Text className="text-lg">{category ? category.name : 'Loading...'}</Text>
          </div>
          
          <div className="mb-6">
            <Text className="text-2xl font-semibold">Price:</Text>
            {event.eventType === 'Free' ? (
              <Text className="text-lg">Free</Text>
            ) : (
              <Text className="text-lg">Rp{formatPrice(event.price)}</Text>
            )}
          </div>

          {userRole === 'Customer' && !isEventInFuture() && (
            <form onSubmit={handleCommentSubmit} className="mb-8">
              <Stack spacing={3}>
                <Textarea
                  placeholder="Your Comment"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  required
                  className="p-2 border rounded"
                />
                <div className="flex items-center space-x-2">
                  <Text className="text-lg font-semibold">Rating:</Text>
                  <ReactStars
                    count={5}
                    value={rating}
                    onChange={(newRating) => setRating(newRating)}
                    size={24}
                    color2={'#ffd700'}
                    half={false}
                  />
                </div>
                <Button type="submit" isLoading={commentLoading} disabled={hasCommented} className="bg-blue-500 text-white px-4 py-2 rounded">
                  {hasCommented ? 'You have already commented' : 'Submit Comment'}
                </Button>
              </Stack>
            </form>
          )}

          {!isEventInFuture() && (
            <div className="mt-8">
              <Text as="h2" className="text-2xl font-bold mb-4">Comments</Text>
              {comments?.length === 0 ? (
                <Text>No comments yet.</Text>
              ) : (
                comments.map((comment) => (
                  <div key={comment.id} className="mb-4 p-4 border rounded-md shadow-md">
                    <Text as="strong" className="block">{comment.transaction.user?.username || 'Unknown User'}:</Text>
                    <Text>{comment.rating}</Text>
                    <Text>{comment.text}</Text>
                  </div>
                ))
              )}
            </div>
          )}
          
        </div>

        {isEventInFuture() && (
          <div className="mt-8 lg:w-1/3 lg:sticky lg:top-4 lg:ml-4 lg:mb-4 md:w-full  md:mb-6 sm:w-full  sm:mb-8">
            <div className="bg-gray-100 p-4 rounded-lg shadow-md mb-4 text-center md:py-6 md:px-6 sm:py-4 sm:px-4">
              <Text className="text-lg mb-2">Available Seats: {event.availableSeats}</Text>
              {userRole === 'Customer' && (
                <Button
                  // onClick={handleBuyTicket}
                  isLoading={ticketLoading}
                  disabled={ticketLoading}
                  className="bg-blue-500 text-white px-4 py-2 rounded w-full mb-4"
                >
                  Book Ticket
                </Button>
              )}
              <Input
                placeholder="Enter Discount Code"
                value={discountCode}
                onChange={(e) => setDiscountCode(e.target.value)}
                required
                className="mb-2 p-2 border rounded w-full"
              />
              <Button
                onClick={handleApplyDiscount}
                isLoading={discountLoading}
                disabled={discountLoading || discountApplied}
                className="bg-green-500 text-white px-4 py-2 rounded w-full"
              >
                {discountApplied ? 'Discount Applied' : 'Redeem Discount'}
              </Button>
              {discountResult && (
                <Text className="mt-2">
                  {discountResult.message}
                  {discountResult.discountedPrice && ` Discounted Price: Rp${discountResult.discountedPrice}`}
                </Text>
              )}

              {userRole === 'Organizer' && userId === event.organizerId && (
                <Button onClick={handleCreatePromotion} className="bg-blue-500 text-white px-4 py-2 rounded w-full mt-4">
                  Create Promotion
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventPage;