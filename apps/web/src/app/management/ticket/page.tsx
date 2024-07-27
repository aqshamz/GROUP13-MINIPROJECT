"use client";
import { useState, useEffect } from "react";
import { Text, UnorderedList, ListItem, Button, Box, Collapse, useToast, Flex, Center } from "@chakra-ui/react";
import { getTicketOrganizer } from "@/api/management";
import { TicketDashboard } from '../../interfaces';

export default function Transactions() {
  const [ticketData, setTicketData] = useState<TicketDashboard[]>([]);
  const [loading, setLoading] = useState(true);

  const handleGetTickets = async () => {
    try {
      setLoading(true);
      const response = await getTicketOrganizer();
      setTicketData(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch tickets:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    handleGetTickets();
  }, []);


  return (
    <Box>
      {loading ? (
        <Text className="text-center">Loading...</Text>
      ) : ticketData.length > 0 ? (
        <UnorderedList
          style={{ listStyleType: "none" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 list-none p-0 m-0"
        >
          {ticketData.map((ticket) => (
            <ListItem key={ticket.id} className="border p-4 rounded-md shadow-md">
              <Text as="h4" fontWeight="bold" mb={2}>
                Serial Number {ticket.credentials}
              </Text>
              <Text>Events: {ticket.event.name}</Text>
              <Text>Holder: {ticket.attendee.username}</Text>
            </ListItem>
          ))} 
        </UnorderedList>
      ) : (
        <Text className="text-center">No Ticket found</Text>
      )}
    </Box>
  );
}
