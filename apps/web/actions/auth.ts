import axios from "axios";
import { BACKEND_URL } from "../lib/config";

export async function signUp(name: string, email: string, password: string) {
  try {
    const response = await axios.post(`${BACKEND_URL}/api/user/signup`, {
      name,
      email,
      password,
    });
    const token = response.data.token;
    localStorage.setItem("token", token);
    return response.data; 
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Sign Up Error:", error.response?.data || error.message);
    }
    throw error; 
  }
}

export async function signIn(email: string, password: string) {
  try {
    const response = await axios.post(`${BACKEND_URL}/api/user/signin`, {
      email,
      password,
    });
    const token = response.data.token;
    localStorage.setItem("token", token);
    return response.data; 
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Sign In Error:", error.response?.data || error.message);
    }
    throw error; 
  }
}