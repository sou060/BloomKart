import { useEffect, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import Spinner from "./Spinner";

const OAuth2RedirectHandler = () => {
  const navigate = useNavigate();
  const { decodeAndSetUser, setAccessToken } = useContext(AuthContext);
  const [error, setError] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (token) {
      try {
        localStorage.setItem("accessToken", token);
        setAccessToken(token);
        decodeAndSetUser(token);
        navigate("/");
      } catch (e) {
        setError("Failed to process login. Please try again.");
      }
    } else {
      setError("No token received. Please try logging in again.");
    }
  }, [navigate, decodeAndSetUser, setAccessToken]);

  if (error) {
    return (
      <div>
        <p>{error}</p>
        <button onClick={() => navigate("/login")}>Back to Login</button>
      </div>
    );
  }

  return <Spinner />;
};

export default OAuth2RedirectHandler;
