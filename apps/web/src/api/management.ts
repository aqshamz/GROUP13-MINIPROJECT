"use server";
import axios from "axios";
// import { redirect } from "next/navigation";
// import { cookies } from "next/headers";
// import { Transaction } from "../app/interfaces";
import { getCookie } from "@/actions/cookies";

const base_api = "http://localhost:8000/api";

interface ValidationError {
  msg: string;
}

export async function getEventOrganizer() {
  try {
    const authToken = await getCookie("authToken")
    const res = await axios.get(`${base_api}/managements/eventbyid`, {
      headers: {
        'Authorization': `Bearer ${authToken}`,
      }
    });
    // console.log(res.data)
    return res.data;
  } catch (error) {
    console.error("Error fetching events:", error);
    throw error;
  }
}

export async function getTransactionOrganizer() {
    try {
      const authToken = await getCookie("authToken")
      const res = await axios.get(`${base_api}/managements/transactionbyid`, {
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

  export async function getTicketOrganizer() {
    try {
      const authToken = await getCookie("authToken")
      const res = await axios.get(`${base_api}/managements/ticketbyid`, {
        headers: {
          'Authorization': `Bearer ${authToken}`,
        }
      });
      // console.log(res.data)
      return res.data;
    } catch (error) {
      console.error("Error fetching tickets:", error);
      throw error;
    }
  }
