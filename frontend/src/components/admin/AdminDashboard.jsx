import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../axios";
import {
  FaUsers,
  FaShoppingBag,
  FaBox,
  FaMoneyBillWave,
  FaPlus,
  FaEdit,
  FaEye,
  FaChartLine,
  FaTruck,
  FaCheckCircle,
  FaClock,
  FaExclamationTriangle,
  FaBell,
  FaCog,
  FaDatabase,
  FaServer,
  FaGlobe,
  FaStar,
  FaHeart,
  FaCalendarAlt,
  FaArrowUp,
  FaArrowDown,
  FaPercent,
  FaShoppingCart,
  FaUserPlus,
  FaFileAlt,
  FaChartBar,
  FaMapMarkerAlt,
} from "react-icons/fa";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [systemStatus, setSystemStatus] = useState({
    backend: "online",
    database: "online",
    uptime: "99.9%",
  });
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
    // Simulate real-time updates
    const interval = setInterval(fetchDashboardData, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchDashboardData = async () => {
    try {
      console.log("Fetching dashboard data...");
      const [statsRes, ordersRes, productsRes] = await Promise.all([
        api.get("/admin/dashboard/stats"),
        api.get("/admin/orders?page=0&size=5"),
        api.get("/admin/products?page=0&size=5"),
      ]);

      setStats(statsRes.data);
      setRecentOrders(ordersRes.data.content);
      setTopProducts(productsRes.data.content);

      // Generate mock notifications
      generateNotifications();
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const generateNotifications = () => {
    const mockNotifications = [
      {
        id: 1,
        type: "order",
        message: "New order #1234 received",
        time: "2 minutes ago",
        priority: "high",
      },
      {
        id: 2,
        type: "stock",
        message: "Low stock alert: Red Roses",
        time: "15 minutes ago",
        priority: "medium",
      },
      {
        id: 3,
        type: "user",
        message: "New user registration: john@example.com",
        time: "1 hour ago",
        priority: "low",
      },
    ];
    setNotifications(mockNotifications);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "PENDING":
        return <FaClock className="text-warning" />;
      case "CONFIRMED":
        return <FaCheckCircle className="text-info" />;
      case "SHIPPED":
        return <FaTruck className="text-primary" />;
      case "DELIVERED":
        return <FaCheckCircle className="text-success" />;
      case "CANCELLED":
        return <FaExclamationTriangle className="text-danger" />;
      default:
        return <FaClock className="text-secondary" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "PENDING":
        return "warning";
      case "CONFIRMED":
        return "info";
      case "SHIPPED":
        return "primary";
      case "DELIVERED":
        return "success";
      case "CANCELLED":
        return "danger";
      default:
        return "secondary";
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case "order":
        return <FaShoppingCart className="text-primary" />;
      case "stock":
        return <FaExclamationTriangle className="text-warning" />;
      case "user":
        return <FaUserPlus className="text-success" />;
      default:
        return <FaBell className="text-info" />;
    }
  };

  if (loading) {
    return (
      <div className="loading-spinner">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      {/* Welcome Header */}
      <div className="dashboard-header mb-4">
        <div className="row align-items-center">
          <div className="col-md-8">
            <h1 className="dashboard-title mb-2">Welcome to BloomKart Admin</h1>
            <p className="dashboard-subtitle mb-0">
              Manage your flower business with real-time insights and analytics
            </p>
          </div>
          <div className="col-md-4 text-md-end">
            <div className="d-flex gap-2 justify-content-md-end">
              <button className="btn btn-outline-primary btn-sm">
                <FaCog className="me-1" />
                Settings
              </button>
              <button className="btn btn-primary btn-sm">
                <FaPlus className="me-1" />
                Quick Add
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Statistics Grid */}
      <div className="row g-4 mb-4">
        <div className="col-xl-3 col-md-6">
          <div className="stat-card stat-card-primary">
            <div className="stat-card-content">
              <div className="stat-card-icon">
                <FaUsers />
              </div>
              <div className="stat-card-info">
                <h3 className="stat-card-number">{stats.totalUsers}</h3>
                <p className="stat-card-label">Total Users</p>
                <div className="stat-card-trend">
                  <FaArrowUp className="text-success me-1" />
                  <span className="text-success">+12%</span>
                  <span className="text-muted ms-1">this month</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-xl-3 col-md-6">
          <div className="stat-card stat-card-success">
            <div className="stat-card-content">
              <div className="stat-card-icon">
                <FaShoppingBag />
              </div>
              <div className="stat-card-info">
                <h3 className="stat-card-number">{stats.totalProducts}</h3>
                <p className="stat-card-label">Total Products</p>
                <div className="stat-card-trend">
                  <FaArrowUp className="text-success me-1" />
                  <span className="text-success">+8%</span>
                  <span className="text-muted ms-1">this month</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-xl-3 col-md-6">
          <div className="stat-card stat-card-warning">
            <div className="stat-card-content">
              <div className="stat-card-icon">
                <FaBox />
              </div>
              <div className="stat-card-info">
                <h3 className="stat-card-number">{stats.totalOrders}</h3>
                <p className="stat-card-label">Total Orders</p>
                <div className="stat-card-trend">
                  <FaArrowUp className="text-success me-1" />
                  <span className="text-success">+15%</span>
                  <span className="text-muted ms-1">this month</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-xl-3 col-md-6">
          <div className="stat-card stat-card-info">
            <div className="stat-card-content">
              <div className="stat-card-icon">
                <FaMoneyBillWave />
              </div>
              <div className="stat-card-info">
                <h3 className="stat-card-number">
                  ₹{stats.totalRevenue?.toLocaleString() || 0}
                </h3>
                <p className="stat-card-label">Total Revenue</p>
                <div className="stat-card-trend">
                  <FaArrowUp className="text-success me-1" />
                  <span className="text-success">+20%</span>
                  <span className="text-muted ms-1">this month</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="row g-4">
        {/* Left Column */}
        <div className="col-xl-8">
          {/* Recent Orders */}
          <div className="dashboard-card mb-4">
            <div className="dashboard-card-header">
              <h5 className="dashboard-card-title">
                <FaBox className="me-2" />
                Recent Orders
              </h5>
              <Link
                to="/admin/orders"
                className="btn btn-outline-primary btn-sm"
              >
                View All
              </Link>
            </div>
            <div className="dashboard-card-body">
              {recentOrders.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-state-icon">
                    <FaBox />
                  </div>
                  <h5>No recent orders</h5>
                  <p>
                    Orders will appear here once customers start placing them.
                  </p>
                </div>
              ) : (
                <div className="orders-list">
                  {recentOrders.map((order) => (
                    <div key={order.id} className="order-item">
                      <div className="order-info">
                        <div className="order-id">#{order.id}</div>
                        <div className="order-customer">
                          <div className="customer-avatar">
                            {order.user?.name?.charAt(0)?.toUpperCase() || "U"}
                          </div>
                          <div className="customer-details">
                            <div className="customer-name">
                              {order.user?.name}
                            </div>
                            <div className="customer-email">
                              {order.user?.email}
                            </div>
                          </div>
                        </div>
                        <div className="order-amount">₹{order.totalAmount}</div>
                        <div className="order-status">
                          <span
                            className={`status-badge status-${order.status.toLowerCase()}`}
                          >
                            {getStatusIcon(order.status)}
                            {order.status}
                          </span>
                        </div>
                        <div className="order-date">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </div>
                        <div className="order-actions">
                          <Link
                            to={`/admin/orders/${order.id}`}
                            className="btn btn-sm btn-outline-primary"
                          >
                            <FaEye />
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Top Products */}
          <div className="dashboard-card">
            <div className="dashboard-card-header">
              <h5 className="dashboard-card-title">
                <FaStar className="me-2" />
                Top Products
              </h5>
              <Link
                to="/admin/products"
                className="btn btn-outline-primary btn-sm"
              >
                View All
              </Link>
            </div>
            <div className="dashboard-card-body">
              <div className="products-grid">
                {topProducts.map((product) => (
                  <div key={product.id} className="product-card">
                    <div className="product-image">
                      <img
                        src={`http://localhost:8080/api${
                          product.mainImage || product.images?.[0] || ""
                        }`}
                        alt={product.name}
                      />
                    </div>
                    <div className="product-info">
                      <h6 className="product-name">{product.name}</h6>
                      <div className="product-meta">
                        <span className="product-price">₹{product.price}</span>
                        <span className="product-stock">
                          Stock: {product.stockQuantity}
                        </span>
                      </div>
                      <div className="product-rating">
                        <FaStar className="text-warning" />
                        <span>4.5</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="col-xl-4">
          {/* System Status */}
          <div className="dashboard-card mb-4">
            <div className="dashboard-card-header">
              <h5 className="dashboard-card-title">
                <FaServer className="me-2" />
                System Status
              </h5>
            </div>
            <div className="dashboard-card-body">
              <div className="system-status-list">
                <div className="status-item">
                  <div className="status-icon status-online">
                    <FaServer />
                  </div>
                  <div className="status-info">
                    <div className="status-name">Backend Server</div>
                    <div className="status-value">{systemStatus.backend}</div>
                  </div>
                </div>
                <div className="status-item">
                  <div className="status-icon status-online">
                    <FaDatabase />
                  </div>
                  <div className="status-info">
                    <div className="status-name">Database</div>
                    <div className="status-value">{systemStatus.database}</div>
                  </div>
                </div>
                <div className="status-item">
                  <div className="status-icon status-online">
                    <FaGlobe />
                  </div>
                  <div className="status-info">
                    <div className="status-name">Uptime</div>
                    <div className="status-value">{systemStatus.uptime}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Notifications */}
          <div className="dashboard-card mb-4">
            <div className="dashboard-card-header">
              <h5 className="dashboard-card-title">
                <FaBell className="me-2" />
                Notifications
              </h5>
            </div>
            <div className="dashboard-card-body">
              <div className="notifications-list">
                {notifications.map((notification) => (
                  <div key={notification.id} className="notification-item">
                    <div className="notification-icon">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="notification-content">
                      <div className="notification-message">
                        {notification.message}
                      </div>
                      <div className="notification-time">
                        {notification.time}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="dashboard-card">
            <div className="dashboard-card-header">
              <h5 className="dashboard-card-title">
                <FaPlus className="me-2" />
                Quick Actions
              </h5>
            </div>
            <div className="dashboard-card-body">
              <div className="quick-actions">
                <Link to="/admin/products/add" className="quick-action-item">
                  <FaPlus />
                  <span>Add Product</span>
                </Link>
                <Link to="/admin/orders" className="quick-action-item">
                  <FaBox />
                  <span>View Orders</span>
                </Link>
                <Link to="/admin/users" className="quick-action-item">
                  <FaUsers />
                  <span>Manage Users</span>
                </Link>
                <Link to="/admin/reports" className="quick-action-item">
                  <FaChartBar />
                  <span>View Reports</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
