"use client";
import { useState, useEffect } from "react";
import { Text, Box, Spinner, Flex, Center, VStack } from "@chakra-ui/react";
import { getSumAvailable, getCountBooked, getTransactionStats, getRevenue } from "@/api/management";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function Transactions() {
  const [available, setAvailable] = useState<number>(0);
  const [booked, setBooked] = useState<number>(0);
  const [revenue, setRevenue] = useState<number>(0);
  const [cancel, setCancelled] = useState<number>(0);
  const [pending, setPending] = useState<number>(0);
  const [complete, setComplete] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  const handleGetData = async () => {
    try {
      setLoading(true);
      const sum = await getSumAvailable();
      setAvailable(sum.data);

      const count = await getCountBooked();
      setBooked(count.data);

      const total = await getRevenue();
      setRevenue(total.data);

      const transaction = await getTransactionStats();
      setCancelled(transaction.cancel);
      setPending(transaction.pending);
      setComplete(transaction.complete);

      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch data:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    handleGetData();
  }, []);

  const totalSeats = available + booked;
  const totalTransaction = pending + complete + cancel;
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID').format(price);
  };

  const seatData = {
    labels: ['Available', 'Booked'],
    datasets: [
      {
        label: '# of Seats',
        data: [available, booked],
        backgroundColor: ['rgba(75, 192, 192, 0.2)', 'rgba(255, 99, 132, 0.2)'],
        borderColor: ['rgba(75, 192, 192, 1)', 'rgba(255, 99, 132, 1)'],
        borderWidth: 1,
      },
    ],
  };

  const transactionData = {
    labels: ['Pending', 'Completed', 'Cancelled'],
    datasets: [
      {
        label: '# of Transactions',
        data: [pending, complete, cancel],
        backgroundColor: [
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(255, 99, 132, 0.2)',
        ],
        borderColor: ['rgba(255, 206, 86, 1)', 'rgba(75, 192, 192, 1)', 'rgba(255, 99, 132, 1)'],
        borderWidth: 1,
      },
    ],
  };

  return (
    <Box p={4}>
      {loading ? (
        <Center>
          <Spinner size="xl" />
        </Center>
      ) : (
        <>
          <Center mb={8}>
            <Text fontSize="2xl" fontWeight="bold">
              Total Revenue: Rp. {formatPrice(revenue)}
            </Text>
          </Center>
          <Flex direction={{ base: 'column', md: 'row' }} justify="space-around" align="center">
            <VStack w={{ base: '100%', md: '45%' }} mb={4}>
              <Text fontSize="xl" mb={2} textAlign="center">
                Total Seats: {totalSeats}
              </Text>
              <Pie data={seatData} />
            </VStack>
            <VStack w={{ base: '100%', md: '45%' }} mb={4}>
              <Text fontSize="xl" mb={2} textAlign="center">
                Total Transactions: {totalTransaction}
              </Text>
              <Pie data={transactionData} />
            </VStack>
          </Flex>
        </>
      )}
    </Box>
  );
}
