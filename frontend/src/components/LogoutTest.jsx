import React, { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { CartContext } from "../context/CartContext";
import { toast } from "react-toastify";
import {
  FaSignOutAlt,
  FaDesktop,
  FaMobile,
  FaExclamationTriangle,
  FaShieldAlt,
  FaUser,
  FaCog,
} from "react-icons/fa";

const LogoutTest = () => {
  const { user, logout, logoutAllSessions } = useContext(AuthContext);
  const { cart, clearCart } = useContext(CartContext);
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    try {
      await logout();
      clearCart();
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
      toast.success("All sessions logged out successfully!");
    } catch (error) {
      toast.error("Failed to logout all sessions.");
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-md-8">
            <div className="card">
              <div className="card-body text-center">
                <h5>Please log in to test logout functionality</h5>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card shadow">
            <div className="card-header bg-primary text-white">
              <h4 className="mb-0">
                <FaSignOutAlt className="me-2" />
                Logout Functionality Test
              </h4>
            </div>
            <div className="card-body">
              {/* User Info */}
              <div className="row mb-4">
                <div className="col-12">
                  <div className="alert alert-info">
                    <FaUser className="me-2" />
                    <strong>Current User:</strong> {user.name} ({user.email})
                  </div>
                </div>
              </div>

              {/* Cart Info */}
              <div className="row mb-4">
                <div className="col-12">
                  <div className="alert alert-warning">
                    <FaCog className="me-2" />
                    <strong>Cart Items:</strong> {cart.length} items
                  </div>
                </div>
              </div>

              {/* Logout Options */}
              <div className="row">
                <div className="col-md-6 mb-3">
                  <div className="card h-100 border-primary">
                    <div className="card-body text-center">
                      <FaMobile className="text-primary mb-3" size={48} />
                      <h6 className="card-title">Logout This Device</h6>
                      <p className="card-text small">
                        Logout from this browser/device only. Other sessions
                        will remain active.
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

              {/* Security Note */}
              <div className="alert alert-info mt-3">
                <FaShieldAlt className="me-2" />
                <strong>Security Note:</strong> Logging out will clear your
                session and cart data. Choose "Logout All Sessions" if you're on
                a shared or public device.
              </div>

              {/* Features List */}
              <div className="mt-4">
                <h6>Enhanced Logout Features:</h6>
                <ul className="list-group list-group-flush">
                  <li className="list-group-item">
                    <strong>Token Blacklisting:</strong> Invalidated tokens are
                    stored in database
                  </li>
                  <li className="list-group-item">
                    <strong>Session Management:</strong> Track and manage active
                    sessions
                  </li>
                  <li className="list-group-item">
                    <strong>Cart Clearing:</strong> Automatic cart cleanup on
                    logout
                  </li>
                  <li className="list-group-item">
                    <strong>Security Validation:</strong> JWT token validation
                    and blacklist checking
                  </li>
                  <li className="list-group-item">
                    <strong>User Feedback:</strong> Success/error notifications
                  </li>
                  <li className="list-group-item">
                    <strong>Multiple Options:</strong> Device-specific vs all
                    sessions logout
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogoutTest;
