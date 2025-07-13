import React, { useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import {
  FaTachometerAlt,
  FaBox,
  FaPlus,
  FaHistory,
  FaUsers,
  FaChartBar,
  FaCog,
  FaSignOutAlt,
  FaCrown,
  FaHome,
  FaFileAlt,
  FaBoxes,
  FaBell,
} from "react-icons/fa";

const AdminSidebar = () => {
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;
  const isActiveParent = (path) => location.pathname.startsWith(path);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const menuItems = [
    {
      title: "Dashboard",
      path: "/admin",
      icon: FaTachometerAlt,
      exact: true,
    },
    {
      title: "Products",
      path: "/admin/products",
      icon: FaBox,
      children: [
        { title: "All Products", path: "/admin/products" },
        { title: "Add Product", path: "/admin/products/add" },
      ],
    },
    {
      title: "Inventory",
      path: "/admin/inventory",
      icon: FaBoxes,
    },
    {
      title: "Orders",
      path: "/admin/orders",
      icon: FaHistory,
    },
    {
      title: "Users",
      path: "/admin/users",
      icon: FaUsers,
    },
    {
      title: "Analytics",
      path: "/admin/analytics",
      icon: FaChartBar,
    },
    {
      title: "Reports",
      path: "/admin/reports",
      icon: FaFileAlt,
    },
    {
      title: "Notifications",
      path: "/admin/notifications",
      icon: FaBell,
    },
    {
      title: "Settings",
      path: "/admin/settings",
      icon: FaCog,
    },
  ];

  return (
    <div className="admin-sidebar">
      {/* Admin Header */}
      <div className="admin-sidebar-header">
        <div className="d-flex align-items-center mb-3">
          <div className="admin-avatar me-3">
            {user?.profileImage ? (
              <img
                src={user.profileImage}
                alt={user.name}
                className="rounded-circle"
                width="40"
                height="40"
              />
            ) : (
              <div className="admin-avatar-placeholder">
                <FaCrown className="text-warning" />
              </div>
            )}
          </div>
          <div>
            <div className="fw-bold text-white">{user?.name}</div>
            <div className="small text-light">Administrator</div>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="admin-nav">
        <ul className="nav flex-column">
          {/* Back to Main Site */}
          <li className="nav-item mb-2">
            <Link to="/" className="nav-link admin-nav-link">
              <FaHome className="me-2" />
              Back to Site
            </Link>
          </li>

          <li className="nav-divider"></li>

          {/* Admin Menu Items */}
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActiveItem = item.exact
              ? isActive(item.path)
              : isActiveParent(item.path);

            return (
              <li key={item.path} className="nav-item">
                {item.children ? (
                  <div className="nav-item-with-children">
                    <div
                      className={`nav-link admin-nav-link ${
                        isActiveItem ? "active" : ""
                      }`}
                    >
                      <Icon className="me-2" />
                      {item.title}
                    </div>
                    {isActiveItem && (
                      <ul className="nav flex-column ms-3 mt-2">
                        {item.children.map((child) => (
                          <li key={child.path} className="nav-item">
                            <Link
                              to={child.path}
                              className={`nav-link admin-nav-link admin-nav-link-child ${
                                isActive(child.path) ? "active" : ""
                              }`}
                            >
                              {child.title}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ) : (
                  <Link
                    to={item.path}
                    className={`nav-link admin-nav-link ${
                      isActiveItem ? "active" : ""
                    }`}
                  >
                    <Icon className="me-2" />
                    {item.title}
                  </Link>
                )}
              </li>
            );
          })}

          <li className="nav-divider"></li>

          {/* Logout */}
          <li className="nav-item">
            <button
              onClick={handleLogout}
              className="nav-link admin-nav-link text-start w-100 border-0 bg-transparent"
            >
              <FaSignOutAlt className="me-2" />
              Logout
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default AdminSidebar;
