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

  // Manual JWT decode function as fallback
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

  // Function to decode and set user from token
  const decodeAndSetUser = useCallback((token) => {
    if (token) {
      try {
        console.log("Attempting to decode token:", token.substring(0, 50) + "...");
        
        // Try jwt-decode library first
        let decoded;
        try {
          decoded = jwtDecode(token);
          console.log("jwt-decode library successful:", decoded);
        } catch (jwtLibError) {
          console.warn("jwt-decode library failed, trying manual decode:", jwtLibError);
          decoded = manualJwtDecode(token);
          if (decoded) {
            console.log("Manual decode successful:", decoded);
          }
        }
        
        if (decoded) {
          console.log("Token decoded successfully:", decoded);
          setUser(decoded);
          return decoded;
        } else {
          throw new Error("Both decode methods failed");
        }
      } catch (e) {
        console.error("Error decoding token:", e);
        console.error("Token that failed to decode:", token);
        setUser(null);
        return null;
      }
    }
    console.log("No token provided to decodeAndSetUser");
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
    console.log("AuthContext useEffect triggered. AccessToken:", accessToken ? "Present" : "None");
    if (accessToken) {
      const decodedUser = decodeAndSetUser(accessToken);
      console.log("User set in useEffect:", decodedUser);
    }
    setLoading(false);
    console.log("Loading set to false");
  }, [accessToken, decodeAndSetUser]);

  const login = async (email, password) => {
    console.log("Login attempt for:", email);
    const res = await api.post("/auth/login", { email, password });
    console.log("Login response received:", res.data);
    
    const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
      res.data;

    console.log("Setting tokens in state and localStorage");
    setAccessToken(newAccessToken);
    setRefreshToken(newRefreshToken);
    localStorage.setItem("accessToken", newAccessToken);
    localStorage.setItem("refreshToken", newRefreshToken);

    console.log("Decoding and setting user from token");
    const decodedUser = decodeAndSetUser(newAccessToken);
    console.log("Login process completed. Decoded user:", decodedUser);
    
    // Ensure user state is set before returning
    if (decodedUser) {
      console.log("✅ User successfully decoded and set:", decodedUser.email, decodedUser.role);
      // Verify the user state is actually set in the context
      console.log("Current user state in context will be:", decodedUser);
    } else {
      console.error("❌ Failed to decode user from token");
      throw new Error("Failed to authenticate user");
    }
    
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
      setUser(null);
      setAccessToken(null);
      setRefreshToken(null);
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("cart"); // Clear cart on logout
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

  const setTokensFromOAuth2 = (token, refreshTokenValue) => {
    setAccessToken(token);
    setRefreshToken(refreshTokenValue);
    decodeAndSetUser(token);
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
        setTokensFromOAuth2,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
