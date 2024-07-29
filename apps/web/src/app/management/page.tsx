"use client";
import { useState, useEffect } from "react";
import { Box, Flex, Text, Icon, Spinner, Link } from "@chakra-ui/react";
import { FaTicketAlt, FaCalendarAlt, FaExchangeAlt, FaChartBar, FaArrowCircleRight } from "react-icons/fa";
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
          wrap="wrap" // Allow wrapping on smaller screens
          justify="space-between"
          gap={4}
        >
          <Box
            p={4}
            bg="green.100"
            borderRadius="md"
            shadow="md"
            width={{ base: "100%", md: "calc(50% - 8px)" }} // Adjust width for row layout
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
            <Link href="/management/transaction" mt={2} color="green.600" fontWeight="bold">
              See Details <Icon as={FaArrowCircleRight} boxSize={4} color="green.600" />
            </Link>
          </Box>
          <Box
            p={4}
            bg="teal.100"
            borderRadius="md"
            shadow="md"
            width={{ base: "100%", md: "calc(50% - 8px)" }} // Adjust width for row layout
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
            <Link href="/management/event" mt={2} color="teal.600" fontWeight="bold">
              See Details <Icon as={FaArrowCircleRight} boxSize={4} color="teal.600" />
            </Link>
          </Box>
          <Box
            p={4}
            bg="blue.100"
            borderRadius="md"
            shadow="md"
            width={{ base: "100%", md: "calc(50% - 8px)" }} // Adjust width for row layout
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
            <Link href="/management/ticket" mt={2} color="blue.600" fontWeight="bold">
              See Details <Icon as={FaArrowCircleRight} boxSize={4} color="blue.600" />
            </Link>
          </Box>
          <Box
            p={4}
            bg="cyan.100"
            borderRadius="md"
            shadow="md"
            width={{ base: "100%", md: "calc(50% - 8px)" }} // Adjust width for row layout
            height="200px" // Fixed height for all boxes
            textAlign="center"
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
          >
            <Icon as={FaChartBar} boxSize={6} color="cyan.600" />
            <Text fontSize="lg" fontWeight="bold" mt={2}>
              Statistics
            </Text>
            <Link href="/management/statistic" mt={2} color="cyan.600" fontWeight="bold">
              See Details <Icon as={FaArrowCircleRight} boxSize={4} color="cyan.600" />
            </Link>
          </Box>
        </Flex>
      )}
    </Box>
  );
}
