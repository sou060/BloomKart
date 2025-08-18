import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const OAuth2RedirectHandler = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.log("OAuth2RedirectHandler: Component mounted.");
    console.log("OAuth2RedirectHandler: Full URL location object:", location);
    console.log("OAuth2RedirectHandler: URL fragment (hash):", location.hash);

    if (!location.hash) {
      console.error("OAuth2RedirectHandler: No URL fragment found!");
      toast.error("Authentication failed: Invalid redirect.");
      navigate("/login");
      return;
    }

    // Remove the leading '#' from the fragment
    const fragment = location.hash.substring(1);
    console.log("OAuth2RedirectHandler: Fragment string to be parsed:", fragment);

    const urlParams = new URLSearchParams(fragment);
    const token = urlParams.get("token");
    const refreshToken = urlParams.get("refresh_token");
    const error = urlParams.get("error");

    console.log("OAuth2RedirectHandler: Parsed token:", token);
    console.log("OAuth2RedirectHandler: Parsed refresh_token:", refreshToken);
    console.log("OAuth2RedirectHandler: Parsed error:", error);

    if (error) {
      console.error("OAuth2RedirectHandler: Error received from server:", error);
      toast.error(`Authentication failed: ${error}`);
      navigate("/login");
      return;
    }

    if (token && refreshToken) {
      console.log("OAuth2RedirectHandler: Tokens found. Storing in localStorage...");
      localStorage.setItem("accessToken", token);
      localStorage.setItem("refreshToken", refreshToken);
      console.log("OAuth2RedirectHandler: Tokens stored. Redirecting to homepage...");
      toast.success("Login successful!");
      window.location.href = "/";
    } else {
      console.error("OAuth2RedirectHandler: Tokens not found in URL fragment.");
      toast.error("Authentication failed: Invalid token received.");
      navigate("/login");
    }
    // The dependency array is empty to ensure this runs only once.
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
