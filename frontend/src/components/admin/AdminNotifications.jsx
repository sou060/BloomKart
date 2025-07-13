import React, { useState, useEffect } from "react";
import api from "../../axios";
import { toast } from "react-toastify";
import {
  FaBell,
  FaCheck,
  FaTimes,
  FaTrash,
  FaEye,
  FaEyeSlash,
  FaCog,
  FaFilter,
  FaSearch,
  FaExclamationTriangle,
  FaInfoCircle,
  FaCheckCircle,
  FaClock,
  FaUser,
  FaBox,
  FaMoneyBillWave,
  FaShieldAlt,
} from "react-icons/fa";

const AdminNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    type: "",
    status: "",
    priority: "",
    search: "",
  });
  const [selectedNotifications, setSelectedNotifications] = useState([]);
  const [showSettings, setShowSettings] = useState(false);
  const [notificationSettings, setNotificationSettings] = useState({
    email: true,
    push: true,
    sms: false,
    newOrders: true,
    lowStock: true,
    userRegistration: false,
    systemAlerts: true,
    paymentIssues: true,
  });

  useEffect(() => {
    fetchNotifications();
  }, [filters]);

  const fetchNotifications = async () => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const mockNotifications = [
        {
          id: 1,
          title: "New Order Received",
          message: "Order #1234 has been placed by John Doe for ₹2,400",
          type: "order",
          priority: "high",
          status: "unread",
          timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
          icon: FaBox,
          color: "primary",
        },
        {
          id: 2,
          title: "Low Stock Alert",
          message: "Red Roses stock is running low (45 units remaining)",
          type: "inventory",
          priority: "medium",
          status: "unread",
          timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
          icon: FaExclamationTriangle,
          color: "warning",
        },
        {
          id: 3,
          title: "Payment Failed",
          message: "Payment for Order #1230 failed. Please review.",
          type: "payment",
          priority: "high",
          status: "read",
          timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
          icon: FaMoneyBillWave,
          color: "danger",
        },
        {
          id: 4,
          title: "New User Registration",
          message: "New user Sarah Wilson has registered",
          type: "user",
          priority: "low",
          status: "unread",
          timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
          icon: FaUser,
          color: "info",
        },
        {
          id: 5,
          title: "System Maintenance",
          message: "Scheduled maintenance will begin in 2 hours",
          type: "system",
          priority: "medium",
          status: "read",
          timestamp: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
          icon: FaShieldAlt,
          color: "secondary",
        },
        {
          id: 6,
          title: "High Revenue Day",
          message: "Today's revenue exceeded ₹50,000!",
          type: "analytics",
          priority: "low",
          status: "read",
          timestamp: new Date(Date.now() - 90 * 60 * 1000).toISOString(),
          icon: FaCheckCircle,
          color: "success",
        },
      ];

      setNotifications(mockNotifications);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      toast.error("Failed to load notifications");
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      setNotifications((prev) =>
        prev.map((notification) =>
          notification.id === notificationId
            ? { ...notification, status: "read" }
            : notification
        )
      );
      toast.success("Notification marked as read");
    } catch (error) {
      console.error("Error marking notification as read:", error);
      toast.error("Failed to mark notification as read");
    }
  };

  const markAllAsRead = async () => {
    try {
      setNotifications((prev) =>
        prev.map((notification) => ({ ...notification, status: "read" }))
      );
      toast.success("All notifications marked as read");
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
      toast.error("Failed to mark notifications as read");
    }
  };

  const deleteNotification = async (notificationId) => {
    try {
      setNotifications((prev) =>
        prev.filter((notification) => notification.id !== notificationId)
      );
      toast.success("Notification deleted");
    } catch (error) {
      console.error("Error deleting notification:", error);
      toast.error("Failed to delete notification");
    }
  };

  const deleteSelected = async () => {
    if (selectedNotifications.length === 0) {
      toast.warning("Please select notifications to delete");
      return;
    }

    try {
      setNotifications((prev) =>
        prev.filter(
          (notification) => !selectedNotifications.includes(notification.id)
        )
      );
      setSelectedNotifications([]);
      toast.success("Selected notifications deleted");
    } catch (error) {
      console.error("Error deleting selected notifications:", error);
      toast.error("Failed to delete notifications");
    }
  };

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedNotifications(filteredNotifications.map((n) => n.id));
    } else {
      setSelectedNotifications([]);
    }
  };

  const handleSelectNotification = (notificationId, checked) => {
    if (checked) {
      setSelectedNotifications((prev) => [...prev, notificationId]);
    } else {
      setSelectedNotifications((prev) =>
        prev.filter((id) => id !== notificationId)
      );
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "danger";
      case "medium":
        return "warning";
      case "low":
        return "info";
      default:
        return "secondary";
    }
  };

  const getTimeAgo = (timestamp) => {
    const now = new Date();
    const notificationTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now - notificationTime) / (1000 * 60));

    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  const filteredNotifications = notifications.filter((notification) => {
    if (filters.type && notification.type !== filters.type) return false;
    if (filters.status && notification.status !== filters.status) return false;
    if (filters.priority && notification.priority !== filters.priority)
      return false;
    if (
      filters.search &&
      !notification.title.toLowerCase().includes(filters.search.toLowerCase())
    )
      return false;
    return true;
  });

  const unreadCount = notifications.filter((n) => n.status === "unread").length;

  return (
    <div className="fade-in">
      {/* Header */}
      <div className="row align-items-center mb-4">
        <div className="col-md-8">
          <h1 className="text-gradient fw-bold mb-2">Notifications</h1>
          <p className="text-muted mb-0">
            Manage system notifications and alerts
            {unreadCount > 0 && (
              <span className="badge bg-danger ms-2">{unreadCount} unread</span>
            )}
          </p>
        </div>
        <div className="col-md-4 text-md-end">
          <div className="d-flex gap-2 justify-content-md-end">
            <button
              className="btn btn-outline-primary btn-sm"
              onClick={() => setShowSettings(!showSettings)}
            >
              <FaCog className="me-1" />
              Settings
            </button>
            <button
              className="btn btn-success btn-sm"
              onClick={markAllAsRead}
              disabled={unreadCount === 0}
            >
              <FaCheck className="me-1" />
              Mark All Read
            </button>
          </div>
        </div>
      </div>

      {/* Notification Settings */}
      {showSettings && (
        <div className="card border-radius-custom shadow-custom mb-4">
          <div className="card-header bg-gradient-primary text-white">
            <h5 className="mb-0">
              <FaCog className="me-2" />
              Notification Settings
            </h5>
          </div>
          <div className="card-body">
            <div className="row g-3">
              <div className="col-md-6">
                <h6>Notification Channels</h6>
                <div className="form-check form-switch">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="emailNotifications"
                    checked={notificationSettings.email}
                    onChange={(e) =>
                      setNotificationSettings((prev) => ({
                        ...prev,
                        email: e.target.checked,
                      }))
                    }
                  />
                  <label
                    className="form-check-label"
                    htmlFor="emailNotifications"
                  >
                    Email Notifications
                  </label>
                </div>
                <div className="form-check form-switch">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="pushNotifications"
                    checked={notificationSettings.push}
                    onChange={(e) =>
                      setNotificationSettings((prev) => ({
                        ...prev,
                        push: e.target.checked,
                      }))
                    }
                  />
                  <label
                    className="form-check-label"
                    htmlFor="pushNotifications"
                  >
                    Push Notifications
                  </label>
                </div>
                <div className="form-check form-switch">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="smsNotifications"
                    checked={notificationSettings.sms}
                    onChange={(e) =>
                      setNotificationSettings((prev) => ({
                        ...prev,
                        sms: e.target.checked,
                      }))
                    }
                  />
                  <label
                    className="form-check-label"
                    htmlFor="smsNotifications"
                  >
                    SMS Notifications
                  </label>
                </div>
              </div>
              <div className="col-md-6">
                <h6>Notification Types</h6>
                <div className="form-check form-switch">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="newOrders"
                    checked={notificationSettings.newOrders}
                    onChange={(e) =>
                      setNotificationSettings((prev) => ({
                        ...prev,
                        newOrders: e.target.checked,
                      }))
                    }
                  />
                  <label className="form-check-label" htmlFor="newOrders">
                    New Orders
                  </label>
                </div>
                <div className="form-check form-switch">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="lowStock"
                    checked={notificationSettings.lowStock}
                    onChange={(e) =>
                      setNotificationSettings((prev) => ({
                        ...prev,
                        lowStock: e.target.checked,
                      }))
                    }
                  />
                  <label className="form-check-label" htmlFor="lowStock">
                    Low Stock Alerts
                  </label>
                </div>
                <div className="form-check form-switch">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="paymentIssues"
                    checked={notificationSettings.paymentIssues}
                    onChange={(e) =>
                      setNotificationSettings((prev) => ({
                        ...prev,
                        paymentIssues: e.target.checked,
                      }))
                    }
                  />
                  <label className="form-check-label" htmlFor="paymentIssues">
                    Payment Issues
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="card border-radius-custom shadow-custom mb-4">
        <div className="card-header bg-light">
          <h6 className="mb-0">
            <FaFilter className="me-2" />
            Filters
          </h6>
        </div>
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-3">
              <div className="input-group">
                <span className="input-group-text">
                  <FaSearch />
                </span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search notifications..."
                  value={filters.search}
                  onChange={(e) =>
                    setFilters((prev) => ({ ...prev, search: e.target.value }))
                  }
                />
              </div>
            </div>
            <div className="col-md-2">
              <select
                className="form-select"
                value={filters.type}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, type: e.target.value }))
                }
              >
                <option value="">All Types</option>
                <option value="order">Orders</option>
                <option value="inventory">Inventory</option>
                <option value="payment">Payment</option>
                <option value="user">Users</option>
                <option value="system">System</option>
                <option value="analytics">Analytics</option>
              </select>
            </div>
            <div className="col-md-2">
              <select
                className="form-select"
                value={filters.status}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, status: e.target.value }))
                }
              >
                <option value="">All Status</option>
                <option value="unread">Unread</option>
                <option value="read">Read</option>
              </select>
            </div>
            <div className="col-md-2">
              <select
                className="form-select"
                value={filters.priority}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, priority: e.target.value }))
                }
              >
                <option value="">All Priorities</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
            <div className="col-md-3">
              <div className="d-flex gap-2">
                <button
                  className="btn btn-outline-danger btn-sm"
                  onClick={deleteSelected}
                  disabled={selectedNotifications.length === 0}
                >
                  <FaTrash className="me-1" />
                  Delete Selected
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Notifications List */}
      <div className="card border-radius-custom shadow-custom">
        <div className="card-header bg-gradient-primary text-white d-flex justify-content-between align-items-center">
          <h5 className="mb-0">
            <FaBell className="me-2" />
            Notifications ({filteredNotifications.length})
          </h5>
          <div className="form-check">
            <input
              className="form-check-input"
              type="checkbox"
              onChange={(e) => handleSelectAll(e.target.checked)}
              checked={
                selectedNotifications.length === filteredNotifications.length &&
                filteredNotifications.length > 0
              }
            />
            <label className="form-check-label text-white">Select All</label>
          </div>
        </div>
        <div className="card-body p-0">
          {loading ? (
            <div className="loading-spinner">
              <div className="spinner"></div>
            </div>
          ) : filteredNotifications.length === 0 ? (
            <div className="text-center py-5">
              <FaBell size={48} className="text-muted mb-3" />
              <h5 className="text-muted">No notifications found</h5>
              <p className="text-muted">You're all caught up!</p>
            </div>
          ) : (
            <div className="list-group list-group-flush">
              {filteredNotifications.map((notification) => {
                const Icon = notification.icon;
                return (
                  <div
                    key={notification.id}
                    className={`list-group-item list-group-item-action ${
                      notification.status === "unread" ? "bg-light" : ""
                    }`}
                  >
                    <div className="row align-items-center">
                      <div className="col-auto">
                        <input
                          type="checkbox"
                          className="form-check-input"
                          checked={selectedNotifications.includes(
                            notification.id
                          )}
                          onChange={(e) =>
                            handleSelectNotification(
                              notification.id,
                              e.target.checked
                            )
                          }
                        />
                      </div>
                      <div className="col-auto">
                        <div
                          className={`bg-${notification.color} text-white rounded-circle p-2`}
                        >
                          <Icon size={16} />
                        </div>
                      </div>
                      <div className="col">
                        <div className="d-flex justify-content-between align-items-start">
                          <div>
                            <h6 className="mb-1">
                              {notification.title}
                              {notification.status === "unread" && (
                                <span className="badge bg-primary ms-2">
                                  New
                                </span>
                              )}
                              <span
                                className={`badge bg-${getPriorityColor(
                                  notification.priority
                                )} ms-2`}
                              >
                                {notification.priority.toUpperCase()}
                              </span>
                            </h6>
                            <p className="mb-1 text-muted">
                              {notification.message}
                            </p>
                            <small className="text-muted">
                              <FaClock className="me-1" />
                              {getTimeAgo(notification.timestamp)}
                            </small>
                          </div>
                          <div className="btn-group btn-group-sm">
                            {notification.status === "unread" && (
                              <button
                                className="btn btn-outline-success"
                                onClick={() => markAsRead(notification.id)}
                                title="Mark as read"
                              >
                                <FaEye />
                              </button>
                            )}
                            <button
                              className="btn btn-outline-danger"
                              onClick={() =>
                                deleteNotification(notification.id)
                              }
                              title="Delete"
                            >
                              <FaTrash />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminNotifications;
