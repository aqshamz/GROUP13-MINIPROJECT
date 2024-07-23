"use client"

import { useState, FormEvent } from 'react';
import { useParams } from 'next/navigation';
import { Input, Button, Box, Stack, Text } from '@chakra-ui/react';
import { createDiscount } from '@/api/event'; // Make sure this path is correct

const CreateDiscountPage = () => {
  const { id } = useParams();
  const [code, setCode] = useState<string>('');
  const [discountPercentage, setDiscountPercentage] = useState<number>(0);
  const [validFrom, setValidFrom] = useState<string>('');
  const [validTo, setValidTo] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      await createDiscount({
        eventId: parseInt(id as string),
        code,
        discountPercentage,
        validFrom,
        validTo,
      });
      setSuccess('Discount created successfully');
      setCode('');
      setDiscountPercentage(0);
      setValidFrom('');
      setValidTo('');

      // Redirect to event details page using window.location.href
      window.location.href = `/event/${id}`;
    } catch (err) {
      setError('Error creating discount');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Text as="h1" fontSize="xl" fontWeight="bold" mb={4}>Create Discount</Text>
      <form onSubmit={handleSubmit}>
        <Stack spacing={3}>
          <Input
            placeholder="Discount Code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            required
          />
          <Input
            placeholder="Discount Percentage"
            type="number"
            value={discountPercentage}
            onChange={(e) => setDiscountPercentage(parseInt(e.target.value, 10))}
            required
          />
          <Input
            placeholder="Valid From"
            type="date"
            value={validFrom}
            onChange={(e) => setValidFrom(e.target.value)}
            required
          />
          <Input
            placeholder="Valid To"
            type="date"
            value={validTo}
            onChange={(e) => setValidTo(e.target.value)}
            required
          />
          <Button
            type="submit"
            isLoading={loading}
            disabled={loading}
            colorScheme="blue"
          >
            Create Discount
          </Button>
          {error && <Text color="red.500">{error}</Text>}
          {success && <Text color="green.500">{success}</Text>}
        </Stack>
      </form>
    </Box>
  );
};

export default CreateDiscountPage;
