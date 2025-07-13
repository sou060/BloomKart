import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaEdit,
  FaSave,
  FaTimes,
  FaDesktop,
  FaSignOutAlt,
  FaShieldAlt,
  FaHistory,
  FaCog,
} from "react-icons/fa";
import api from "../axios";

const Profile = () => {
  const { user, updateUser, logoutAllSessions } = useContext(AuthContext);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    phoneNumber: user?.phoneNumber || "",
  });
  const [activeSessions, setActiveSessions] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchActiveSessions();
  }, []);

  const fetchActiveSessions = async () => {
    try {
      const response = await api.get("/auth/sessions/count");
      setActiveSessions(response.data.activeSessions);
    } catch (error) {
      console.error("Error fetching active sessions:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const response = await api.put("/auth/profile", formData);
      updateUser(response.data);
      setIsEditing(false);
      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || "",
      phoneNumber: user?.phoneNumber || "",
    });
    setIsEditing(false);
  };

  const handleLogoutAllSessions = async () => {
    try {
      await logoutAllSessions();
      toast.success("All sessions logged out successfully!");
    } catch (error) {
      toast.error("Failed to logout all sessions");
    }
  };

  if (!user) {
    return (
      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-md-8">
            <div className="card">
              <div className="card-body text-center">
                <h5>Please log in to view your profile</h5>
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
                <FaUser className="me-2" />
                User Profile
              </h4>
            </div>
            <div className="card-body">
              {/* Profile Information */}
              <div className="row mb-4">
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label fw-bold">
                      <FaUser className="me-2" />
                      Name
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        className="form-control"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                      />
                    ) : (
                      <p className="form-control-plaintext">{user.name}</p>
                    )}
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label fw-bold">
                      <FaEnvelope className="me-2" />
                      Email
                    </label>
                    <p className="form-control-plaintext">{user.email}</p>
                  </div>
                </div>
              </div>

              <div className="row mb-4">
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label fw-bold">
                      <FaPhone className="me-2" />
                      Phone Number
                    </label>
                    {isEditing ? (
                      <input
                        type="tel"
                        className="form-control"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleInputChange}
                      />
                    ) : (
                      <p className="form-control-plaintext">
                        {user.phoneNumber || "Not provided"}
                      </p>
                    )}
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label fw-bold">
                      <FaShieldAlt className="me-2" />
                      Role
                    </label>
                    <p className="form-control-plaintext">
                      <span
                        className={`badge bg-${
                          user.role === "ADMIN" ? "danger" : "primary"
                        }`}
                      >
                        {user.role}
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Session Information */}
              <div className="row mb-4">
                <div className="col-12">
                  <div className="card bg-light">
                    <div className="card-body">
                      <h6 className="card-title">
                        <FaDesktop className="me-2" />
                        Session Information
                      </h6>
                      <div className="row">
                        <div className="col-md-6">
                          <p className="mb-1">
                            <strong>Active Sessions:</strong> {activeSessions}
                          </p>
                        </div>
                        <div className="col-md-6">
                          <button
                            className="btn btn-outline-danger btn-sm"
                            onClick={handleLogoutAllSessions}
                            disabled={activeSessions === 0}
                          >
                            <FaSignOutAlt className="me-1" />
                            Logout All Sessions
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="d-flex justify-content-end gap-2">
                {isEditing ? (
                  <>
                    <button
                      className="btn btn-success"
                      onClick={handleSave}
                      disabled={loading}
                    >
                      <FaSave className="me-1" />
                      {loading ? "Saving..." : "Save Changes"}
                    </button>
                    <button
                      className="btn btn-secondary"
                      onClick={handleCancel}
                      disabled={loading}
                    >
                      <FaTimes className="me-1" />
                      Cancel
                    </button>
                  </>
                ) : (
                  <button
                    className="btn btn-primary"
                    onClick={() => setIsEditing(true)}
                  >
                    <FaEdit className="me-1" />
                    Edit Profile
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
