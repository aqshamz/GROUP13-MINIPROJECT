"use client";
import { useState, useEffect } from "react";
import { Text, UnorderedList, ListItem, Button, Box, Collapse, useToast, Flex, Center } from "@chakra-ui/react";
import Barcode from 'react-barcode';
import { getAllTickets } from "@/api/ticket";
import { Ticket } from "../interfaces";

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

export default function Transactions() {
  const [ticketData, setTicketData] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedTicketId, setExpandedTicketId] = useState<number | null>(null);
  const toast = useToast();

  const handleGetTickets = async () => {
    try {
      setLoading(true);
      const response = await getAllTickets();
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

  const handleToggleDetails = (ticketId: number) => {
    setExpandedTicketId((prevId) => (prevId === ticketId ? null : ticketId));
  };

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
                {ticket.event.name}
              </Text>
              <Text>Location: {ticket.event.location.name}</Text>
              <Text>Date: {formatDate(ticket.event.datetime)}</Text>
              <Text>Ticket Number: {ticket.credentials}</Text>
              <Button onClick={() => handleToggleDetails(ticket.id)} mt={4}>
                {expandedTicketId === ticket.id ? "Hide Details" : "Show Details"}
              </Button>
              <Collapse in={expandedTicketId === ticket.id} animateOpacity>
                <Box mt={4} p={4} borderWidth="1px" borderRadius="md" textAlign="center">
                  {/* <Barcode value={ticket.credentials} /> */}
                  <Flex justifyContent="center" alignItems="center">
                    <Center>
                      <Barcode value={ticket.credentials} />
                    </Center>
                  </Flex>
                  <Text mt={2} color="red.500">*Show the barcode at the event gate if needed</Text>
                </Box>
              </Collapse>
            </ListItem>
          ))} 
        </UnorderedList>
      ) : (
        <Text className="text-center">No Ticket found</Text>
      )}
    </Box>
  );
}
