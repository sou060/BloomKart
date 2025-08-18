import React, { createContext, useState, useEffect, useCallback, useMemo } from "react";
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

  const manualJwtDecode = (token) => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error("Manual JWT decode error:", error);
      return null;
    }
  };

  const decodeAndSetUser = useCallback((token) => {
    if (token) {
      try {
        let decoded;
        try {
          decoded = jwtDecode(token);
        } catch (jwtLibError) {
          decoded = manualJwtDecode(token);
        }
        
        if (decoded) {
          setUser(decoded);
          return decoded;
        } else {
          throw new Error("Both decode methods failed");
        }
      } catch (e) {
        console.error("Error decoding token:", e);
        setUser(null);
        return null;
      }
    }
    return null;
  }, []);

  const setTokens = useCallback((newAccessToken, newRefreshToken) => {
    localStorage.setItem("accessToken", newAccessToken);
    localStorage.setItem("refreshToken", newRefreshToken);
    setAccessToken(newAccessToken);
    setRefreshToken(newRefreshToken);
    decodeAndSetUser(newAccessToken);
  }, [decodeAndSetUser]);

  const refreshTokens = useCallback(async () => {
    if (!refreshToken || refreshing) return null;

    setRefreshing(true);
    try {
      const response = await api.post("/auth/refresh", { refreshToken });
      const { accessToken: newAccessToken, refreshToken: newRefreshToken } = response.data;
      setTokens(newAccessToken, newRefreshToken);
      return newAccessToken;
    } catch (error) {
      console.error("Token refresh failed:", error);
      logout();
      return null;
    } finally {
      setRefreshing(false);
    }
  }, [refreshToken, refreshing, setTokens]);

  const checkAndRefreshToken = useCallback(async () => {
    if (!accessToken) return null;

    try {
      const decoded = jwtDecode(accessToken);
      const currentTime = Date.now() / 1000;
      const timeUntilExpiry = decoded.exp - currentTime;

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

  const login = useCallback(async (email, password) => {
    const res = await api.post("/auth/login", { email, password });
    const { accessToken: newAccessToken, refreshToken: newRefreshToken } = res.data;
    setTokens(newAccessToken, newRefreshToken);
    return res.data;
  }, [setTokens]);

  const register = useCallback(async (name, email, password, phoneNumber) => {
    const res = await api.post("/auth/register", { name, email, password, phoneNumber });
    const { accessToken: newAccessToken, refreshToken: newRefreshToken } = res.data;
    setTokens(newAccessToken, newRefreshToken);
    return res.data;
  }, [setTokens]);

  const logout = useCallback(async (showMessage = true) => {
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
      setUser(null);
      setAccessToken(null);
      setRefreshToken(null);
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("cart");
    }
  }, [refreshToken]);

  const logoutAllSessions = useCallback(async () => {
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
  }, []);

  const updateUser = useCallback(async (userData) => {
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
  }, []);

  const contextValue = useMemo(() => ({
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
    setTokensFromOAuth2: setTokens,
  }), [
    user,
    accessToken,
    refreshToken,
    loading,
    refreshing,
    login,
    register,
    logout,
    logoutAllSessions,
    refreshTokens,
    checkAndRefreshToken,
    updateUser,
    setTokens
  ]);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};
