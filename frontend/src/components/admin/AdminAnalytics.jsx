import React, { useState, useEffect } from "react";
import api from "../../axios";
import {
  FaChartLine,
  FaUsers,
  FaShoppingBag,
  FaMoneyBillWave,
  FaBox,
  FaCalendarAlt,
  FaArrowUp,
  FaArrowDown,
  FaEye,
  FaDownload,
} from "react-icons/fa";

const AdminAnalytics = () => {
  const [analytics, setAnalytics] = useState({
    salesData: [],
    userGrowth: [],
    topProducts: [],
    revenueStats: {},
  });
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState("30"); // days

  useEffect(() => {
    fetchAnalytics();
  }, [dateRange]);

  const fetchAnalytics = async () => {
    try {
      // In a real app, you would have analytics endpoints
      // For now, we'll simulate the data
      const mockAnalytics = {
        salesData: [
          { date: "2024-01-01", sales: 15000 },
          { date: "2024-01-02", sales: 18000 },
          { date: "2024-01-03", sales: 22000 },
          { date: "2024-01-04", sales: 19000 },
          { date: "2024-01-05", sales: 25000 },
          { date: "2024-01-06", sales: 28000 },
          { date: "2024-01-07", sales: 32000 },
        ],
        userGrowth: [
          { month: "Jan", users: 150 },
          { month: "Feb", users: 180 },
          { month: "Mar", users: 220 },
          { month: "Apr", users: 280 },
          { month: "May", users: 320 },
          { month: "Jun", users: 380 },
        ],
        topProducts: [
          { name: "Red Roses", sales: 45, revenue: 22500 },
          { name: "White Lilies", sales: 38, revenue: 19000 },
          { name: "Sunflowers", sales: 32, revenue: 16000 },
          { name: "Tulips", sales: 28, revenue: 14000 },
          { name: "Orchids", sales: 25, revenue: 12500 },
        ],
        revenueStats: {
          currentMonth: 320000,
          previousMonth: 280000,
          growth: 14.3,
          averageOrder: 2400,
          totalOrders: 133,
        },
      };

      setAnalytics(mockAnalytics);
    } catch (error) {
      console.error("Error fetching analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount);
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
      <div className="row align-items-center mb-4">
        <div className="col-md-8">
          <h1 className="text-gradient fw-bold mb-2">Analytics Dashboard</h1>
          <p className="text-muted mb-0">
            Track your business performance and growth metrics
          </p>
        </div>
        <div className="col-md-4 text-md-end">
          <div className="d-flex gap-2 justify-content-md-end">
            <select
              className="form-select form-select-sm"
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              style={{ width: "auto" }}
            >
              <option value="7">Last 7 days</option>
              <option value="30">Last 30 days</option>
              <option value="90">Last 90 days</option>
              <option value="365">Last year</option>
            </select>
            <button className="btn btn-outline-primary btn-sm">
              <FaDownload className="me-1" />
              Export
            </button>
          </div>
        </div>
      </div>

      {/* Revenue Overview */}
      <div className="row g-4 mb-4">
        <div className="col-md-6 col-lg-3">
          <div className="admin-stat-card">
            <div className="d-flex align-items-center justify-content-between">
              <div>
                <div className="admin-stat-number text-primary">
                  {formatCurrency(analytics.revenueStats.currentMonth)}
                </div>
                <div className="admin-stat-label">Current Month Revenue</div>
              </div>
              <div className="admin-stat-icon bg-gradient-primary text-white">
                <FaMoneyBillWave size={24} />
              </div>
            </div>
            <div className="d-flex align-items-center mt-2">
              <FaArrowUp className="text-success me-1" />
              <small className="text-success">
                +{analytics.revenueStats.growth}% from last month
              </small>
            </div>
          </div>
        </div>

        <div className="col-md-6 col-lg-3">
          <div className="admin-stat-card">
            <div className="d-flex align-items-center justify-content-between">
              <div>
                <div className="admin-stat-number text-success">
                  {analytics.revenueStats.totalOrders}
                </div>
                <div className="admin-stat-label">Total Orders</div>
              </div>
              <div className="admin-stat-icon bg-gradient-secondary text-white">
                <FaBox size={24} />
              </div>
            </div>
            <div className="d-flex align-items-center mt-2">
              <FaArrowUp className="text-success me-1" />
              <small className="text-success">+12% from last month</small>
            </div>
          </div>
        </div>

        <div className="col-md-6 col-lg-3">
          <div className="admin-stat-card">
            <div className="d-flex align-items-center justify-content-between">
              <div>
                <div className="admin-stat-number text-info">
                  {formatCurrency(analytics.revenueStats.averageOrder)}
                </div>
                <div className="admin-stat-label">Average Order Value</div>
              </div>
              <div className="admin-stat-icon bg-gradient-primary text-white">
                <FaChartLine size={24} />
              </div>
            </div>
            <div className="d-flex align-items-center mt-2">
              <FaArrowUp className="text-success me-1" />
              <small className="text-success">+8% from last month</small>
            </div>
          </div>
        </div>

        <div className="col-md-6 col-lg-3">
          <div className="admin-stat-card">
            <div className="d-flex align-items-center justify-content-between">
              <div>
                <div className="admin-stat-number text-warning">1,250</div>
                <div className="admin-stat-label">Active Users</div>
              </div>
              <div className="admin-stat-icon bg-gradient-secondary text-white">
                <FaUsers size={24} />
              </div>
            </div>
            <div className="d-flex align-items-center mt-2">
              <FaArrowUp className="text-success me-1" />
              <small className="text-success">+15% from last month</small>
            </div>
          </div>
        </div>
      </div>

      {/* Charts and Tables */}
      <div className="row g-4">
        {/* Sales Chart */}
        <div className="col-lg-8">
          <div className="card border-radius-custom shadow-custom">
            <div className="card-header bg-gradient-primary text-white">
              <h5 className="mb-0">
                <FaChartLine className="me-2" />
                Sales Trend
              </h5>
            </div>
            <div className="card-body">
              <div className="chart-container" style={{ height: "300px" }}>
                <div className="d-flex align-items-center justify-content-center h-100">
                  <div className="text-center">
                    <FaChartLine size={48} className="text-muted mb-3" />
                    <h6 className="text-muted">Sales Chart</h6>
                    <p className="text-muted small">
                      Chart visualization would be implemented here
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Top Products */}
        <div className="col-lg-4">
          <div className="card border-radius-custom shadow-custom">
            <div className="card-header bg-gradient-secondary text-white">
              <h5 className="mb-0">
                <FaShoppingBag className="me-2" />
                Top Products
              </h5>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-sm">
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Sales</th>
                      <th>Revenue</th>
                    </tr>
                  </thead>
                  <tbody>
                    {analytics.topProducts.map((product, index) => (
                      <tr key={index}>
                        <td>
                          <div className="fw-semibold">{product.name}</div>
                        </td>
                        <td>
                          <span className="badge bg-primary">{product.sales}</span>
                        </td>
                        <td>
                          <small className="text-success fw-semibold">
                            {formatCurrency(product.revenue)}
                          </small>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* User Growth */}
        <div className="col-lg-6">
          <div className="card border-radius-custom shadow-custom">
            <div className="card-header bg-gradient-primary text-white">
              <h5 className="mb-0">
                <FaUsers className="me-2" />
                User Growth
              </h5>
            </div>
            <div className="card-body">
              <div className="chart-container" style={{ height: "250px" }}>
                <div className="d-flex align-items-center justify-content-center h-100">
                  <div className="text-center">
                    <FaUsers size={48} className="text-muted mb-3" />
                    <h6 className="text-muted">User Growth Chart</h6>
                    <p className="text-muted small">
                      User growth visualization would be implemented here
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="col-lg-6">
          <div className="card border-radius-custom shadow-custom">
            <div className="card-header bg-gradient-secondary text-white">
              <h5 className="mb-0">
                <FaCalendarAlt className="me-2" />
                Recent Activity
              </h5>
            </div>
            <div className="card-body">
              <div className="activity-list">
                <div className="activity-item d-flex align-items-center mb-3">
                  <div className="activity-icon bg-success text-white rounded-circle d-flex align-items-center justify-content-center me-3">
                    <FaBox size={12} />
                  </div>
                  <div className="flex-grow-1">
                    <div className="fw-semibold">New order #1234</div>
                    <small className="text-muted">2 minutes ago</small>
                  </div>
                  <div className="text-success fw-semibold">₹2,400</div>
                </div>

                <div className="activity-item d-flex align-items-center mb-3">
                  <div className="activity-icon bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-3">
                    <FaUsers size={12} />
                  </div>
                  <div className="flex-grow-1">
                    <div className="fw-semibold">New user registered</div>
                    <small className="text-muted">15 minutes ago</small>
                  </div>
                </div>

                <div className="activity-item d-flex align-items-center mb-3">
                  <div className="activity-icon bg-warning text-white rounded-circle d-flex align-items-center justify-content-center me-3">
                    <FaShoppingBag size={12} />
                  </div>
                  <div className="flex-grow-1">
                    <div className="fw-semibold">Product stock updated</div>
                    <small className="text-muted">1 hour ago</small>
                  </div>
                </div>

                <div className="activity-item d-flex align-items-center">
                  <div className="activity-icon bg-info text-white rounded-circle d-flex align-items-center justify-content-center me-3">
                    <FaMoneyBillWave size={12} />
                  </div>
                  <div className="flex-grow-1">
                    <div className="fw-semibold">Payment received</div>
                    <small className="text-muted">2 hours ago</small>
                  </div>
                  <div className="text-success fw-semibold">₹1,800</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics; 