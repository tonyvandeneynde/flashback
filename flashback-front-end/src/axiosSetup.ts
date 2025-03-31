import axios from "axios";

export const setupAxiosInterceptors = ({
  logout,
  getBearerToken,
  refreshAccessToken,
}: {
  getBearerToken: () => string | null;
  logout: () => void;
  refreshAccessToken: () => Promise<string>;
}) => {
  axios.interceptors.request.use(
    (config) => {
      const token = getBearerToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      } else {
        logout();
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  axios.interceptors.response.use(
    (response) => {
      return response;
    },
    async (error) => {
      const originalRequest = error.config;
      if (error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        try {
          const newToken = await refreshAccessToken();
          axios.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;
          originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
          return axios(originalRequest);
        } catch (refreshError) {
          logout();
          return Promise.reject(refreshError);
        }
      }
      return Promise.reject(error);
    }
  );
};
