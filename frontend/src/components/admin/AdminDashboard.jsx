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
} from "react-icons/fa";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsRes, ordersRes] = await Promise.all([
        api.get("/admin/dashboard/stats"),
        api.get("/admin/orders?page=0&size=5"),
      ]);
      setStats(statsRes.data);
      setRecentOrders(ordersRes.data.content);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
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

  if (loading) {
    return (
      <div className="loading-spinner">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="fade-in">
      {/* Header */}
      <div className="row align-items-center mb-5">
        <div className="col-md-8">
          <h1 className="text-gradient fw-bold mb-2">Admin Dashboard</h1>
          <p className="text-muted mb-0">
            Welcome back! Here's what's happening with your flower business
            today.
          </p>
        </div>
        <div className="col-md-4 text-md-end">
          <Link to="/admin/products/add" className="btn btn-primary">
            <FaPlus className="me-2" />
            Add Product
          </Link>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="row g-4 mb-5">
        <div className="col-md-6 col-lg-3">
          <div className="stats-card">
            <div className="d-flex align-items-center justify-content-between mb-3">
              <div
                className="bg-gradient-primary text-white rounded-circle d-flex align-items-center justify-content-center"
                style={{ width: "60px", height: "60px" }}
              >
                <FaUsers size={24} />
              </div>
              <div className="text-end">
                <small className="text-muted">Total Users</small>
                <div className="h4 mb-0 text-primary fw-bold">
                  {stats.totalUsers}
                </div>
              </div>
            </div>
            <div className="d-flex align-items-center">
              <FaChartLine className="text-success me-2" />
              <small className="text-success">+12% from last month</small>
            </div>
          </div>
        </div>

        <div className="col-md-6 col-lg-3">
          <div className="stats-card">
            <div className="d-flex align-items-center justify-content-between mb-3">
              <div
                className="bg-gradient-secondary text-white rounded-circle d-flex align-items-center justify-content-center"
                style={{ width: "60px", height: "60px" }}
              >
                <FaShoppingBag size={24} />
              </div>
              <div className="text-end">
                <small className="text-muted">Total Products</small>
                <div className="h4 mb-0 text-primary fw-bold">
                  {stats.totalProducts}
                </div>
              </div>
            </div>
            <div className="d-flex align-items-center">
              <FaChartLine className="text-success me-2" />
              <small className="text-success">+8% from last month</small>
            </div>
          </div>
        </div>

        <div className="col-md-6 col-lg-3">
          <div className="stats-card">
            <div className="d-flex align-items-center justify-content-between mb-3">
              <div
                className="bg-gradient-primary text-white rounded-circle d-flex align-items-center justify-content-center"
                style={{ width: "60px", height: "60px" }}
              >
                <FaBox size={24} />
              </div>
              <div className="text-end">
                <small className="text-muted">Total Orders</small>
                <div className="h4 mb-0 text-primary fw-bold">
                  {stats.totalOrders}
                </div>
              </div>
            </div>
            <div className="d-flex align-items-center">
              <FaChartLine className="text-success me-2" />
              <small className="text-success">+15% from last month</small>
            </div>
          </div>
        </div>

        <div className="col-md-6 col-lg-3">
          <div className="stats-card">
            <div className="d-flex align-items-center justify-content-between mb-3">
              <div
                className="bg-gradient-secondary text-white rounded-circle d-flex align-items-center justify-content-center"
                style={{ width: "60px", height: "60px" }}
              >
                <FaMoneyBillWave size={24} />
              </div>
              <div className="text-end">
                <small className="text-muted">Total Revenue</small>
                <div className="h4 mb-0 text-primary fw-bold">
                  ₹{stats.totalRevenue?.toLocaleString() || 0}
                </div>
              </div>
            </div>
            <div className="d-flex align-items-center">
              <FaChartLine className="text-success me-2" />
              <small className="text-success">+20% from last month</small>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="row mb-5">
        <div className="col-12">
          <div className="card border-radius-custom shadow-custom">
            <div className="card-header bg-gradient-primary text-white">
              <h5 className="mb-0">
                <FaPlus className="me-2" />
                Quick Actions
              </h5>
            </div>
            <div className="card-body">
              <div className="row g-3">
                <div className="col-md-3 col-sm-6">
                  <Link
                    to="/admin/products/add"
                    className="text-decoration-none"
                  >
                    <div className="card h-100 border-radius-custom text-center p-3 hover-card">
                      <div
                        className="bg-gradient-primary text-white rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3"
                        style={{ width: "50px", height: "50px" }}
                      >
                        <FaPlus />
                      </div>
                      <h6 className="mb-1">Add Product</h6>
                      <small className="text-muted">
                        Create new flower listing
                      </small>
                    </div>
                  </Link>
                </div>
                <div className="col-md-3 col-sm-6">
                  <Link to="/admin/products" className="text-decoration-none">
                    <div className="card h-100 border-radius-custom text-center p-3 hover-card">
                      <div
                        className="bg-gradient-secondary text-white rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3"
                        style={{ width: "50px", height: "50px" }}
                      >
                        <FaEdit />
                      </div>
                      <h6 className="mb-1">Manage Products</h6>
                      <small className="text-muted">
                        Edit and organize inventory
                      </small>
                    </div>
                  </Link>
                </div>
                <div className="col-md-3 col-sm-6">
                  <Link to="/admin/orders" className="text-decoration-none">
                    <div className="card h-100 border-radius-custom text-center p-3 hover-card">
                      <div
                        className="bg-gradient-primary text-white rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3"
                        style={{ width: "50px", height: "50px" }}
                      >
                        <FaBox />
                      </div>
                      <h6 className="mb-1">View Orders</h6>
                      <small className="text-muted">
                        Track and manage orders
                      </small>
                    </div>
                  </Link>
                </div>
                <div className="col-md-3 col-sm-6">
                  <Link to="/admin/users" className="text-decoration-none">
                    <div className="card h-100 border-radius-custom text-center p-3 hover-card">
                      <div
                        className="bg-gradient-secondary text-white rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3"
                        style={{ width: "50px", height: "50px" }}
                      >
                        <FaUsers />
                      </div>
                      <h6 className="mb-1">Manage Users</h6>
                      <small className="text-muted">
                        User management and roles
                      </small>
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="row">
        <div className="col-12">
          <div className="card border-radius-custom shadow-custom">
            <div className="card-header bg-gradient-primary text-white d-flex justify-content-between align-items-center">
              <h5 className="mb-0">
                <FaBox className="me-2" />
                Recent Orders
              </h5>
              <Link to="/admin/orders" className="btn btn-outline-light btn-sm">
                View All
              </Link>
            </div>
            <div className="card-body">
              {recentOrders.length === 0 ? (
                <div className="text-center py-4">
                  <div
                    className="bg-gradient-primary text-white rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3"
                    style={{ width: "80px", height: "80px" }}
                  >
                    <FaBox size={32} />
                  </div>
                  <h5 className="text-muted mb-2">No recent orders</h5>
                  <p className="text-muted">
                    Orders will appear here once customers start placing them.
                  </p>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover mb-0">
                    <thead>
                      <tr>
                        <th>Order ID</th>
                        <th>Customer</th>
                        <th>Amount</th>
                        <th>Status</th>
                        <th>Date</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentOrders.map((order) => (
                        <tr key={order.id}>
                          <td>
                            <span className="fw-bold text-primary">
                              #{order.id}
                            </span>
                          </td>
                          <td>
                            <div className="d-flex align-items-center">
                              <div
                                className="bg-gradient-primary text-white rounded-circle d-flex align-items-center justify-content-center me-3"
                                style={{ width: "35px", height: "35px" }}
                              >
                                {order.user?.name?.charAt(0)?.toUpperCase() ||
                                  "U"}
                              </div>
                              <div>
                                <div className="fw-semibold">
                                  {order.user?.name}
                                </div>
                                <small className="text-muted">
                                  {order.user?.email}
                                </small>
                              </div>
                            </div>
                          </td>
                          <td>
                            <span className="fw-bold text-success">
                              ₹{order.totalAmount}
                            </span>
                          </td>
                          <td>
                            <div className="d-flex align-items-center">
                              {getStatusIcon(order.status)}
                              <span
                                className={`badge bg-${getStatusColor(
                                  order.status
                                )} ms-2`}
                              >
                                {order.status}
                              </span>
                            </div>
                          </td>
                          <td>
                            <div>
                              <div className="fw-semibold">
                                {new Date(order.createdAt).toLocaleDateString()}
                              </div>
                              <small className="text-muted">
                                {new Date(order.createdAt).toLocaleTimeString()}
                              </small>
                            </div>
                          </td>
                          <td>
                            <Link
                              to={`/admin/orders/${order.id}`}
                              className="btn btn-outline-primary btn-sm"
                            >
                              <FaEye className="me-1" />
                              View
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
