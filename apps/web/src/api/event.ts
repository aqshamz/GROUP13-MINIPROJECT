"use server"
import axios from "axios"
import { redirect } from 'next/navigation'
import { Event, Category, Location} from "../app/interfaces";
import { getCookie } from "@/actions/cookies";
const base_api = "http://localhost:8000/api"


export async function getAllEvents(page: number, pageSize: number, query?: string, categoryId?: number): Promise<{ data: Event[], total: number }> {
  try {
    let url = `${base_api}/event/events?page=${page}&pageSize=${pageSize}`;

    if (categoryId !== undefined && categoryId !== null) {
      url += `&categoryId=${categoryId}`;
    }

    if (query) {
      url += `&query=${query}`;
    }

    const res = await axios.get<{ data: Event[], total: number }>(url);

    return res.data;
  } catch (error) {
    console.error("Error fetching events:", error);
    throw error;
  }
}

export async function getEventById(id: number): Promise<{ data: Event }> {
  try {
    const res = await axios.get<Event>(`${base_api}/event/${id}`);
    
    return res.data;
  } catch (error) {
    console.error("Error fetching event by ID:", error);
    if (axios.isAxiosError(error)) {
      console.error('Response data:', error.response?.data);
      console.error('Response status:', error.response?.status);
      console.error('Response headers:', error.response?.headers);
    }
    throw error;
  }
}

export async function getAllCategories(): Promise<Category[]> {
  try {
    const res = await axios.get<Category[]>(`${base_api}/event/categories`);
    return res.data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
}

export async function getCategoryById(categoryId: number): Promise<Category> {
  try {
    const res = await axios.get<Category>(`${base_api}/event/categories/${categoryId}`);
    return res.data.data;
  } catch (error) {
    console.error("Error fetching category:", error);
    throw error;
  }
}

export async function getEventsByCategory(categoryId: number, page: number, pageSize: number): Promise<{ data: Event[], total: number }> {
  try {
    const url = `${base_api}/event/eventsByCategory?categoryId=${categoryId}&page=${page}&pageSize=${pageSize}`;
    console.log(`Requesting URL: ${url}`); // Log the URL being requested

    const res = await axios.get<{ data: Event[], total: number }>(url);
    console.log(`Response data:`, res.data); // Log the response data

    return res.data;
  } catch (error) {
    console.error("Error fetching events by category:", error);
    if (axios.isAxiosError(error) && error.response) {
      // Provide detailed error information
      throw new Error(`${error.response.data.message || error.message}`);
    }
    throw new Error("An unexpected error occurred.");
  }
}

export async function getAllLocations(): Promise<Location[]> {
  try {
    const res = await axios.get<Location[]>(`${base_api}/event/locations`);
    return res.data;
  } catch (error) {
    console.error("Error fetching locations:", error);
    throw error;
  }
}

export async function getLocationById(locationId: number): Promise<Location> {
  try {
    const res = await axios.get<Location>(`${base_api}/event/locations/${locationId}`);
    return res.data.data;
  } catch (error) {
    console.error("Error fetching location:", error);
    throw error;
  }
}

export async function getEventsByLocation(locationId: number, page: number, pageSize: number): Promise<{ data: Event[], total: number }> {
  try {
    const url = `${base_api}/event/eventsByLocation?locationId=${locationId}&page=${page}&pageSize=${pageSize}`;
    console.log(`Requesting URL: ${url}`); // Log the URL being requested

    const res = await axios.get<{ data: Event[], total: number }>(url);
    console.log(`Response data:`, res.data); // Log the response data

    return res.data;
  } catch (error) {
    console.error("Error fetching events by location:", error);
    if (axios.isAxiosError(error) && error.response) {
      // Provide detailed error information
      throw new Error(`${error.response.data.message || error.message}`);
    }
    throw new Error("An unexpected error occurred.");
  }
}

export async function getEventsByCategoryAndLocation(
  categoryId: number | null,
  locationId: number | null,
  page: number,
  pageSize: number
): Promise<{ data: Event[], total: number }> {
  try {
    const url = `${base_api}/event/eventsByCategoryAndLocation?categoryId=${categoryId}&locationId=${locationId}&page=${page}&pageSize=${pageSize}`;
    console.log(`Requesting URL: ${url}`); // Log the URL being requested

    const res = await axios.get<{ data: Event[], total: number }>(url);
    console.log(`Response data:`, res.data); // Log the response data

    return res.data;
  } catch (error) {
    console.error("Error fetching events by category and location:", error);
    if (axios.isAxiosError(error) && error.response) {
      // Provide detailed error information
      throw new Error(`${error.response.data.message || error.message}`);
    }
    throw new Error("An unexpected error occurred.");
  }
  }


export async function createEvent(formData: FormData) {
  try {
    const authToken = await getCookie("authToken")
    
    const res = await axios.post(`${base_api}/event/add`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': "Bearer " + authToken
      }
    });

    if (res.status !== 200) {
      throw new Error('Failed to create event');
    }

    return res.data; // Return the data from the response

  } catch (error) {
    console.error('Error creating event:', error);
    throw error; // Re-throw the error to handle it in the calling function
  }
}

interface CreateDiscountParams {
  eventId: number;
  code: string;
  discountPercentage: number;
  validFrom: string;
  validTo: string;
}

export const createDiscount = async (params: CreateDiscountParams) => {
  const { eventId, code, discountPercentage, validFrom, validTo } = params;
  const response = await axios.post(`${base_api}/event/events/${eventId}/discounts`, {
    code,
    discountPercentage,
    validFrom,
    validTo,
  });
  return response.data;
};

export const applyEventDiscount = async (eventId: number, code: string) => {
  const response = await axios.post(`${base_api}/event/events/${eventId}/apply-discount`, {
    code,
  });
  return response.data;
};

// export async function getCommentsByEventId(eventId: number): Promise<{ data: Comment[] }> {
//   try {
//     const res = await axios.get<{ data: Comment[] }>(`${base_api}/event/comments/${eventId}`);
//     return res.data;
//   } catch (error) {
//     console.error("Error fetching comments by event ID:", error);
//     throw error;
//   }
// }

// export async function createComment(commentData: { userId: number; eventId: number; text: string }): Promise<{ data: Comment }> {
//   try {
//     const res = await axios.post<{ data: Comment }>(`${base_api}/event/comments`, commentData);
//     return res.data;
//   } catch (error) {
//     console.error("Error creating comment:", error);
//     throw error;
//   }
// }

// export async function buyTicket(ticketData: { userId: number; eventId: number }): Promise<void> {
//   try {
//     const res = await axios.post(`${base_api}/event/${ticketData.eventId}/tickets`, ticketData);
    
//     if (res.status !== 200) {
//       throw new Error('Failed to purchase ticket');
//     }

//   } catch (error) {
//     console.error('Error purchasing ticket:', error);
//     throw error;
//   }
// }


