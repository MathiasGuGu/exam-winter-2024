import { LOGIN_URL } from "../../constants";
import { LoginResponse, fetchError } from "../../../types/listing";

export async function login(email: string, password: string) {
  try {
    const response = await fetch(LOGIN_URL, {
      method: "POST",
      body: JSON.stringify({ email, password }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data: LoginResponse = await response.json();

    return data;
  } catch (error: any) {
    const errorResponse: fetchError = error;
    return errorResponse;
  }
}
