import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaCalendar,
  FaEdit,
  FaSave,
  FaTimes,
  FaCamera,
  FaShieldAlt,
  FaBell,
  FaCog,
  FaCreditCard,
  FaAddressBook,
  FaBox,
  FaHeart,
  FaHistory,
  FaCrown,
  FaUserCircle,
} from "react-icons/fa";

const Profile = () => {
  const { user, updateUser } = useContext(AuthContext);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    address: user?.address || "",
    dateOfBirth: user?.dateOfBirth || "",
  });
  const [activeTab, setActiveTab] = useState("profile");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    try {
      // Here you would typically make an API call to update the user
      await updateUser(formData);
      setIsEditing(false);
      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error("Failed to update profile. Please try again.");
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || "",
      email: user?.email || "",
      phone: user?.phone || "",
      address: user?.address || "",
      dateOfBirth: user?.dateOfBirth || "",
    });
    setIsEditing(false);
  };

  const tabs = [
    { id: "profile", label: "Profile", icon: FaUser },
    { id: "orders", label: "Orders", icon: FaBox },
    { id: "wishlist", label: "Wishlist", icon: FaHeart },
    { id: "addresses", label: "Addresses", icon: FaAddressBook },
    { id: "payments", label: "Payment Methods", icon: FaCreditCard },
    { id: "security", label: "Security", icon: FaShieldAlt },
    { id: "notifications", label: "Notifications", icon: FaBell },
    { id: "preferences", label: "Preferences", icon: FaCog },
  ];

  if (user?.role === "ADMIN") {
    tabs.push({ id: "admin", label: "Admin Panel", icon: FaCrown });
  }

  const renderProfileTab = () => (
    <div className="row">
      <div className="col-md-4">
        <div className="card">
          <div className="card-body text-center">
            <div className="position-relative mb-3">
              {user?.profileImage ? (
                <img
                  src={user.profileImage}
                  alt={user.name}
                  className="rounded-circle"
                  width="120"
                  height="120"
                  style={{ objectFit: "cover" }}
                />
              ) : (
                <FaUserCircle size={120} className="text-primary" />
              )}
              <button className="btn btn-sm btn-primary position-absolute bottom-0 end-0">
                <FaCamera />
              </button>
            </div>
            <h5 className="card-title">{user?.name}</h5>
            <p className="text-muted">{user?.email}</p>
            {user?.role === "ADMIN" && (
              <span className="badge bg-danger">
                <FaCrown className="me-1" />
                Admin
              </span>
            )}
          </div>
        </div>
      </div>
      <div className="col-md-8">
        <div className="card">
          <div className="card-header d-flex justify-content-between align-items-center">
            <h5 className="mb-0">Personal Information</h5>
            {!isEditing ? (
              <button
                className="btn btn-outline-primary btn-sm"
                onClick={() => setIsEditing(true)}
              >
                <FaEdit className="me-1" />
                Edit
              </button>
            ) : (
              <div>
                <button
                  className="btn btn-success btn-sm me-2"
                  onClick={handleSave}
                >
                  <FaSave className="me-1" />
                  Save
                </button>
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={handleCancel}
                >
                  <FaTimes className="me-1" />
                  Cancel
                </button>
              </div>
            )}
          </div>
          <div className="card-body">
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">
                  <FaUser className="me-1" />
                  Full Name
                </label>
                <input
                  type="text"
                  className="form-control"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">
                  <FaEnvelope className="me-1" />
                  Email
                </label>
                <input
                  type="email"
                  className="form-control"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">
                  <FaPhone className="me-1" />
                  Phone Number
                </label>
                <input
                  type="tel"
                  className="form-control"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">
                  <FaCalendar className="me-1" />
                  Date of Birth
                </label>
                <input
                  type="date"
                  className="form-control"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
              </div>
              <div className="col-12 mb-3">
                <label className="form-label">
                  <FaMapMarkerAlt className="me-1" />
                  Address
                </label>
                <textarea
                  className="form-control"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  rows="3"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderOrdersTab = () => (
    <div className="card">
      <div className="card-header">
        <h5 className="mb-0">
          <FaBox className="me-2" />
          My Orders
        </h5>
      </div>
      <div className="card-body">
        <div className="text-center py-5">
          <FaHistory size={64} className="text-muted mb-3" />
          <h5>No Orders Yet</h5>
          <p className="text-muted">
            Start shopping to see your order history here.
          </p>
          <button className="btn btn-primary">Browse Products</button>
        </div>
      </div>
    </div>
  );

  const renderWishlistTab = () => (
    <div className="card">
      <div className="card-header">
        <h5 className="mb-0">
          <FaHeart className="me-2" />
          My Wishlist
        </h5>
      </div>
      <div className="card-body">
        <div className="text-center py-5">
          <FaHeart size={64} className="text-muted mb-3" />
          <h5>Your Wishlist is Empty</h5>
          <p className="text-muted">
            Save your favorite flowers to your wishlist.
          </p>
          <button className="btn btn-primary">Browse Products</button>
        </div>
      </div>
    </div>
  );

  const renderAddressesTab = () => (
    <div className="card">
      <div className="card-header d-flex justify-content-between align-items-center">
        <h5 className="mb-0">
          <FaAddressBook className="me-2" />
          Saved Addresses
        </h5>
        <Link to="/addresses" className="btn btn-primary btn-sm">
          Manage Addresses
        </Link>
      </div>
      <div className="card-body">
        <div className="text-center py-5">
          <FaAddressBook size={64} className="text-muted mb-3" />
          <h5>Address Management</h5>
          <p className="text-muted">
            Manage your delivery addresses for faster checkout.
          </p>
          <Link to="/addresses" className="btn btn-primary">
            <FaAddressBook className="me-1" />
            Go to Addresses
          </Link>
        </div>
      </div>
    </div>
  );

  const renderPaymentsTab = () => (
    <div className="card">
      <div className="card-header d-flex justify-content-between align-items-center">
        <h5 className="mb-0">
          <FaCreditCard className="me-2" />
          Payment Methods
        </h5>
        <button className="btn btn-primary btn-sm">Add Payment Method</button>
      </div>
      <div className="card-body">
        <div className="text-center py-5">
          <FaCreditCard size={64} className="text-muted mb-3" />
          <h5>No Payment Methods</h5>
          <p className="text-muted">Add payment methods for faster checkout.</p>
          <button className="btn btn-primary">Add Payment Method</button>
        </div>
      </div>
    </div>
  );

  const renderSecurityTab = () => (
    <div className="card">
      <div className="card-header">
        <h5 className="mb-0">
          <FaShieldAlt className="me-2" />
          Security Settings
        </h5>
      </div>
      <div className="card-body">
        <div className="row">
          <div className="col-md-6 mb-3">
            <div className="card">
              <div className="card-body">
                <h6>Change Password</h6>
                <p className="text-muted small">Update your account password</p>
                <button className="btn btn-outline-primary btn-sm">
                  Change Password
                </button>
              </div>
            </div>
          </div>
          <div className="col-md-6 mb-3">
            <div className="card">
              <div className="card-body">
                <h6>Two-Factor Authentication</h6>
                <p className="text-muted small">
                  Add an extra layer of security
                </p>
                <button className="btn btn-outline-primary btn-sm">
                  Enable 2FA
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderNotificationsTab = () => (
    <div className="card">
      <div className="card-header">
        <h5 className="mb-0">
          <FaBell className="me-2" />
          Notification Preferences
        </h5>
      </div>
      <div className="card-body">
        <div className="mb-3">
          <div className="form-check form-switch">
            <input
              className="form-check-input"
              type="checkbox"
              id="emailNotif"
              defaultChecked
            />
            <label className="form-check-label" htmlFor="emailNotif">
              Email Notifications
            </label>
          </div>
        </div>
        <div className="mb-3">
          <div className="form-check form-switch">
            <input className="form-check-input" type="checkbox" id="smsNotif" />
            <label className="form-check-label" htmlFor="smsNotif">
              SMS Notifications
            </label>
          </div>
        </div>
        <div className="mb-3">
          <div className="form-check form-switch">
            <input
              className="form-check-input"
              type="checkbox"
              id="pushNotif"
              defaultChecked
            />
            <label className="form-check-label" htmlFor="pushNotif">
              Push Notifications
            </label>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPreferencesTab = () => (
    <div className="card">
      <div className="card-header">
        <h5 className="mb-0">
          <FaCog className="me-2" />
          Account Preferences
        </h5>
      </div>
      <div className="card-body">
        <div className="mb-3">
          <label className="form-label">Language</label>
          <select className="form-select">
            <option>English</option>
            <option>Spanish</option>
            <option>French</option>
          </select>
        </div>
        <div className="mb-3">
          <label className="form-label">Currency</label>
          <select className="form-select">
            <option>USD ($)</option>
            <option>EUR (€)</option>
            <option>GBP (£)</option>
          </select>
        </div>
        <div className="mb-3">
          <div className="form-check form-switch">
            <input className="form-check-input" type="checkbox" id="darkMode" />
            <label className="form-check-label" htmlFor="darkMode">
              Dark Mode
            </label>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAdminTab = () => (
    <div className="card">
      <div className="card-header">
        <h5 className="mb-0">
          <FaCrown className="me-2" />
          Admin Panel
        </h5>
      </div>
      <div className="card-body">
        <div className="row">
          <div className="col-md-4 mb-3">
            <div className="card">
              <div className="card-body text-center">
                <FaBox size={48} className="text-primary mb-3" />
                <h6>Manage Products</h6>
                <button className="btn btn-primary btn-sm">
                  Go to Products
                </button>
              </div>
            </div>
          </div>
          <div className="col-md-4 mb-3">
            <div className="card">
              <div className="card-body text-center">
                <FaHistory size={48} className="text-success mb-3" />
                <h6>Manage Orders</h6>
                <button className="btn btn-success btn-sm">Go to Orders</button>
              </div>
            </div>
          </div>
          <div className="col-md-4 mb-3">
            <div className="card">
              <div className="card-body text-center">
                <FaUser size={48} className="text-info mb-3" />
                <h6>Manage Users</h6>
                <button className="btn btn-info btn-sm">Go to Users</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case "profile":
        return renderProfileTab();
      case "orders":
        return renderOrdersTab();
      case "wishlist":
        return renderWishlistTab();
      case "addresses":
        return renderAddressesTab();
      case "payments":
        return renderPaymentsTab();
      case "security":
        return renderSecurityTab();
      case "notifications":
        return renderNotificationsTab();
      case "preferences":
        return renderPreferencesTab();
      case "admin":
        return renderAdminTab();
      default:
        return renderProfileTab();
    }
  };

  if (!user) {
    return (
      <div className="container mt-5">
        <div className="text-center">
          <h3>Please log in to view your profile</h3>
          <button className="btn btn-primary">Login</button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="row">
        {/* Sidebar */}
        <div className="col-md-3">
          <div className="card">
            <div className="card-body">
              <h6 className="card-title mb-3">Account Settings</h6>
              <div className="nav flex-column nav-pills">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      className={`nav-link text-start mb-2 ${
                        activeTab === tab.id ? "active" : ""
                      }`}
                      onClick={() => setActiveTab(tab.id)}
                    >
                      <Icon className="me-2" />
                      {tab.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="col-md-9">{renderTabContent()}</div>
      </div>
    </div>
  );
};

export default Profile;
 