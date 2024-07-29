"use client";
import { useState, useEffect } from "react";
import { Text, UnorderedList, ListItem, Box, Link, Icon } from "@chakra-ui/react";
import { getEventOrganizer } from "@/api/management";
import { EventDashboard } from '../../interfaces';
import { FaArrowCircleRight } from "react-icons/fa";

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

export default function Transactions() {
  const [eventData, setEventData] = useState<EventDashboard[]>([]);
  const [loading, setLoading] = useState(true);

  const handleGetEvents = async () => {
    try {
      setLoading(true);
      const response = await getEventOrganizer();
      setEventData(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch events:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    handleGetEvents();
  }, []);


  return (
    <Box>
      {loading ? (
        <Text className="text-center">Loading...</Text>
      ) : eventData.length > 0 ? (
        <UnorderedList
          style={{ listStyleType: "none" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 list-none p-0 m-0"
        >
          {eventData.map((event) => (
            <ListItem key={event.id} className="border p-4 rounded-md shadow-md">
              <Text as="h4" fontWeight="bold" mb={2}>
                {event.name}
              </Text>
              <Text>Location: {event.location.name}</Text>
              <Text>Date: {formatDate(event.datetime)}</Text>
              <Text>Event Type: {event.eventType}</Text>
              <Link href={`/event/${event.id}`}>
                See More Details <Icon as={FaArrowCircleRight} boxSize={4} color="black.600" />
              </Link>
            </ListItem>
          ))} 
        </UnorderedList>
      ) : (
        <Text className="text-center">No Event found</Text>
      )}
    </Box>
  );
}
