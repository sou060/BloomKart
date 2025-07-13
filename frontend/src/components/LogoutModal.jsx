import React, { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { CartContext } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  FaSignOutAlt,
  FaDesktop,
  FaMobile,
  FaExclamationTriangle,
  FaTimes,
  FaShieldAlt,
} from "react-icons/fa";

const LogoutModal = ({ isOpen, onClose }) => {
  const { logout, logoutAllSessions } = useContext(AuthContext);
  const { clearCart } = useContext(CartContext);
  const navigate = useNavigate();
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

  if (!isOpen) return null;

  return (
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
              onClick={onClose}
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
                      Logout from this browser/device only. Other sessions will
                      remain active.
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
              <strong>Security Note:</strong> Logging out will clear your
              session and cart data. Choose "Logout All Sessions" if you're on a
              shared or public device.
            </div>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
      <div className="modal-backdrop fade show"></div>
    </div>
  );
};

export default LogoutModal;
