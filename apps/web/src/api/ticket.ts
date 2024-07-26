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

export async function getAllTickets() {
  try {
    const authToken = await getCookie("authToken")
    const res = await axios.get(`${base_api}/users/ticket`, {
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

