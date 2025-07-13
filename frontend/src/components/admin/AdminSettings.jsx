import React, { useState, useEffect } from "react";
import api from "../../axios";
import { toast } from "react-toastify";
import {
  FaCog,
  FaSave,
  FaBell,
  FaShieldAlt,
  FaPalette,
  FaGlobe,
  FaDatabase,
  FaKey,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";

const AdminSettings = () => {
  const [settings, setSettings] = useState({
    siteName: "BloomKart",
    siteDescription: "Your trusted flower delivery service",
    contactEmail: "admin@bloomkart.com",
    contactPhone: "+91 9876543210",
    maintenanceMode: false,
    allowRegistration: true,
    requireEmailVerification: true,
    maxUploadSize: 5,
    currency: "INR",
    timezone: "Asia/Kolkata",
    notifications: {
      newOrder: true,
      lowStock: true,
      userRegistration: false,
      systemAlerts: true,
    },
    security: {
      sessionTimeout: 30,
      maxLoginAttempts: 5,
      requireStrongPassword: true,
      enableTwoFactor: false,
    },
  });
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("general");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      // In a real app, you would fetch settings from the API
      // For now, we'll use the default settings
      console.log("Fetching settings...");
    } catch (error) {
      console.error("Error fetching settings:", error);
      toast.error("Failed to load settings");
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      // In a real app, you would save settings to the API
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call
      toast.success("Settings saved successfully!");
    } catch (error) {
      console.error("Error saving settings:", error);
      toast.error("Failed to save settings");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (section, field, value) => {
    if (section) {
      setSettings((prev) => ({
        ...prev,
        [section]: {
          ...prev[section],
          [field]: value,
        },
      }));
    } else {
      setSettings((prev) => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  const renderGeneralSettings = () => (
    <div className="admin-form">
      <h5 className="mb-4">
        <FaCog className="me-2" />
        General Settings
      </h5>

      <div className="row g-3">
        <div className="col-md-6">
          <label className="form-label">Site Name</label>
          <input
            type="text"
            className="form-control"
            value={settings.siteName}
            onChange={(e) =>
              handleInputChange(null, "siteName", e.target.value)
            }
          />
        </div>

        <div className="col-md-6">
          <label className="form-label">Contact Email</label>
          <input
            type="email"
            className="form-control"
            value={settings.contactEmail}
            onChange={(e) =>
              handleInputChange(null, "contactEmail", e.target.value)
            }
          />
        </div>

        <div className="col-md-6">
          <label className="form-label">Contact Phone</label>
          <input
            type="text"
            className="form-control"
            value={settings.contactPhone}
            onChange={(e) =>
              handleInputChange(null, "contactPhone", e.target.value)
            }
          />
        </div>

        <div className="col-md-6">
          <label className="form-label">Currency</label>
          <select
            className="form-select"
            value={settings.currency}
            onChange={(e) =>
              handleInputChange(null, "currency", e.target.value)
            }
          >
            <option value="INR">Indian Rupee (₹)</option>
            <option value="USD">US Dollar ($)</option>
            <option value="EUR">Euro (€)</option>
            <option value="GBP">British Pound (£)</option>
          </select>
        </div>

        <div className="col-md-6">
          <label className="form-label">Timezone</label>
          <select
            className="form-select"
            value={settings.timezone}
            onChange={(e) =>
              handleInputChange(null, "timezone", e.target.value)
            }
          >
            <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
            <option value="UTC">UTC</option>
            <option value="America/New_York">America/New_York (EST)</option>
            <option value="Europe/London">Europe/London (GMT)</option>
          </select>
        </div>

        <div className="col-md-6">
          <label className="form-label">Max Upload Size (MB)</label>
          <input
            type="number"
            className="form-control"
            value={settings.maxUploadSize}
            onChange={(e) =>
              handleInputChange(null, "maxUploadSize", parseInt(e.target.value))
            }
          />
        </div>

        <div className="col-12">
          <label className="form-label">Site Description</label>
          <textarea
            className="form-control"
            rows="3"
            value={settings.siteDescription}
            onChange={(e) =>
              handleInputChange(null, "siteDescription", e.target.value)
            }
          />
        </div>
      </div>
    </div>
  );

  const renderSecuritySettings = () => (
    <div className="admin-form">
      <h5 className="mb-4">
        <FaShieldAlt className="me-2" />
        Security Settings
      </h5>

      <div className="row g-3">
        <div className="col-md-6">
          <label className="form-label">Session Timeout (minutes)</label>
          <input
            type="number"
            className="form-control"
            value={settings.security.sessionTimeout}
            onChange={(e) =>
              handleInputChange(
                "security",
                "sessionTimeout",
                parseInt(e.target.value)
              )
            }
          />
        </div>

        <div className="col-md-6">
          <label className="form-label">Max Login Attempts</label>
          <input
            type="number"
            className="form-control"
            value={settings.security.maxLoginAttempts}
            onChange={(e) =>
              handleInputChange(
                "security",
                "maxLoginAttempts",
                parseInt(e.target.value)
              )
            }
          />
        </div>

        <div className="col-12">
          <div className="form-check form-switch">
            <input
              className="form-check-input"
              type="checkbox"
              id="requireStrongPassword"
              checked={settings.security.requireStrongPassword}
              onChange={(e) =>
                handleInputChange(
                  "security",
                  "requireStrongPassword",
                  e.target.checked
                )
              }
            />
            <label className="form-check-label" htmlFor="requireStrongPassword">
              Require Strong Passwords
            </label>
          </div>
        </div>

        <div className="col-12">
          <div className="form-check form-switch">
            <input
              className="form-check-input"
              type="checkbox"
              id="enableTwoFactor"
              checked={settings.security.enableTwoFactor}
              onChange={(e) =>
                handleInputChange(
                  "security",
                  "enableTwoFactor",
                  e.target.checked
                )
              }
            />
            <label className="form-check-label" htmlFor="enableTwoFactor">
              Enable Two-Factor Authentication
            </label>
          </div>
        </div>

        <div className="col-12">
          <div className="form-check form-switch">
            <input
              className="form-check-input"
              type="checkbox"
              id="maintenanceMode"
              checked={settings.maintenanceMode}
              onChange={(e) =>
                handleInputChange(null, "maintenanceMode", e.target.checked)
              }
            />
            <label className="form-check-label" htmlFor="maintenanceMode">
              Maintenance Mode
            </label>
          </div>
        </div>

        <div className="col-12">
          <div className="form-check form-switch">
            <input
              className="form-check-input"
              type="checkbox"
              id="allowRegistration"
              checked={settings.allowRegistration}
              onChange={(e) =>
                handleInputChange(null, "allowRegistration", e.target.checked)
              }
            />
            <label className="form-check-label" htmlFor="allowRegistration">
              Allow User Registration
            </label>
          </div>
        </div>

        <div className="col-12">
          <div className="form-check form-switch">
            <input
              className="form-check-input"
              type="checkbox"
              id="requireEmailVerification"
              checked={settings.requireEmailVerification}
              onChange={(e) =>
                handleInputChange(
                  null,
                  "requireEmailVerification",
                  e.target.checked
                )
              }
            />
            <label
              className="form-check-label"
              htmlFor="requireEmailVerification"
            >
              Require Email Verification
            </label>
          </div>
        </div>
      </div>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="admin-form">
      <h5 className="mb-4">
        <FaBell className="me-2" />
        Notification Settings
      </h5>

      <div className="row g-3">
        <div className="col-12">
          <div className="form-check form-switch">
            <input
              className="form-check-input"
              type="checkbox"
              id="newOrder"
              checked={settings.notifications.newOrder}
              onChange={(e) =>
                handleInputChange("notifications", "newOrder", e.target.checked)
              }
            />
            <label className="form-check-label" htmlFor="newOrder">
              New Order Notifications
            </label>
          </div>
        </div>

        <div className="col-12">
          <div className="form-check form-switch">
            <input
              className="form-check-input"
              type="checkbox"
              id="lowStock"
              checked={settings.notifications.lowStock}
              onChange={(e) =>
                handleInputChange("notifications", "lowStock", e.target.checked)
              }
            />
            <label className="form-check-label" htmlFor="lowStock">
              Low Stock Alerts
            </label>
          </div>
        </div>

        <div className="col-12">
          <div className="form-check form-switch">
            <input
              className="form-check-input"
              type="checkbox"
              id="userRegistration"
              checked={settings.notifications.userRegistration}
              onChange={(e) =>
                handleInputChange(
                  "notifications",
                  "userRegistration",
                  e.target.checked
                )
              }
            />
            <label className="form-check-label" htmlFor="userRegistration">
              User Registration Notifications
            </label>
          </div>
        </div>

        <div className="col-12">
          <div className="form-check form-switch">
            <input
              className="form-check-input"
              type="checkbox"
              id="systemAlerts"
              checked={settings.notifications.systemAlerts}
              onChange={(e) =>
                handleInputChange(
                  "notifications",
                  "systemAlerts",
                  e.target.checked
                )
              }
            />
            <label className="form-check-label" htmlFor="systemAlerts">
              System Alerts
            </label>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case "general":
        return renderGeneralSettings();
      case "security":
        return renderSecuritySettings();
      case "notifications":
        return renderNotificationSettings();
      default:
        return renderGeneralSettings();
    }
  };

  return (
    <div className="fade-in">
      {/* Header */}
      <div className="row align-items-center mb-4">
        <div className="col-md-8">
          <h1 className="text-gradient fw-bold mb-2">System Settings</h1>
          <p className="text-muted mb-0">
            Configure your application settings and preferences
          </p>
        </div>
        <div className="col-md-4 text-md-end">
          <button
            className="btn btn-primary"
            onClick={handleSave}
            disabled={loading}
          >
            <FaSave className="me-2" />
            {loading ? "Saving..." : "Save Settings"}
          </button>
        </div>
      </div>

      {/* Settings Tabs */}
      <div className="row">
        <div className="col-md-3">
          <div className="card border-radius-custom shadow-custom">
            <div className="card-body">
              <div className="nav flex-column nav-pills">
                <button
                  className={`nav-link text-start mb-2 ${
                    activeTab === "general" ? "active" : ""
                  }`}
                  onClick={() => setActiveTab("general")}
                >
                  <FaCog className="me-2" />
                  General
                </button>
                <button
                  className={`nav-link text-start mb-2 ${
                    activeTab === "security" ? "active" : ""
                  }`}
                  onClick={() => setActiveTab("security")}
                >
                  <FaShieldAlt className="me-2" />
                  Security
                </button>
                <button
                  className={`nav-link text-start mb-2 ${
                    activeTab === "notifications" ? "active" : ""
                  }`}
                  onClick={() => setActiveTab("notifications")}
                >
                  <FaBell className="me-2" />
                  Notifications
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-9">{renderTabContent()}</div>
      </div>
    </div>
  );
};

export default AdminSettings;
