import { API_PREFIX, AUTH_GOOGLE } from "../apiConstants";

export const loginWithGoogle = async (
  code: string
): Promise<{ bearerToken: string; refreshToken: string }> => {
  const res = await fetch(`${API_PREFIX}/${AUTH_GOOGLE}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ code }),
  });

  return res.json();
};
