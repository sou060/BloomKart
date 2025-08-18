import React, { useEffect, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";

const OAuth2RedirectHandler = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setTokensFromOAuth2 } = useContext(AuthContext);

  useEffect(() => {
    const handleOAuth2Redirect = () => {
      const urlParams = new URLSearchParams(location.search);
      const token = urlParams.get("token");
      const refreshToken = urlParams.get("refresh_token");
      const error = urlParams.get("error");

      if (error) {
        toast.error(`OAuth2 authentication failed: ${error}`);
        navigate("/login");
        return;
      }

      if (token && refreshToken) {
        try {
          // Store tokens in localStorage
          localStorage.setItem("accessToken", token);
          localStorage.setItem("refreshToken", refreshToken);

          // Update auth context
          setTokensFromOAuth2(token, refreshToken);

          toast.success("Google login successful!");
          navigate("/");
        } catch (error) {
          console.error("Error processing OAuth2 tokens:", error);
          toast.error("Failed to process authentication tokens");
          navigate("/login");
        }
      } else {
        toast.error("No authentication tokens received");
        navigate("/login");
      }
    };

    handleOAuth2Redirect();
  }, [location, navigate, setTokensFromOAuth2]);

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-4">
          <div className="card shadow-custom border-radius-custom">
            <div className="card-body text-center p-4">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <h5 className="mt-3">Processing authentication...</h5>
              <p className="text-muted">
                Please wait while we complete your login.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OAuth2RedirectHandler;
