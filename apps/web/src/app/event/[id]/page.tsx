"use client"

import { useEffect, useState, FormEvent, useRef } from 'react';
import { Text, Input, Button, Box, Textarea, Stack, Image, CheckboxGroup, Checkbox, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, useDisclosure, NumberInput, NumberInputField, NumberInputStepper, NumberIncrementStepper, NumberDecrementStepper, useToast } from '@chakra-ui/react';
import { useParams, usePathname } from 'next/navigation';
import { getEventById, getCommentsByEventId, createComment, getCategoryById, getLocationById, applyEventDiscount } from '@/api/event';
import { freeTicket, getUserDiscount, getUserPoint, getEventDiscount, orderTicket } from '@/api/payment';
import { Event, Comment, Location, Category, UserDiscount } from '../../interfaces';
import { getRoleAndUserIdFromCookie } from '@/utils/roleFromCookie';

import ReactStars from 'react-stars';

const EventPage = () => {
  const { id } = useParams();
  const pathname = usePathname();
  const [event, setEvent] = useState<Event | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const toast = useToast();
  const [commentText, setCommentText] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [commentLoading, setCommentLoading] = useState(false);
  const [ticketLoading, setTicketLoading] = useState(false);
  const [discountCode, setDiscountCode] = useState<string>('');
  const [discountLoading, setDiscountLoading] = useState(false);
  const [discountApplied, setDiscountApplied] = useState(false);
  const [location, setLocation] = useState<Location | null>(null);
  const [category, setCategory] = useState<Category | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [userId, setUserId] = useState<number | null>(null);
  const [rating, setRating] = useState<number>(0);
  const [hasCommented, setHasCommented] = useState<boolean>(false);
  const [ticketCount, setTicketCount] = useState(1);
  const [commentError, setCommentError] = useState<string | null>(null);
  
  // handle paid
  const [point, setPoint] = useState<number>(0);
  const [discountEvent, setDiscountEvent] = useState<number>(0);
  const [discountUser, setDiscountUser] = useState<UserDiscount | null>(null);
  const [useUserDiscount, setUseUserDiscount] = useState(false);
  const [usePoints, setUsePoints] = useState(false);
  // handle paid

  // for make transactions
  const [useTotalAmount, setUseTotalAmount] = useState<number>(0);
  const [usePointAmount, setUsePointAmount] = useState<number>(0);
  const [useDiscountAmount, setUseDiscountAmount] = useState<number>(0);
  const [useFinalAmount, setUseFinalAmount] = useState<number>(0);
  // for make transaction

  const formattedThumbnail = event?.picture?.replace(/\\/g, '/') || '';

  const { isOpen, onOpen, onClose } = useDisclosure()
  const finalRef = useRef(null)

  useEffect(() => {
    const fetchEventDetails = async (eventId: number) => {
      try {
        const response = await getEventById(eventId);
        setEvent(response.data);
        const locationResponse = await getLocationById(response.data.locationId);
        setLocation(locationResponse);

        const categoryResponse = await getCategoryById(response.data.categoryId);
        setCategory(categoryResponse);

        const userDiscountResponse = await getUserDiscount();
        setDiscountUser(userDiscountResponse.data);

        const userPointResponse = await getUserPoint();
        setPoint(userPointResponse.data);

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

    if (!userId || !commentText || !rating ) {
      setCommentError('Text and Rating are Required.');
      console.error('User ID, comment text, and rating are required');
      setCommentLoading(false);
      return;
    }

    if (hasCommented) {
      setCommentError('You have already submitted a comment for this event.');
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
      setCommentError(null);
    } catch (error) {
      console.error('Error creating comment:', error);
      setCommentError('An error occured while submitting your comment. Please try again!');
    } finally {
      setCommentLoading(false);
    }
  };

  const handleRatingChange = (newRating: number) => {
    setRating(newRating);
  };

  const handleApplyDiscount = async () => {
    setDiscountLoading(true);

    try {
      const response = await getEventDiscount(parseInt(id as string), discountCode);
      if(response){
        setDiscountEvent(response.data)
        setDiscountApplied(true)
      }
    } catch (error) {
      console.error('Error get discount:', error);
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

  const handleMakeTicket = async () => {
    try {
      const free = await freeTicket(event.id, event.availableSeats, ticketCount);
      toast({
        title: "Make Ticket successful.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Failed to make ticket:", error);
      toast({
        title: "Make Ticket failed.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const calculateFinalAmount = () => {
    let totalAmount = event.price * ticketCount;
    let currentDiscount = 0;

    if (useUserDiscount && discountUser) {
      currentDiscount += discountUser.discountPercentage;
    }

    if (discountEvent !== 0) {
      currentDiscount += discountEvent;
    }

    const discountAmount = (currentDiscount / 100) * totalAmount;
    let beforePointAmount = totalAmount - discountAmount;

    let finalAmount = beforePointAmount;
    let pointUsed = 0;

    if (usePoints && point > 0) {
      if (point > beforePointAmount) {
        pointUsed = beforePointAmount;
        finalAmount = 0;
      } else {
        pointUsed = point;
        finalAmount = beforePointAmount - point;
      }
    }
  
    return (
      <>
      <form onSubmit={handleMakeTransaction}>
        <Text mt="1rem" fontWeight="bold">
          Discount Amount: Rp{formatPrice(discountAmount)}
        </Text>
        <Text mt="1rem" fontWeight="bold">
          Points Used: Rp{formatPrice(pointUsed)}
        </Text>
        <Text mt="1rem" fontWeight="bold">
          Final Amount: Rp{formatPrice(finalAmount)}
        </Text>
        <Input type="hidden" name="totalAmount" value={totalAmount} />
        <Input type="hidden" name="discountAmount" value={discountAmount} />
        <Input type="hidden" name="pointUsed" value={pointUsed} />
        <Input type="hidden" name="finalAmount" value={finalAmount} />
        <Button type="submit" colorScheme="teal" mt={4} isLoading={ticketLoading}>
          Make Transaction
        </Button>
      </form>
      </>
    );
  };

  const handleMakeTransaction = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevent the default form submission behavior
  
    const formData = new FormData(e.currentTarget);
    const totalAmount = formData.get('totalAmount');
    const discountAmount = formData.get('discountAmount');
    const pointUsed = formData.get('pointUsed');
    const finalAmount = formData.get('finalAmount');
  
    try {
      let discountId;
      if (discountUser) {
        discountId = discountUser.id;
      } else {
        discountId = 0;
      }
  
      const order = await orderTicket(
        event.id, 
        ticketCount, 
        Number(totalAmount), 
        Number(pointUsed), 
        Number(discountAmount), 
        Number(finalAmount), 
        discountId
      );
      if(order){
        toast({
          title: "Make order successful.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
      }else{
        toast({
          title: "Make Ticket failed.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error("Failed to make order:", error);
      toast({
        title: "Make Ticket failed.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

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
                    onChange={handleRatingChange}
                    size={24}
                    color2={'#ffd700'}
                    half={false}
                  />
                </div>
                {commentError && <Text color="red.500">{commentError}</Text>}
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
                    <Text fontWeight="bold" as="strong" className="block">{comment.transaction.user?.username || 'Unknown User'}</Text>
                    <ReactStars count={5} value={comment.rating} size={24} color2={'#ffd700'} half={false}/>
                    <Text>"{comment.text}"</Text>
                  </div>
                ))
              )}
            </div>
          )}
          
        </div>

        {isEventInFuture() && (
          <div className="lg:w-1/3 lg:sticky lg:top-4 lg:ml-4">
            
            <div className="bg-gray-100 p-4 rounded-lg shadow-md mb-4 text-center">
            <Text className="text-lg mb-2">Available Seats: {event.availableSeats}</Text>
              {userRole === 'Customer' && event.availableSeats > 0 && (
                <Button onClick={onOpen} isLoading={ticketLoading} disabled={ticketLoading} className="bg-blue-500 text-white px-4 py-2 rounded w-full mb-4">
                  Book Ticket
                </Button>
               )}

              {userRole === 'Organizer' && userId === event.organizerId && (
                <Button onClick={handleCreatePromotion} className="bg-blue-500 text-white px-4 py-2 rounded w-full mt-4">
                  Create Promotion
                </Button>
              )}
            </div>
          </div>
        )}

        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Book Ticket</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              {event.eventType === 'Paid' && (
                <>
                  <Text fontWeight="bold" mb="1rem">
                    Available Seats: {event.availableSeats}
                  </Text>
                  <Text fontWeight="bold" mb="1rem">
                    Price per ticket: Rp{formatPrice(event.price)}
                  </Text>
                  <Text>Number of tickets</Text>
                  <NumberInput
                    defaultValue={1}
                    min={1}
                    max={event.availableSeats}
                    value={ticketCount}
                    onChange={(valueString) => setTicketCount(Number(valueString))}
                    isRequired
                    mb="1rem"
                  >
                    <NumberInputField />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>

                  <Input
                    placeholder="Enter Discount Code"
                    value={discountCode}
                    onChange={(e) => setDiscountCode(e.target.value)}
                    mb="1rem"
                  />

                  <Button
                    onClick={handleApplyDiscount}
                    isLoading={discountLoading}
                    disabled={discountLoading}
                    colorScheme="green"
                    mb="1rem"
                  > 
                    {Number(discountEvent) === 0 ? 'Apply Code' : 'Discount Applied'}
                  </Button>

                  {discountUser && (
                    <Checkbox onChange={() => setUseUserDiscount(!useUserDiscount)} mb="1rem">
                      Use Referral Code Discount ({discountUser.discountPercentage}%)
                    </Checkbox>
                  )}

                  {point > 0 && (
                    <Checkbox onChange={() => setUsePoints(!usePoints)}>
                      Use Points ({point} points available)
                    </Checkbox>
                  )}

                  {calculateFinalAmount()}
                </>
              )}

              {event.eventType === 'Free' && (
                <>
                  <Text fontWeight="bold" mb="1rem">
                    Available Seats: {event.availableSeats}
                  </Text>
                  <Text>Number of tickets</Text>
                  <NumberInput
                    defaultValue={1}
                    min={1}
                    max={event.availableSeats}
                    value={ticketCount}
                    onChange={(valueString) => setTicketCount(Number(valueString))}
                    isRequired
                    mb="1rem"
                  >
                    <NumberInputField />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                  <Button colorScheme="teal" mt={4} onClick={handleMakeTicket}>
                    Book
                  </Button>
                </>
              )}
            </ModalBody>

          </ModalContent>
        </Modal>
      </div>
    </div>
  );
};

export default EventPage;