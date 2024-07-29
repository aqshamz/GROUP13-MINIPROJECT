"use server";
import axios from "axios";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { Transaction } from "../app/interfaces";
import { getCookie } from "@/actions/cookies";

const base_api = "http://localhost:8000/api";

interface ValidationError {
  msg: string;
}

export async function getAllTransactions() {
  try {
    const authToken = await getCookie("authToken")
    const res = await axios.get(`${base_api}/payments/transaction`, {
      headers: {
        'Authorization': `Bearer ${authToken}`,
      }
    });
    // console.log(res.data)
    return res.data;
  } catch (error) {
    console.error("Error fetching transactions:", error);
    throw error;
  }
}

export async function getUserDiscount() {
  try {
    const authToken = await getCookie("authToken")
    const res = await axios.get(`${base_api}/payments/discounts`, {
      headers: {
        'Authorization': `Bearer ${authToken}`,
      }
    });
    // console.log(res.data)
    return res.data;
  } catch (error) {
    console.error("Error fetching transactions:", error);
    throw error;
  }
}

export async function getUserPoint() {
  try {
    const authToken = await getCookie("authToken")
    const res = await axios.get(`${base_api}/payments/points`, {
      headers: {
        'Authorization': `Bearer ${authToken}`,
      }
    });
    // console.log(res.data)
    return res.data;
  } catch (error) {
    console.error("Error fetching transactions:", error);
    throw error;
  }
}

export async function getEventDiscount(id: number, code: string) {
  try {
    const res = await axios.post(`${base_api}/payments/specialcode`, { id, code });
    // console.log(res.data)
    return res.data;
  } catch (error) {
    console.error("Error fetching transactions:", error);
    throw error;
  }
}

export const finishTransaction = async (id: number, type: number, discountId: number) => {
  try {
    const authToken = await getCookie("authToken")
    // let statusTransaction;
    // console.log(id)
    // if(type == 1){
    //   let statusTransaction = "Completed"    
    // }else{
    //   let statusTransaction = "Cancelled"    
    // }
    const response = await axios.post(`${base_api}/payments/transaction`,  { id, type, discountId }, // Body of the request
    {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });
    
    return response.data;
  } catch (error) {
    throw new Error('Transaction failed');
  }
};

export const freeTicket = async (eventId: number, seat: number, amount: number) => {
  try {
    const authToken = await getCookie("authToken")
    const response = await axios.post(`${base_api}/payments/ticket`,  { eventId, seat, amount }, // Body of the request
    {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error('Make Ticket failed');
  }
};

export const orderTicket = async (eventId: number, ticketAmount: number, totalAmount: number, pointAmount: number, discountAmount: number, finalAmount: number, discountId: number) => {
  try {
    const authToken = await getCookie("authToken")
    const response = await axios.post(`${base_api}/payments/order`,  { eventId, ticketAmount, totalAmount, pointAmount, discountAmount, finalAmount, discountId }, // Body of the request
    {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error('Make Ticket failed');
  }
};