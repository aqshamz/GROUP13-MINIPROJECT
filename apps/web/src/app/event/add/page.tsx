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
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

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

  const validateFields = () => {
    let fieldErrors: { [key: string]: string } = {};
    if (!name) fieldErrors.name = "Name is required";
    if (!description) fieldErrors.description = "Description is required";
    if (!datetime) {
      fieldErrors.datetime = "Date is required";
    } else {
      const eventDate = new Date(datetime);
      const currentDate = new Date();
      if (eventDate <= currentDate) {
        fieldErrors.datetime = "The date must be in the future";
      }
    }
    if (!locationId) fieldErrors.locationId = "Location is required";
    if (!categoryId) fieldErrors.categoryId = "Category is required";
    if (!availableSeats) fieldErrors.availableSeats = "Available seats are required";
    if (eventType === "Paid" && !price) fieldErrors.price = "Price is required for paid events";

    if (picture) {
      const pictureFormat = picture.type.split("/")[1].toLowerCase();
      if (!["jpeg", "jpg", "png"].includes(pictureFormat)) {
        fieldErrors.picture = "Picture must be in JPEG, JPG, or PNG format";
      }
      
    } else {
      fieldErrors.picture = "Picture is required";
    }

    // Validate thumbnail
    if (thumbnail) {
      const thumbnailFormat = thumbnail.type.split("/")[1].toLowerCase();
      if (!["jpeg", "jpg", "png"].includes(thumbnailFormat)) {
        fieldErrors.thumbnail = "Thumbnail must be in JPEG, JPG, or PNG format";
      }
      
    } else {
      fieldErrors.thumbnail = "Thumbnail is required";
    }

    setErrors(fieldErrors);
    return Object.keys(fieldErrors).length === 0;
  };

  const handleCreateEvent = async () => {
    if (!validateFields()) return;
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
      
    } catch (error) {
      console.error("Error creating event:", error);
      
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
    <div className="max-container padding-container mx-auto p-6">
      <Text as={"h1"} className="text-2xl font-bold mb-4">Event Add</Text>
      

      <form>
        <Card className="shadow-md">
          <CardBody>
            <FormControl isInvalid={!!errors.name} className="mb-4">
              <FormLabel>Name</FormLabel>
              <Input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="border p-2 rounded"
              />
              {errors.name && <Text color="red.500">{errors.name}</Text>}
            </FormControl>
            <FormControl isInvalid={!!errors.description} className="mb-4">
              <FormLabel>Description</FormLabel>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter event description here"
                size="md"
                className="border p-2 rounded"
              />
              {errors.description && <Text color="red.500">{errors.description}</Text>}
            </FormControl>
            <FormControl isInvalid={!!errors.datetime} className="mb-4">
              <FormLabel>Date</FormLabel>
              <Input
                type="date"
                placeholder="Event Date"
                value={datetime}
                onChange={(e) => setDateTime(e.target.value)}
                className="border p-2 rounded"
              />
              {errors.datetime && <Text color="red.500">{errors.datetime}</Text>}
            </FormControl>
            <FormControl isInvalid={!!errors.locationId} className="mb-4">
              <FormLabel>Location</FormLabel>
              <Select
                placeholder="Select location"
                onChange={handleLocationChange}
                className="border p-2 rounded"
              >
                {locations.map((location) => (
                  <option key={location.id} value={location.id}>
                    {location.name}
                  </option>
                ))}
              </Select>
              {errors.locationId && <Text color="red.500">{errors.locationId}</Text>}
            </FormControl>
            <FormControl isInvalid={!!errors.categoryId} className="mb-4">
              <FormLabel>Category</FormLabel>
              <Select
                placeholder="Select category"
                onChange={handleCategoryChange}
                className="border p-2 rounded"
              >
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </Select>
              {errors.categoryId && <Text color="red.500">{errors.categoryId}</Text>}
            </FormControl>
            <FormControl isInvalid={!!errors.availableSeats} className="mb-4">
              <FormLabel>Available Seats</FormLabel>
              <Input
                type="number"
                value={availableSeats}
                onChange={(e) => setAvailableSeats(e.target.value)}
                className="border p-2 rounded"
              />
              {errors.availableSeats && <Text color="red.500">{errors.availableSeats}</Text>}
            </FormControl>
            <FormControl isInvalid={!!errors.picture} className="mb-4">
              <FormLabel>Picture</FormLabel>
              <Input
                type="file"
                accept="image/*"
                onChange={handlePictureChange}
                className="border p-2 rounded"
              />
              {errors.picture && <Text color="red.500">{errors.picture}</Text>}
            </FormControl>
            <FormControl isInvalid={!!errors.thumbnail} className="mb-4">
              <FormLabel>Thumbnail</FormLabel>
              <Input
                type="file"
                accept="image/*"
                onChange={handleThumbnailChange}
                className="border p-2 rounded"
              />
              {errors.thumbnail && <Text color="red.500">{errors.thumbnail}</Text>}
            </FormControl>
            <FormControl className="mb-4">
              <FormLabel>Event Type</FormLabel>
              <Checkbox
                isChecked={eventType === "Free"}
                onChange={() => handleEventTypeChange("Free")}
                className="mr-2"
              >
                Free
              </Checkbox>
              <Checkbox
                isChecked={eventType === "Paid"}
                onChange={() => handleEventTypeChange("Paid")}
                className="mr-2"
              >
                Paid
              </Checkbox>
            </FormControl>
            {eventType === "Paid" && (
              <FormControl isInvalid={!!errors.price} className="mb-4">
                <FormLabel>Price (IDR)</FormLabel>
                <Input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="border p-2 rounded"
                />
                {errors.price && <Text color="red.500">{errors.price}</Text>}
              </FormControl>
            )}
            <FormControl>
              <Button colorScheme="blue" onClick={handleCreateEvent} className="bg-blue-700 text-white p-2 rounded">
                Submit
              </Button>
            </FormControl>
          </CardBody>
        </Card>
      </form>
    </div>
  );
}