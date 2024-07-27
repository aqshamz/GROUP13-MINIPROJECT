"use client";
import { useState, useEffect } from "react";
import { Box, Flex, Text, Icon, Spinner, Link } from "@chakra-ui/react";
import { FaTicketAlt, FaCalendarAlt, FaExchangeAlt } from "react-icons/fa";
import { getEventOrganizer, getTransactionOrganizer, getTicketOrganizer } from "@/api/management";

export default function Transactions() {
  const [transactionData, setTransactionData] = useState<number | null>(null);
  const [eventData, setEventData] = useState<number | null>(null);
  const [ticketData, setTicketData] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  const handleGetTransactions = async () => {
    try {
      setLoading(true);
      const response = await getTransactionOrganizer();
      setTransactionData(response.count);
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch transactions:", error);
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

  useEffect(() => {
    handleGetTransactions();
    handleGetEvents();
    handleGetTickets();
  }, []);

  return (
    <Box p={4}>
      {loading ? (
        <Flex justify="center" align="center" h="100vh">
          <Spinner size="xl" />
        </Flex>
      ) : (
        <Flex
          direction={{ base: "column", md: "row" }} // Responsive direction
          align="stretch" // Stretch boxes to fill container height
          gap={4}
          wrap="wrap" // Allow wrapping on smaller screens
        >
          <Box
            p={4}
            bg="green.100"
            borderRadius="md"
            shadow="md"
            width={{ base: "100%", md: "calc(33.333% - 8px)" }} // Adjust width for row layout
            height="200px" // Fixed height for all boxes
            textAlign="center"
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
          >
            <Icon as={FaExchangeAlt} boxSize={6} color="green.600" />
            <Text fontSize="lg" fontWeight="bold" mt={2}>
              Transactions
            </Text>
            <Text fontSize="2xl">{transactionData}</Text>
            <Link href="/management/transaction">
              See Details
            </Link>
          </Box>
          <Box
            p={4}
            bg="teal.100"
            borderRadius="md"
            shadow="md"
            width={{ base: "100%", md: "calc(33.333% - 8px)" }} // Adjust width for row layout
            height="200px" // Fixed height for all boxes
            textAlign="center"
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
          >
            <Icon as={FaCalendarAlt} boxSize={6} color="teal.600" />
            <Text fontSize="lg" fontWeight="bold" mt={2}>
              Events Created
            </Text>
            <Text fontSize="2xl">{eventData}</Text>
            <Link href="/management/event">
              See Details
            </Link>
          </Box>
          <Box
            p={4}
            bg="blue.100"
            borderRadius="md"
            shadow="md"
            width={{ base: "100%", md: "calc(33.333% - 8px)" }} // Adjust width for row layout
            height="200px" // Fixed height for all boxes
            textAlign="center"
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
          >
            <Icon as={FaTicketAlt} boxSize={6} color="blue.600" />
            <Text fontSize="lg" fontWeight="bold" mt={2}>
              Total Tickets Created
            </Text>
            <Text fontSize="2xl">{ticketData}</Text>
            <Link href="/management/ticket">
              See Details
            </Link>
          </Box>
        </Flex>
      )}
    </Box>
  );
}
