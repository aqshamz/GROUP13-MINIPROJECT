// Event interface
export interface Event {
    id: number;
    title: string;
    description: string;
    datetime: string; // Use string or Date based on your preference
    locationId: number;
    picture?: string;
    thumbnail?: string;
    organizerId: number;
    categoryId: number;
    availableSeats: number;
    eventType: string;
    price: number;
    // Add other fields as per your API response
  }
  
  // Category interface
  export interface Category {
    id: number;
    name: string;
    // Add other fields as per your API response
  }
    
  
  export interface Location {
    id: number;
    name: string;
  }
  
  export interface Comment {
    id: number;
    text: string;
    userId: number;
    eventId: number;
    user: {
      id: number;
      name: string;
      email: string;
    };
  }
  
  export interface User {
    id: number;
    name: string;
    email: string;
    
  }