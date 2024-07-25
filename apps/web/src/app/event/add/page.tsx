"use client";

import { useState, useEffect } from "react";
import {
  Box,
  Button,
  Text,
  Container,
  Card,
  CardBody,
  Input,
  FormControl,
  FormLabel,
  Textarea,
  Checkbox,
  Select
} from "@chakra-ui/react";
import { useParams } from 'next/navigation';
import { createEvent, getAllCategories, getAllLocations } from "@/api/event";
import { Category, Location } from "../../interfaces";


export default function EventAdd() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [datetime, setDateTime] = useState("");
  const [locationId, setLocationId] = useState("");
  const [categoryId, setCategoryId] = useState("");
  
  const [picture, setPicture] = useState<File | null>(null);
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [availableSeats, setAvailableSeats] = useState("");
  const [price, setPrice] = useState("");
  const [eventType, setEventType] = useState<"Free" | "Paid">("Free");
  const [organizerId, setOrganizerId] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);

  useEffect(() => {
    handleGetCategories();
    handleGetLocations();
  }, []);

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

  const handleCreateEvent = async () => {
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("datetime", datetime);
      formData.append("locationId", locationId);
      formData.append("categoryId", categoryId);
      formData.append("organizerId", organizerId);
      formData.append("availableSeats", availableSeats);
      formData.append("eventType", eventType);
      formData.append("price", eventType === "Free" ? "0" : price);
      if (picture) {
        formData.append("picture", picture);
      }
      if (thumbnail) {
        formData.append("thumbnail", thumbnail);
      }

      const response = await createEvent(formData);
      console.log("Event created successfully:", response.data);
      window.location.href = `/event`;
      // Optionally, you can redirect or show a success message here
    } catch (error) {
      console.error("Error creating event:", error);
      // Handle error state or show an error message
    }
  };

  const handlePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPicture(file);
    }
  };

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setThumbnail(file);
    }
  };

  const handleEventTypeChange = (type: "Free" | "Paid") => {
    setEventType(type);
    if (type === "Free") {
      setPrice("0");
    } else {
      setPrice(""); // Clear the price field if changing to Paid
    }
  };

  const handleCategoryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const categoryId = event.target.value ? parseInt(event.target.value) : null;
    setCategoryId(categoryId);
  };

  const handleLocationChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const locationId = event.target.value ? parseInt(event.target.value) : null;
    setLocationId(locationId);
  };

  return (
    <Container>
      <Text as={"h1"}> Event Add </Text>
      <hr />
      <p> This is Event page </p>

      <form>
        <Card>
          <CardBody>
            <FormControl>
              <FormLabel>Name</FormLabel>
              <Input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Description</FormLabel>
              <Input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Date</FormLabel>
              <Input
                type="date"
                placeholder="Event Date"
                value={datetime}
                onChange={(e) => setDateTime(e.target.value)}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Location</FormLabel>
              <Select placeholder="Select location" onChange={handleLocationChange}>
                
                {locations.map((location) => (
                  <option key={location.id} value={location.id}>
                    {location.name}
                  </option>
                ))}
              </Select>
            </FormControl>
            <FormControl>
              <FormLabel>Category</FormLabel>
              <Select placeholder="Select category" onChange={handleCategoryChange}>
                
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </Select>
            </FormControl>
            <FormControl>
              <FormLabel>Available Seats</FormLabel>
              <Input
                type="text"
                value={availableSeats}
                onChange={(e) => setAvailableSeats(e.target.value)}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Picture</FormLabel>
              <Input type="file" onChange={handlePictureChange} />
            </FormControl>
            <FormControl>
              <FormLabel>Thumbnail</FormLabel>
              <Input type="file" onChange={handleThumbnailChange} />
            </FormControl>
            <FormControl>
              <FormLabel>Event Type</FormLabel>
              <Checkbox
                isChecked={eventType === "Free"}
                onChange={() => handleEventTypeChange("Free")}
              >
                Free
              </Checkbox>
              <Checkbox
                isChecked={eventType === "Paid"}
                onChange={() => handleEventTypeChange("Paid")}
              >
                Paid
              </Checkbox>
            </FormControl>
            {eventType === "Paid" && (
              <FormControl>
                <FormLabel>Price</FormLabel>
                <Input
                  type="text"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />
              </FormControl>
            )}
            <FormControl>
              <Button color={"blue.500"} onClick={handleCreateEvent}>
                Submit
              </Button>
            </FormControl>
          </CardBody>
        </Card>
      </form>
    </Container>
  );
}