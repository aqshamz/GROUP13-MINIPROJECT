"use client";
import { useState, useEffect } from "react";
import { Box, Flex, Text, Icon, Spinner } from "@chakra-ui/react";
import { FaTicketAlt, FaCalendarAlt } from "react-icons/fa";
import { getEventOrganizer, getTicketOrganizer } from "@/api/management";
import { Ticket } from "../interfaces";

export default function Transactions() {
  const [ticketData, setTicketData] = useState();
  const [eventData, setEventData] = useState();

  const [loading, setLoading] = useState(true);
//   const toast = useToast();

  const handleGetTickets = async () => {
    try {
      setLoading(true);
      const response = await getTicketOrganizer();
      setTicketData(response.count);
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch tickets:", error);
      setLoading(false);
    }
  };

  const handleGetEvents = async () => {
    try {
      setLoading(true);
      const response = await getEventOrganizer();
      setEventData(response.count);
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch events:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    handleGetTickets();
    handleGetEvents();
  }, []);

  return (
    <Box p={4}>
      {loading ? (
        <Flex justify="center" align="center" h="100vh">
          <Spinner size="xl" />
        </Flex>
      ) : (
        <Flex direction="column" align="center" gap={4}>
          <Box
            p={4}
            bg="teal.100"
            borderRadius="md"
            shadow="md"
            width="100%"
            maxWidth="400px"
            textAlign="center"
          >
            <Icon as={FaTicketAlt} boxSize={6} color="teal.600" />
            <Text fontSize="lg" fontWeight="bold" mt={2}>
              Tickets
            </Text>
            <Text fontSize="2xl">{ticketData}</Text>
          </Box>
          <Box
            p={4}
            bg="blue.100"
            borderRadius="md"
            shadow="md"
            width="100%"
            maxWidth="400px"
            textAlign="center"
          >
            <Icon as={FaCalendarAlt} boxSize={6} color="blue.600" />
            <Text fontSize="lg" fontWeight="bold" mt={2}>
              Events
            </Text>
            <Text fontSize="2xl">{eventData}</Text>
          </Box>
        </Flex>
      )}
    </Box>
  );
}
