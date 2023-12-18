import { REGISTER_URL } from "../../constants";
import { RegisterResponse, fetchError } from "../../../types/listing";

export async function register(
  name: string,
  email: string,
  password: string,
  media: string = ""
) {
  try {
    const response = await fetch(REGISTER_URL, {
      method: "POST",
      body: JSON.stringify({ name, email, password, media }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data: RegisterResponse = await response.json();

    return data;
  } catch (error: any) {
    const errorResponse: fetchError = error;
    return errorResponse;
  }
}
