"use client";

import { useState } from "react";
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
} from "@chakra-ui/react";
import { createEvent } from "@/api/event";

export default function EventAdd() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [locationId, setLocationId] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [userId, setUserId] = useState("");
  const [picture, setPicture] = useState<File | null>(null);
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [availableSeats, setAvailableSeats] = useState("");
  const [price, setPrice] = useState("");

  const handleCreateEvent = async () => {
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("date", date);
      formData.append("locationId", locationId);
      formData.append("categoryId", categoryId);
      formData.append("userId", userId);
      formData.append("availableSeats", availableSeats);
      formData.append("price", price);
      if (picture) {
        formData.append("picture", picture);
      }
      if (thumbnail) {
        formData.append("thumbnail", thumbnail);
      }

      const response = await createEvent(formData);
      console.log("Event created successfully:", response.data);
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

  return (
    <Container>
      <Text as={"h1"}> Event Add </Text>
      <hr />
      <p> This is Event page </p>

      <form>
        <Card>
          <CardBody>
            <FormControl>
              <FormLabel>Title</FormLabel>
              <Input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
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
                type="text"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </FormControl>
            <FormControl>
              <FormLabel>LocationId</FormLabel>
              <Input
                type="text"
                value={locationId}
                onChange={(e) => setLocationId(e.target.value)}
              />
            </FormControl>
            <FormControl>
              <FormLabel>CategoryId</FormLabel>
              <Input
                type="text"
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
              />
            </FormControl>
            <FormControl>
              <FormLabel>UserId</FormLabel>
              <Input
                type="text"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
              />
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
              <FormLabel>Price</FormLabel>
              <Input
                type="text"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
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