import axios from "axios";
import { API_PREFIX, AUTH_GOOGLE, AUTH_ME } from "../apiConstants";

interface User {
  email: string;
  name: string;
  picture: string;
}

export const loginWithGoogle = async (
  code: string
): Promise<{ bearerToken: string; refreshToken: string }> => {
  const res = await fetch(`/${API_PREFIX}/${AUTH_GOOGLE}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ code }),
  });

  return res.json();
};

export const getMe = async (): Promise<User | null> => {
  const res = await axios.get(`/${API_PREFIX}/${AUTH_ME}`);
  return res.data;
};
