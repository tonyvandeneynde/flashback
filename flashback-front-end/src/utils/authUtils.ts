import { API_PREFIX, AUTH_REFRESH_TOKEN } from "../apiConstants";

export const getBearerToken = (): string | null => {
  return localStorage.getItem("bearerToken");
};

export const getRefreshToken = (): string | null => {
  return localStorage.getItem("refreshToken");
};

export const saveBearerToken = (token: string) => {
  localStorage.setItem("bearerToken", token);
};

export const saveRefreshToken = (token: string) => {
  localStorage.setItem("refreshToken", token);
};

export const logout = () => {
  localStorage.removeItem("bearerToken");
  localStorage.removeItem("refreshToken");

  window.location.href = "/login";
};

export const refreshAccessToken = async (): Promise<string> => {
  const refreshToken = getRefreshToken();
  if (!refreshToken) {
    throw new Error("No refresh token found");
  }

  const response = await fetch(`/${API_PREFIX}/${AUTH_REFRESH_TOKEN}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ refreshToken }),
  });

  if (!response.ok) {
    throw new Error("Failed to refresh token");
  }

  const data = await response.json();
  saveBearerToken(data.bearerToken);

  return data.bearerToken;
};
