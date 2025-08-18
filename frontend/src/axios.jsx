import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080/api", // Java Spring Boot backend
  withCredentials: true,
});

// Add request interceptor to include JWT token and handle token refresh
api.interceptors.request.use(
  async (config) => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      // Check if token needs refresh
      try {
        const tokenData = JSON.parse(atob(accessToken.split(".")[1]));
        const currentTime = Date.now() / 1000;
        const timeUntilExpiry = tokenData.exp - currentTime;

        // If token expires in less than 5 minutes, try to refresh
        if (timeUntilExpiry < 300) {
          const refreshToken = localStorage.getItem("refreshToken");
          if (refreshToken) {
            try {
              const response = await axios.post(
                "http://localhost:8080/api/auth/refresh",
                {
                  refreshToken,
                }
              );
              const {
                accessToken: newAccessToken,
                refreshToken: newRefreshToken,
              } = response.data;
              localStorage.setItem("accessToken", newAccessToken);
              localStorage.setItem("refreshToken", newRefreshToken);
              config.headers.Authorization = `Bearer ${newAccessToken}`;
            } catch (refreshError) {
              // Refresh failed, remove tokens and continue
              localStorage.removeItem("accessToken");
              localStorage.removeItem("refreshToken");
            }
          }
        } else {
          config.headers.Authorization = `Bearer ${accessToken}`;
        }
      } catch (error) {
        // Token is invalid, remove it
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle token expiration and other errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Do not intercept 401 for login or register
    if (originalRequest.url === '/auth/login' || originalRequest.url === '/auth/register') {
        return Promise.reject(error);
    }

    // Handle 401 errors (unauthorized) for other requests
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = localStorage.getItem("refreshToken");
      if (refreshToken) {
        try {
          const response = await axios.post(
            "http://localhost:8080/api/auth/refresh",
            {
              refreshToken,
            }
          );
          const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
            response.data;
          localStorage.setItem("accessToken", newAccessToken);
          localStorage.setItem("refreshToken", newRefreshToken);

          // Retry the original request with new token
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return api(originalRequest);
        } catch (refreshError) {
          // Refresh failed, clear tokens and redirect to login
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          window.location.href = "/login";
          return Promise.reject(refreshError);
        }
      } else {
        // No refresh token, clear tokens and redirect to login
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        window.location.href = "/login";
      }
    }

    // Handle other errors
    if (error.response?.status === 403) {
      console.error("Access forbidden");
    } else if (error.response?.status >= 500) {
      console.error("Server error:", error.response.data);
    }

    return Promise.reject(error);
  }
);

export default api;
