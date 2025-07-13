import React from "react";
import AdminSidebar from "./AdminSidebar";

const AdminLayout = ({ children }) => {
  return (
    <div className="admin-layout">
      <AdminSidebar />
      <div className="admin-content">
        <div className="admin-content-wrapper">{children}</div>
      </div>
    </div>
  );
};

export default AdminLayout;
