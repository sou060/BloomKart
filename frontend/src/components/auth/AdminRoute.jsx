import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

const AdminRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);

  console.log("AdminRoute - User:", user);
  console.log("AdminRoute - Loading:", loading);
  console.log("AdminRoute - User role:", user?.role);

  if (loading) {
    return (
      <div className="loading-spinner">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!user) {
    console.log("AdminRoute - No user, redirecting to login");
    return <Navigate to="/login" replace />;
  }

  if (user.role !== "ADMIN") {
    console.log("AdminRoute - User is not admin, redirecting to home");
    return <Navigate to="/" replace />;
  }

  console.log("AdminRoute - User is admin, rendering children");
  return children;
};

export default AdminRoute;
