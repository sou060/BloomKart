import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const OAuth2RedirectHandler = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.hash.substring(1));
    const token = params.get("token");
    const refreshToken = params.get("refresh_token");
    const error = params.get("error");

    if (error) {
      toast.error(`Authentication failed: ${error}`);
      navigate("/login");
      return;
    }

    if (token && refreshToken) {
      localStorage.setItem("accessToken", token);
      localStorage.setItem("refreshToken", refreshToken);
      toast.success("Login successful!");
      
      // Force a full page reload to the homepage.
      // This is the most reliable way to ensure the app state is updated.
      window.location.href = "/";

    } else {
      toast.error("Authentication failed: Invalid token received from server.");
      navigate("/login");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
