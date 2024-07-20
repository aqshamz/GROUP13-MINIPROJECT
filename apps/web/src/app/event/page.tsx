"use client"

import { useState, useEffect } from "react";
import { Text, UnorderedList, ListItem, Select, Button, Box, Image, Input  } from "@chakra-ui/react";
import { getAllEvents, getAllCategories, getEventsByCategory, getAllLocations, getEventsByLocation, getEventsByCategoryAndLocation} from "@/api/event";
import { Event, Category } from "../interfaces";


import Link from "next/link";


interface Props {
  events: Event[];
}

export default function Events({ events }: Props) {
  const [eventData, setEventData] = useState<Event[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalEvents, setTotalEvents] = useState(0); 
  const pageSize = 5; // Number of events per page

  useEffect(() => {
    handleGetEvents();
    handleGetCategories();
    handleGetLocations();
  }, [page]);

  useEffect(() => {
    handleGetFilteredEvents();
  }, [selectedCategory, selectedLocation]);
  

  

  const handleGetEvents = async () => {
    try {
      setLoading(true);
      const response = await getAllEvents(page, pageSize, searchQuery);
      setEventData(response.data);
      setTotalEvents(response.total);
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch events:", error);
      setLoading(false);
    }
  };
 
  const handleGetFilteredEvents = async () => {
    try {
      setLoading(true);
      if (selectedCategory && selectedLocation) {
        const response = await getEventsByCategoryAndLocation(selectedCategory, selectedLocation, page, pageSize);
        setEventData(response.data);
        setTotalEvents(response.total);
      } else if (selectedCategory) {
        const response = await getEventsByCategory(selectedCategory, page, pageSize);
        setEventData(response.data);
        setTotalEvents(response.total);
      } else if (selectedLocation) {
        const response = await getEventsByLocation(selectedLocation, page, pageSize);
        setEventData(response.data);
        setTotalEvents(response.total);
      } else {
        handleGetEvents(); // Fetch all events if no filters are applied
      }
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch events:", error);
      setLoading(false);
    }
  };


  const handleGetCategories = async () => {
    try {
      const response = await getAllCategories();
      setCategories(response.data); // Assuming response.data is the array of categories
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
  };

  const handleGetLocations = async () => {
    try {
      const response = await getAllLocations();
      setLocations(response.data); // Assuming response.data is the array of locations
    } catch (error) {
      console.error("Failed to fetch locations:", error);
    }
  };

  const handleCategoryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const categoryId = event.target.value ? parseInt(event.target.value) : null;
    setSelectedCategory(categoryId);
    setPage(1); // Reset to first page when category changes
  };

  const handleLocationChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const locationId = event.target.value ? parseInt(event.target.value) : null;
    setSelectedLocation(locationId);
    setPage(1); // Reset to first page when location changes
  };

  const handleSearchQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleSearch = () => {
    setPage(1);
    handleGetEvents();
  };

  const handleNextPage = () => {
    if (page * pageSize < totalEvents) {
      setPage((prev) => prev + 1);
    }
  };

  const handlePreviousPage = () => {
    setPage((prev) => (prev > 1 ? prev - 1 : 1));
  };

  return (
    <div className="container mx-auto p-4 mb-20">
      <Text as="h1" className="text-3xl font-bold mb-4">Events</Text>
      <hr className="mb-4" />

      <div className="flex flex-col sm:flex-row sm:space-x-4 mb-4">
      <Select placeholder="Select category" onChange={handleCategoryChange} className="mb-2 sm:mb-0 sm:w-1/2">
        <option value="">All Categories</option>
        {categories.map((category) => (
          <option key={category.id} value={category.id}>
            {category.name}
          </option>
        ))}
      </Select>
      <Select placeholder="Select location" onChange={handleLocationChange} className="sm:w-1/2">
        <option value="">All Locations</option>
        {locations.map((location) => (
          <option key={location.id} value={location.id}>
            {location.name}
          </option>
        ))}
      </Select>
      </div>
      <Box mt={4} className="mb-4">
        <Input
          placeholder="Search events"
          value={searchQuery}
          onChange={handleSearchQueryChange}
        />
        <Button onClick={handleSearch} mt={2} className="mt-2 bg-blue-500 text-white px-4 py-2 rounded">
          Search
        </Button>
      </Box>
      <UnorderedList className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 list-none p-0 m-0" style={{ listStyleType: 'none' }}>
        {loading ? (
          <ListItem className="text-center">Loading...</ListItem>
        ) : eventData.length > 0 ? (
          eventData.map((item: Event) => {
            
            const formattedThumbnail = item.thumbnail.replace(/\\/g, '/');
            
            return (
              <ListItem key={item.id} className="border p-4 rounded-md shadow-md flex flex-col items-center text-center">
                <Link href={`/event/${item.id}`}>
                  <div className="flex flex-col items-center">
                    <p className="text-xl font-semibold">{item.title}</p>
                    {item.thumbnail && (
                      <Image
                        src={`http://localhost:5670/${formattedThumbnail}`}
                        alt={`${item.title} thumbnail`}
                        width={350} // Adjust width as needed
                        height={200} // Adjust height as needed
                        className="rounded-md my-2"
                      />
                    )}
                    <p className="text-gray-600">{item.description}</p>
                    {/* <p>Description: {item.locationId}</p> */}
                    {/* Add other fields as needed */}
                  </div>
                </Link>
              </ListItem>
            );
          })
        ) : (
          <ListItem className="text-center">No events found</ListItem>
        )}
      </UnorderedList>
      <div className="flex justify-between mt-4">
        <Button onClick={handlePreviousPage} disabled={page === 1} className="bg-gray-300 text-black px-4 py-2 rounded disabled:opacity-50">
          Previous
        </Button>
        <Button onClick={handleNextPage} disabled={page * pageSize >= totalEvents} className="bg-gray-300 text-black px-4 py-2 rounded disabled:opacity-50">
          Next
        </Button>
      </div>
    </div>
  );
}


