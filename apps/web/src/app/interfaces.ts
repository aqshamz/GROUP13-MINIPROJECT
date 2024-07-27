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

  export interface Ticket {
    id: number;
    attendeeId: number;
    credentials: string;
    event: {
      name: string;
      datetime: string;
      location: {
        name: string;
      }
    };
  }

  export interface TicketDashboard {
    id: number;
    credentials: string;
    event: {
      name: string;
      datetime: string;
    };
    attendee: {
      username: string;
    };
  }

  export interface TransactionDashboard {
    id: number;
    userId: number;
    eventId: number;
    ticketAmount: number;
    totalAmount: number; 
    pointAmount: number;
    discountAmount: number; 
    finalAmount: number; 
    status: string;
    user: {
      username: string;
    };
    event: {
      name: string;
    };
  }

  export interface EventDashboard {
    id: number;
    name: string;
    datetime: string;
    eventType: string;
    location: {
      name: string;
    };
  }