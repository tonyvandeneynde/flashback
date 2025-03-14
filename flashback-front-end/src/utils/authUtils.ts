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

  const response = await fetch(`${API_PREFIX}/${AUTH_REFRESH_TOKEN}`, {
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

export const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
  let token = getBearerToken();
  if (!token) {
    logout();
    throw new Error("No bearer token found");
  }

  const headers = {
    ...options.headers,
    Authorization: `Bearer ${token}`,
  };

  let response = await fetch(url, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    // Attempt to refresh the token
    try {
      console.log("try refreshAccessToken:");
      token = await refreshAccessToken();
      const newHeaders = {
        ...options.headers,
        Authorization: `Bearer ${token}`,
      };

      response = await fetch(url, {
        ...options,
        headers: newHeaders,
      });
    } catch (error) {
      logout();
      throw new Error("Failed to refresh token");
    }
  }

  if (!response.ok) {
    throw new Error("Failed to fetch");
  }

  return response.json();
};
