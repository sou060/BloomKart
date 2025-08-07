import React, { createContext, useState, useEffect, useCallback } from "react";
import api from "../axios";
import jwtDecode from "jwt-decode";
import { toast } from "react-toastify";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(
    localStorage.getItem("accessToken")
  );
  const [refreshToken, setRefreshToken] = useState(
    localStorage.getItem("refreshToken")
  );
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Function to decode and set user from token
  const decodeAndSetUser = useCallback((token) => {
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser(decoded);
        return decoded;
      } catch (e) {
        console.error("Error decoding token:", e);
        setUser(null);
        return null;
      }
    }
    return null;
  }, []);

  // Function to refresh tokens
  const refreshTokens = useCallback(async () => {
    if (!refreshToken || refreshing) return null;

    setRefreshing(true);
    try {
      const response = await api.post("/auth/refresh", { refreshToken });
      const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
        response.data;

      setAccessToken(newAccessToken);
      setRefreshToken(newRefreshToken);
      localStorage.setItem("accessToken", newAccessToken);
      localStorage.setItem("refreshToken", newRefreshToken);

      decodeAndSetUser(newAccessToken);
      return newAccessToken;
    } catch (error) {
      console.error("Token refresh failed:", error);
      logout();
      return null;
    } finally {
      setRefreshing(false);
    }
  }, [refreshToken, refreshing, decodeAndSetUser]);

  // Check if token needs refresh
  const checkAndRefreshToken = useCallback(async () => {
    if (!accessToken) return null;

    try {
      const decoded = jwtDecode(accessToken);
      const currentTime = Date.now() / 1000;
      const timeUntilExpiry = decoded.exp - currentTime;

      // Refresh if token expires in less than 5 minutes
      if (timeUntilExpiry < 300) {
        return await refreshTokens();
      }
      return accessToken;
    } catch (error) {
      console.error("Error checking token:", error);
      return await refreshTokens();
    }
  }, [accessToken, refreshTokens]);

  useEffect(() => {
    if (accessToken) {
      decodeAndSetUser(accessToken);
    }
    setLoading(false);
  }, [accessToken, decodeAndSetUser]);

  const login = async (email, password) => {
    const res = await api.post("/auth/login", { email, password });
    const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
      res.data;

    setAccessToken(newAccessToken);
    setRefreshToken(newRefreshToken);
    localStorage.setItem("accessToken", newAccessToken);
    localStorage.setItem("refreshToken", newRefreshToken);

    decodeAndSetUser(newAccessToken);
    return res.data;
  };

  const register = async (name, email, password, phoneNumber) => {
    const res = await api.post("/auth/register", {
      name,
      email,
      password,
      phoneNumber,
    });
    const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
      res.data;

    setAccessToken(newAccessToken);
    setRefreshToken(newRefreshToken);
    localStorage.setItem("accessToken", newAccessToken);
    localStorage.setItem("refreshToken", newRefreshToken);

    decodeAndSetUser(newAccessToken);
    return res.data;
  };

  const logout = async (showMessage = true) => {
    try {
      if (refreshToken) {
        await api.post("/auth/logout", { refreshToken });
        if (showMessage) {
          toast.success("Logged out successfully!");
        }
      }
    } catch (error) {
      console.error("Logout error:", error);
      if (showMessage) {
        toast.error("Logout failed. Please try again.");
      }
    } finally {
      console.log("Logging out: clearing user and tokens");
      setUser(null);
      setAccessToken(null);
      setRefreshToken(null);
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("cart"); // Clear cart on logout
      console.log(
        "Logout complete. User:",
        user,
        "AccessToken:",
        accessToken,
        "RefreshToken:",
        refreshToken
      );
    }
  };

  const logoutAllSessions = async () => {
    try {
      await api.post("/auth/logout-all");
      toast.success("All sessions logged out successfully!");
    } catch (error) {
      console.error("Logout all sessions error:", error);
      toast.error("Failed to logout all sessions");
    } finally {
      setUser(null);
      setAccessToken(null);
      setRefreshToken(null);
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("cart");
    }
  };

  const updateUser = async (userData) => {
    try {
      const response = await api.put("/auth/profile", userData);
      const updatedUser = response.data;
      setUser(updatedUser);
      return { success: true, user: updatedUser };
    } catch (error) {
      console.error("Update user error:", error);
      return {
        success: false,
        error: error.response?.data?.message || "Update failed",
      };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        refreshToken,
        login,
        register,
        logout,
        logoutAllSessions,
        loading,
        refreshing,
        refreshTokens,
        checkAndRefreshToken,
        updateUser,
        setAccessToken,
        decodeAndSetUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
