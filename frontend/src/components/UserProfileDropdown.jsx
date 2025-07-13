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
  FaDesktop,
  FaMobile,
  FaExclamationTriangle,
  FaTimes,
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
  const { logout, logoutAllSessions } = useContext(AuthContext);
  const { cart, clearCart } = useContext(CartContext);
  const navigate = useNavigate();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    try {
      await logout();
      clearCart();
      navigate("/");
      onClose();
      toast.success("Logged out successfully!");
    } catch (error) {
      toast.error("Logout failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogoutAllSessions = async () => {
    setLoading(true);
    try {
      await logoutAllSessions();
      clearCart();
      navigate("/");
      onClose();
      toast.success("All sessions logged out successfully!");
    } catch (error) {
      toast.error("Failed to logout all sessions.");
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
          style={{ background: 'none', border: 'none', color: 'inherit' }}
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
              <div className="fw-bold text-truncate" style={{ maxWidth: '120px' }}>
                {user.name}
              </div>
              <div className="small text-muted text-truncate" style={{ maxWidth: '120px' }}>
                {user.email}
              </div>
            </div>
            <FaChevronDown className="ms-2" size={12} />
          </div>
        </button>

        {/* Dropdown Menu */}
        {isOpen && (
          <div className="dropdown-menu dropdown-menu-end show" style={{ minWidth: '280px' }}>
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
              
              <button className="dropdown-item" onClick={handlePaymentMethodsClick}>
                <FaCreditCard className="me-2" />
                Payment Methods
              </button>
            </div>

            <div className="dropdown-divider"></div>

            {/* Security & Settings */}
            <div className="dropdown-section">
              <h6 className="dropdown-header text-muted small">SECURITY & SETTINGS</h6>
              
              <button className="dropdown-item" onClick={handleSecurityClick}>
                <FaShieldAlt className="me-2" />
                Security Settings
              </button>
              
              <button className="dropdown-item" onClick={handleNotificationsClick}>
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
                onClick={() => setShowLogoutModal(true)}
                disabled={loading}
              >
                <FaSignOutAlt className="me-2" />
                {loading ? "Logging out..." : "Logout"}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Logout Modal */}
      {showLogoutModal && (
        <div className="modal fade show" style={{ display: "block" }} tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  <FaSignOutAlt className="me-2" />
                  Logout Options
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowLogoutModal(false)}
                  disabled={loading}
                >
                  <FaTimes />
                </button>
              </div>
              <div className="modal-body">
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <div className="card h-100">
                      <div className="card-body text-center">
                        <FaMobile className="text-primary mb-3" size={48} />
                        <h6 className="card-title">Logout This Device</h6>
                        <p className="card-text small">
                          Logout from this browser/device only. Other sessions will remain active.
                        </p>
                        <button
                          className="btn btn-outline-primary w-100"
                          onClick={handleLogout}
                          disabled={loading}
                        >
                          {loading ? "Logging out..." : "Logout This Device"}
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6 mb-3">
                    <div className="card h-100 border-warning">
                      <div className="card-body text-center">
                        <FaDesktop className="text-warning mb-3" size={48} />
                        <h6 className="card-title">Logout All Sessions</h6>
                        <p className="card-text small">
                          <FaExclamationTriangle className="text-warning me-1" />
                          This will logout from all devices and browsers.
                        </p>
                        <button
                          className="btn btn-outline-warning w-100"
                          onClick={handleLogoutAllSessions}
                          disabled={loading}
                        >
                          {loading ? "Logging out..." : "Logout All Sessions"}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="alert alert-info mt-3">
                  <FaShieldAlt className="me-2" />
                  <strong>Security Note:</strong> Logging out will clear your session and cart data.
                  Choose "Logout All Sessions" if you're on a shared or public device.
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowLogoutModal(false)}
                  disabled={loading}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
          <div className="modal-backdrop fade show"></div>
        </div>
      )}
    </>
  );
};

export default UserProfileDropdown; 