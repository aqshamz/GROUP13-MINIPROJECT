"use client";
import { useState, useEffect } from "react";
import { Text, UnorderedList, ListItem, Button, Box, Collapse, Tag, useToast } from "@chakra-ui/react";
import { getTransactionOrganizer } from "@/api/management";
import { TransactionDashboard } from '../../interfaces';

export default function Transactions() {
  const [transactionData, setTransactionData] = useState<TransactionDashboard[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedTransactionId, setExpandedTransactionId] = useState<number | null>(null);
  const toast = useToast();

  const handleGetTransactions = async () => {
    try {
      setLoading(true);
      const response = await getTransactionOrganizer();
      setTransactionData(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch transactions:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    handleGetTransactions();
  }, []);

  const handleToggleDetails = (transactionId: number) => {
    setExpandedTransactionId((prevId) => (prevId === transactionId ? null : transactionId));
  };


  const getStatusLabel = (status: string) => {
    switch (status) {
      case "Pending":
        return <Tag colorScheme='yellow' >Pending</Tag>;
      case "Cancelled":
        return <Tag colorScheme='red' >Cancelled</Tag>;
      case "Completed":
        return <Tag colorScheme='green' >Completed</Tag>;
      default:
        return <Tag colorScheme='black' >{status}</Tag>;
    }
  };

  return (
    <Box>
      {loading ? (
        <Text className="text-center">Loading...</Text>
      ) : transactionData.length > 0 ? (
        <UnorderedList
          style={{ listStyleType: "none" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 list-none p-0 m-0"
        >
          {transactionData.map((transaction) => (
            <ListItem key={transaction.id} className="border p-4 rounded-md shadow-md">
              <Text as="h4" fontWeight="bold" mb={2}>
                {transaction.event.name}
              </Text>
              <Text>User: {transaction.user.username}</Text>
              <Text>Ticket Amount Ordered: {transaction.ticketAmount}</Text>
              <Text>Total Paid: {transaction.finalAmount}</Text>
              <Text mt={4}>
                Status: {getStatusLabel(transaction.status)}
              </Text>              
              <Button onClick={() => handleToggleDetails(transaction.id)} mt={4}>
                {expandedTransactionId === transaction.id ? "Hide Details" : "Show Details"}
              </Button>
              <Collapse in={expandedTransactionId === transaction.id} animateOpacity>
                <Box mt={4} p={4} borderWidth="1px" borderRadius="md">
                  <Text>Ticket Amount: {transaction.ticketAmount}</Text>
                  <Text>Total Amount: {transaction.totalAmount}</Text>
                  <Text>Discount Amount: {transaction.discountAmount}</Text>
                  <Text>Point Amount: {transaction.pointAmount}</Text>
                  <Text>Final Amount: {transaction.finalAmount}</Text>
                </Box>
              </Collapse>
            </ListItem>
          ))}
        </UnorderedList>
      ) : (
        <Text className="text-center">No Transaction found</Text>
      )}
    </Box>
  );
}
