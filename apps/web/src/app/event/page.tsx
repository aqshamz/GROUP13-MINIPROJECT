"use client"

import { useState, useEffect, useCallback } from "react";
import { Text, UnorderedList, ListItem, Select, Button, Box, Image, Input  } from "@chakra-ui/react";
import { getAllEvents, getAllCategories, getEventsByCategory, getAllLocations, getEventsByLocation, getEventsByCategoryAndLocation} from "@/api/event";
import { Event, Category } from "../interfaces";
import { getRoleAndUserIdFromCookie } from '@/utils/roleFromCookie'; 
import Link from "next/link";
import { debounce } from "@/utils/debounce";
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
  const [userRole, setUserRole] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const pageSize = 6;

  useEffect(() => {
    handleGetCategories();
    handleGetLocations();
    fetchUserRoleAndId();
  }, []);

  useEffect(() => {
    handleGetFilteredEvents();
  }, [selectedCategory, selectedLocation, page]);


  const fetchUserRoleAndId = async () => {
    const data = await getRoleAndUserIdFromCookie();
    if (data) {
      setUserRole(data.role);
      console.log("role: >>", data.role);
    }
  };

  const handleGetFilteredEvents = async () => {
    try {
      setLoading(true);
      let response;
      if (selectedCategory && selectedLocation) {
        response = await getEventsByCategoryAndLocation(selectedCategory, selectedLocation, page, pageSize, searchQuery);
      } else if (selectedCategory) {
        response = await getEventsByCategory(selectedCategory, page, pageSize, searchQuery);
      } else if (selectedLocation) {
        response = await getEventsByLocation(selectedLocation, page, pageSize, searchQuery);
      } else {
        response = await getAllEvents(page, pageSize, searchQuery);
      }

      if (response.data.length === 0) {
        setErrorMessage("No events found for the selected filters.");
      } else {
        setEventData(response.data);
        setTotalEvents(response.total);
        setErrorMessage(null);
      }
      setLoading(false);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to fetch events. Please try again later.";
      console.error("Failed to fetch events:", errorMessage);
      setErrorMessage(errorMessage);
      setLoading(false);
    }
  };

  const handleGetCategories = async () => {
    try {
      const response = await getAllCategories();
      setCategories(response.data);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
  };

  const handleGetLocations = async () => {
    try {
      const response = await getAllLocations();
      setLocations(response.data);
    } catch (error) {
      console.error("Failed to fetch locations:", error);
    }
  };

  const handleCategoryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const categoryId = event.target.value ? parseInt(event.target.value) : null;
    setSelectedCategory(categoryId);
    setPage(1);
  };

  const handleLocationChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const locationId = event.target.value ? parseInt(event.target.value) : null;
    setSelectedLocation(locationId);
    setPage(1);
  };

  const handleSearchQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleSearchButtonClick = () => {
    setPage(1);
    handleGetFilteredEvents();
  };

  const handleNextPage = async () => {
    if (page * pageSize < totalEvents) {
      setLoading(true);
      setPage((prev) => prev + 1);
    }
  };

  const handlePreviousPage = async () => {
    if (page > 1) {
      setLoading(true);
      setPage((prev) => prev - 1);
    }
  };

  return (
    <div className="max-container padding-container mx-auto p-4 mb-20">
      <Text as="h1" className="text-3xl font-bold mb-4">Events</Text>
      <hr className="mb-4" />
      {userRole === 'Organizer' && (
        <Link href="/event/add">
          <Button className="bg-blue-500 text-white px-4 py-2 rounded mb-4">Create Event</Button>
        </Link>
      )}
      <div className="flex flex-col sm:flex-row sm:space-x-4 mb-4">
        <Select placeholder="Select category" onChange={handleCategoryChange} className="mb-2 sm:mb-0 sm:w-1/2">
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </Select>
        <Select placeholder="Select location" onChange={handleLocationChange} className="sm:w-1/2">
          {locations.map((location) => (
            <option key={location.id} value={location.id}>
              {location.name}
            </option>
          ))}
        </Select>
      </div>
      <Box mt={4} className="mb-4 flex space-x-2">
        <Input
          placeholder="Search events"
          value={searchQuery}
          onChange={handleSearchQueryChange}
          className="w-full sm:w-80 md:w-96 lg:w-1/2 xl:w-1/3 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        />
        <Button onClick={handleSearchButtonClick} className="bg-blue-500 text-white px-4 py-2 rounded">
          Search
        </Button>
      </Box>
      {errorMessage && (
        <Text className="text-center text-red-500">{errorMessage}</Text>
      )}
      {loading ? (
        <div className="text-center">Loading...</div>
      ) : (
        <UnorderedList className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 list-none p-0 m-0" style={{ listStyleType: 'none' }}>
          {eventData.length > 0 ? (
            eventData.map((item: Event) => {
              const formattedThumbnail = item.thumbnail.replace(/\\/g, '/');
              const encodedThumbnail = formattedThumbnail.split('/').map(encodeURIComponent).join('/');
              const truncatedDescription = item.description.length > 80
                ? `${item.description.slice(0, 80)}...`
                : item.description;
              return (
                <ListItem key={item.id} className="border p-4 rounded-md shadow-md flex flex-col items-center text-center">
                  <Link href={`/event/${item.id}`}>
                    <div className="flex flex-col items-center">
                      {item.thumbnail && (
                        <Image
                          src={`http://localhost:8000/${encodedThumbnail}`}
                          alt={`${item.name} thumbnail`}
                          width={350}
                          height={200}
                          className="rounded-md my-2"
                        />
                      )}
                      <p className="text-xl font-semibold">{item.name}</p>
                      <div className="w-full text-left mt-2">
                        <p className="text-gray-600 inline">{truncatedDescription}</p>
                        {item.description.length > 200 && (
                          <Link href={`/event/${item.id}`} className="text-blue-500 ml-2 hover:underline inline">
                            More
                          </Link>
                        )}
                      </div>
                    </div>
                  </Link>
                </ListItem>
              );
            })
          ) : (
            <ListItem className="text-center">No events found</ListItem>
          )}
        </UnorderedList>
      )}
      <div className="flex justify-between mt-4">
        <Button onClick={handlePreviousPage} disabled={page === 1}>
          Previous
        </Button>
        <Button onClick={handleNextPage} disabled={page * pageSize >= totalEvents}>
          Next
        </Button>
      </div>
    </div>
  );
}