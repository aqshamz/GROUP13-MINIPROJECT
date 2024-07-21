"use server";
import axios from "axios";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

const base_api = "http://localhost:8000/api";

interface ValidationError {
  msg: string;
}

export const login = async (email: string, password: string) => {
  try {
    const response = await axios.post(`${base_api}/users/login`, { email, password });
    return response.data;
  } catch (error) {
    throw new Error('Login failed');
  }
};

export const register = async (username: string, email: string, password: string, role: string, referralCode: string) => {
  try {
    const response = await axios.post(`${base_api}/users`, { username, password, email, role, ...(referralCode && { referralCode })  });
    return response.data;
  } catch (error) {
    console.log(error)
    let message = "Register failed";
    if (axios.isAxiosError(error) && error.response) {
      if (Array.isArray(error.response.data.errors)) {
        const errors: ValidationError[] = error.response.data.errors;
        message = errors.map((err: ValidationError) => err.msg).join(', ');
      } else {
        message = error.response.data.message;
      }
    }
    throw new Error(message);
  }
};