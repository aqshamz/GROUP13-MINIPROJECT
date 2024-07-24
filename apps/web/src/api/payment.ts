"use server";
import axios from "axios";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

const base_api = "http://localhost:8000/api";

interface ValidationError {
  msg: string;
}

export const updateTransaction = async (id: number, status: string, discountUser: number) => {
  try {
    const response = await axios.post(`${base_api}/users/finishTransaction`, { id, status, discountUser });
    return response.data;
  } catch (error) {
    throw new Error('Update failed');
  }
};
