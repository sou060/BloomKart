import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { CartContext } from "../context/CartContext";
import { toast } from "react-toastify";
import {
  FaUser,
  FaSignOutAlt,
  FaCog,
  FaBox,
  FaHeart,
  FaAddressBook,
  FaCreditCard,
  FaShieldAlt,
  FaChevronDown,
  FaUserCircle,
  FaHistory,
  FaBell,
  FaCrown,
  FaGift,
  FaQuestionCircle,
  FaHeadset,
} from "react-icons/fa";

const UserProfileDropdown = ({ user, isOpen, onToggle, onClose }) => {
  const { logout } = useContext(AuthContext);
  const { cart, clearCart } = useContext(CartContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);

    try {
      // Clear all local storage
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("cart");

      // Clear cart
      clearCart();

      // Force page refresh to ensure proper state update
      window.location.href = "/";
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Logout failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleProfileClick = () => {
    navigate("/profile");
    onClose();
  };

  const handleOrdersClick = () => {
    navigate("/orders");
    onClose();
  };

  const handleWishlistClick = () => {
    navigate("/wishlist");
    onClose();
  };

  const handleAddressesClick = () => {
    navigate("/addresses");
    onClose();
  };

  const handlePaymentMethodsClick = () => {
    navigate("/payment-methods");
    onClose();
  };

  const handlePaymentHistoryClick = () => {
    navigate("/payment-history");
    onClose();
  };

  const handleSecurityClick = () => {
    navigate("/security");
    onClose();
  };

  const handleNotificationsClick = () => {
    navigate("/notifications");
    onClose();
  };

  const handleHelpClick = () => {
    navigate("/help");
    onClose();
  };

  const handleContactClick = () => {
    navigate("/contact");
    onClose();
  };

  if (!user) return null;

  return (
    <>
      {/* Profile Dropdown Toggle */}
      <div className="nav-item dropdown">
        <button
          className="nav-link dropdown-toggle d-flex align-items-center"
          onClick={onToggle}
          style={{ background: "none", border: "none", color: "inherit" }}
        >
          <div className="d-flex align-items-center">
            <div className="user-avatar me-2">
              {user.profileImage ? (
                <img
                  src={user.profileImage}
                  alt={user.name}
                  className="rounded-circle"
                  width="32"
                  height="32"
                />
              ) : (
                <FaUserCircle size={32} className="text-primary" />
              )}
            </div>
            <div className="d-none d-md-block text-start">
              <div
                className="fw-bold text-truncate"
                style={{ maxWidth: "120px" }}
              >
                {user.name}
              </div>
              <div
                className="small text-muted text-truncate"
                style={{ maxWidth: "120px" }}
              >
                {user.email}
              </div>
            </div>
            <FaChevronDown className="ms-2" size={12} />
          </div>
        </button>

        {/* Dropdown Menu */}
        {isOpen && (
          <div
            className="dropdown-menu dropdown-menu-end show"
            style={{ minWidth: "280px" }}
          >
            {/* User Header */}
            <div className="dropdown-header bg-light">
              <div className="d-flex align-items-center">
                <div className="user-avatar me-3">
                  {user.profileImage ? (
                    <img
                      src={user.profileImage}
                      alt={user.name}
                      className="rounded-circle"
                      width="48"
                      height="48"
                    />
                  ) : (
                    <FaUserCircle size={48} className="text-primary" />
                  )}
                </div>
                <div>
                  <div className="fw-bold">{user.name}</div>
                  <div className="small text-muted">{user.email}</div>
                  {user.role === "ADMIN" && (
                    <span className="badge bg-danger mt-1">
                      <FaCrown className="me-1" />
                      Admin
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="dropdown-divider"></div>

            {/* Main Navigation */}
            <div className="dropdown-section">
              <h6 className="dropdown-header text-muted small">ACCOUNT</h6>

              <button className="dropdown-item" onClick={handleProfileClick}>
                <FaUser className="me-2" />
                Profile Settings
              </button>

              <button className="dropdown-item" onClick={handleOrdersClick}>
                <FaBox className="me-2" />
                My Orders
                <span className="badge bg-primary ms-auto">3</span>
              </button>

              <button className="dropdown-item" onClick={handleWishlistClick}>
                <FaHeart className="me-2" />
                Wishlist
                <span className="badge bg-danger ms-auto">5</span>
              </button>

              <button className="dropdown-item" onClick={handleAddressesClick}>
                <FaAddressBook className="me-2" />
                Addresses
              </button>

              <button
                className="dropdown-item"
                onClick={handlePaymentMethodsClick}
              >
                <FaCreditCard className="me-2" />
                Payment Methods
              </button>

              <button
                className="dropdown-item"
                onClick={handlePaymentHistoryClick}
              >
                <FaHistory className="me-2" />
                Payment History
              </button>
            </div>

            <div className="dropdown-divider"></div>

            {/* Security & Settings */}
            <div className="dropdown-section">
              <h6 className="dropdown-header text-muted small">
                SECURITY & SETTINGS
              </h6>

              <button className="dropdown-item" onClick={handleSecurityClick}>
                <FaShieldAlt className="me-2" />
                Security Settings
              </button>

              <button
                className="dropdown-item"
                onClick={handleNotificationsClick}
              >
                <FaBell className="me-2" />
                Notifications
                <span className="badge bg-warning ms-auto">2</span>
              </button>

              <button className="dropdown-item">
                <FaCog className="me-2" />
                Preferences
              </button>
            </div>

            {/* Admin Section */}
            {user.role === "ADMIN" && (
              <>
                <div className="dropdown-divider"></div>
                <div className="dropdown-section">
                  <h6 className="dropdown-header text-muted small">ADMIN</h6>

                  <Link className="dropdown-item" to="/admin">
                    <FaCrown className="me-2" />
                    Admin Dashboard
                  </Link>

                  <Link className="dropdown-item" to="/admin/products">
                    <FaBox className="me-2" />
                    Manage Products
                  </Link>

                  <Link className="dropdown-item" to="/admin/orders">
                    <FaHistory className="me-2" />
                    Manage Orders
                  </Link>

                  <Link className="dropdown-item" to="/admin/users">
                    <FaUser className="me-2" />
                    Manage Users
                  </Link>
                </div>
              </>
            )}

            <div className="dropdown-divider"></div>

            {/* Support */}
            <div className="dropdown-section">
              <h6 className="dropdown-header text-muted small">SUPPORT</h6>

              <button className="dropdown-item" onClick={handleHelpClick}>
                <FaQuestionCircle className="me-2" />
                Help Center
              </button>

              <button className="dropdown-item" onClick={handleContactClick}>
                <FaHeadset className="me-2" />
                Contact Support
              </button>

              <button className="dropdown-item">
                <FaGift className="me-2" />
                Referral Program
              </button>
            </div>

            <div className="dropdown-divider"></div>

            {/* Logout Section */}
            <div className="dropdown-section">
              <button
                className="dropdown-item text-danger"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleLogout();
                }}
                disabled={loading}
              >
                <FaSignOutAlt className="me-2" />
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default UserProfileDropdown;
