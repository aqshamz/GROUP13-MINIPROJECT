"use server";
import axios from "axios";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

const base_api = "http://localhost:8000/api";

// export function login(email: string, password: string) {
//   console.log("Attempting login with email:", email);
//   try {
//     // Simulate a response
//     const res = await axios.post(`${base_api}/users/login`, {
//       email,
//       password,
//     });
//     console.log("Login API response:", res);
//     return res;
//   } catch (error) {
//     console.error("Error logging in:", error);
//     throw error;
//   }
// }

export const login = async (email: string, password: string) => {
  try {
    const response = await axios.post(`${base_api}/users/login`, { email, password });
    return response.data;
  } catch (error) {
    throw new Error('Login failed');
  }
};