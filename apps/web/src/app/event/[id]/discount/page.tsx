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

    if (!code || !discountPercentage || !validFrom || !validTo) {
      setError('All fields are required.');
      setLoading(false);
      return;
    }

    if (discountPercentage < 0 || discountPercentage > 100) {
      setError('Discount percentage must be between 0 and 100.');
      setLoading(false);
      return;
    }

    if (new Date(validFrom) >= new Date(validTo)) {
      setError('Valid From date must be before Valid To date.');
      setLoading(false);
      return;
    }

    if (new Date(validTo) < new Date()) {
      setError('Valid From date must be in the future.');
      setLoading(false);
      return;
    }

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
    <div className="max-container padding-container mx-auto p-6">
      
      <form onSubmit={handleSubmit}>
        <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="code">
              Discount Code
            </label>
            <input
              id="code"
              type="text"
              placeholder="Discount Code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="discountPercentage">
              Discount Percentage (%)
            </label>
            <input
              id="discountPercentage"
              type="number"
              placeholder="Discount Percentage"
              value={discountPercentage}
              onChange={(e) => setDiscountPercentage(parseInt(e.target.value, 10))}
              required
              max={100}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="validFrom">
              Valid From
            </label>
            <input
              id="validFrom"
              type="date"
              placeholder="Valid From"
              value={validFrom}
              onChange={(e) => setValidFrom(e.target.value)}
              required
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="validTo">
              Valid To
            </label>
            <input
              id="validTo"
              type="date"
              placeholder="Valid To"
              value={validTo}
              onChange={(e) => setValidTo(e.target.value)}
              required
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="mb-4">
            <button
              type="submit"
              disabled={loading}
              className={` bg-green-700  text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${loading ? "opacity-50 cursor-not-allowed" : ""
                }`}
            >
              {loading ? "Creating..." : "Create Discount"}
            </button>
          </div>
          {error && <p className="text-red-500 text-xs italic">{error}</p>}
          {success && <p className="text-green-500 text-xs italic">{success}</p>}
        </div>
      </form>
    </div>
  );
}

export default CreateDiscountPage;
