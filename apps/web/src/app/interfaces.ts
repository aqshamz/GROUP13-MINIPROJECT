// Event interface
export interface Event {
    id: number;
    title: string;
    description: string;
    date: string; // Use string or Date based on your preference
    locationId: number;
    picture?: string;
    thumbnail?: string;
    userId: number;
    categoryId: number;
    availableSeats: number;
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

  export interface Transaction {
    id: number;
    userId: number;
    eventId: number;
    ticketAmount: number;
    totalAmount: number; 
    pointAmount: number;
    discountAmount: number; 
    finalAmount: number; 
    status: string;
    event: {
      name: string;
    };
  }