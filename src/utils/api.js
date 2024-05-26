import axios from "axios";
import { getAuthToken, getRefreshToken, getUserDetail } from "./auth"; // You need to implement these functions based on your auth logic
const api = axios.create({
  baseURL: `${process.env.API_URL}/api`, // Ensure this is set in your .env file
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor to add token
api.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor to handle errors and refresh token logic
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    const refreshToken = getRefreshToken();

    // If 401 error occurs, try to refresh the token
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      refreshToken
    ) {
      originalRequest._retry = true;
      try {
        const { data } = await api.post("/get-refresh-token", {
          refresh_token: refreshToken,
        });
        localStorage.setItem("userDetail", JSON.stringify(data));
        api.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;
        originalRequest.headers["Authorization"] = `Bearer ${data.token}`;
        return api(originalRequest);
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError);
        // Optionally, handle logout or other actions here
      }
    }

    return Promise.reject(error);
  }
);

export default api;
