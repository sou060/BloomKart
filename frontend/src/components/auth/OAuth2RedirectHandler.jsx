import React, { useEffect, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

const OAuth2RedirectHandler = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setAccessToken, decodeAndSetUser } = useContext(AuthContext);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get("token");
    console.log("[OAuth2RedirectHandler] Token from URL:", token);
    if (token) {
      localStorage.setItem("accessToken", token);
      console.log(
        "[OAuth2RedirectHandler] accessToken set in localStorage:",
        localStorage.getItem("accessToken")
      );
      setAccessToken(token);
      const user = decodeAndSetUser(token);
      console.log("[OAuth2RedirectHandler] User decoded from token:", user);
      // Optionally, fetch user profile or refresh other contexts here
      setTimeout(() => {
        console.log("[OAuth2RedirectHandler] Navigating to home page");
        navigate("/");
      }, 1000);
    } else {
      // No token, redirect to login
      console.warn(
        "[OAuth2RedirectHandler] No token found in URL. Redirecting to /login"
      );
      navigate("/login");
    }
    // eslint-disable-next-line
  }, []);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <div className="spinner-border" role="status">
        <span className="visually-hidden">Processing login...</span>
      </div>
      <span style={{ marginLeft: 16 }}>Processing login...</span>
    </div>
  );
};

export default OAuth2RedirectHandler;
