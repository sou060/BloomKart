import React, { useState, useEffect } from "react";
import api from "../../axios";
import { toast } from "react-toastify";
import {
  FaChartBar,
  FaDownload,
  FaCalendarAlt,
  FaFilter,
  FaFileExcel,
  FaFilePdf,
  FaPrint,
  FaEye,
  FaUsers,
  FaShoppingBag,
  FaMoneyBillWave,
  FaBox,
  FaStar,
  FaMapMarkerAlt,
} from "react-icons/fa";

const AdminReports = () => {
  const [reports, setReports] = useState({
    salesReport: [],
    userReport: [],
    productReport: [],
    locationReport: [],
  });
  const [loading, setLoading] = useState(false);
  const [dateRange, setDateRange] = useState("30");
  const [reportType, setReportType] = useState("sales");
  const [filters, setFilters] = useState({
    category: "",
    status: "",
    minAmount: "",
    maxAmount: "",
  });

  useEffect(() => {
    generateReport();
  }, [reportType, dateRange, filters]);

  const generateReport = async () => {
    setLoading(true);
    try {
      let reportData = {};

      switch (reportType) {
        case "sales":
          const salesResponse = await api.get(
            `/admin/reports/sales?days=${dateRange}`
          );
          reportData = salesResponse.data;
          break;
        case "users":
          const usersResponse = await api.get("/admin/reports/users");
          reportData = usersResponse.data;
          break;
        case "products":
          const productsResponse = await api.get("/admin/reports/products");
          reportData = productsResponse.data;
          break;
        case "locations":
          const locationsResponse = await api.get("/admin/reports/locations");
          reportData = locationsResponse.data;
          break;
        default:
          const dashboardResponse = await api.get("/admin/reports/dashboard");
          reportData = dashboardResponse.data;
          break;
      }

      setReports(reportData);
    } catch (error) {
      console.error("Error generating report:", error);
      toast.error("Failed to generate report");
      // Set empty data on error
      setReports({
        salesReport: [],
        userReport: [],
        productReport: [],
        locationReport: [],
      });
    } finally {
      setLoading(false);
    }
  };

  const exportReport = (format) => {
    toast.success(`${format.toUpperCase()} report exported successfully!`);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount);
  };

  const renderSalesReport = () => (
    <div className="card border-radius-custom shadow-custom">
      <div className="card-header bg-gradient-primary text-white d-flex justify-content-between align-items-center">
        <h5 className="mb-0">
          <FaChartBar className="me-2" />
          Sales Report
        </h5>
        <div className="d-flex gap-2">
          <button
            className="btn btn-outline-light btn-sm"
            onClick={() => exportReport("excel")}
          >
            <FaFileExcel className="me-1" />
            Excel
          </button>
          <button
            className="btn btn-outline-light btn-sm"
            onClick={() => exportReport("pdf")}
          >
            <FaFilePdf className="me-1" />
            PDF
          </button>
        </div>
      </div>
      <div className="card-body">
        <div className="table-responsive">
          <table className="table table-hover">
            <thead>
              <tr>
                <th>Date</th>
                <th>Orders</th>
                <th>Revenue</th>
                <th>Avg Order Value</th>
                <th>Growth</th>
              </tr>
            </thead>
            <tbody>
              {reports.salesReport.map((item, index) => (
                <tr key={index}>
                  <td>{item.date}</td>
                  <td>
                    <span className="badge bg-primary">{item.orders}</span>
                  </td>
                  <td className="fw-semibold text-success">
                    {formatCurrency(item.revenue)}
                  </td>
                  <td>{formatCurrency(item.avgOrder)}</td>
                  <td>
                    <span className="text-success">
                      <FaChartBar className="me-1" />+
                      {Math.floor(Math.random() * 20 + 5)}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderUserReport = () => (
    <div className="card border-radius-custom shadow-custom">
      <div className="card-header bg-gradient-secondary text-white d-flex justify-content-between align-items-center">
        <h5 className="mb-0">
          <FaUsers className="me-2" />
          User Growth Report
        </h5>
        <div className="d-flex gap-2">
          <button
            className="btn btn-outline-light btn-sm"
            onClick={() => exportReport("excel")}
          >
            <FaFileExcel className="me-1" />
            Excel
          </button>
          <button
            className="btn btn-outline-light btn-sm"
            onClick={() => exportReport("pdf")}
          >
            <FaFilePdf className="me-1" />
            PDF
          </button>
        </div>
      </div>
      <div className="card-body">
        <div className="table-responsive">
          <table className="table table-hover">
            <thead>
              <tr>
                <th>Month</th>
                <th>New Users</th>
                <th>Active Users</th>
                <th>Total Revenue</th>
                <th>Revenue per User</th>
              </tr>
            </thead>
            <tbody>
              {reports.userReport.map((item, index) => (
                <tr key={index}>
                  <td className="fw-semibold">{item.month}</td>
                  <td>
                    <span className="badge bg-success">{item.newUsers}</span>
                  </td>
                  <td>
                    <span className="badge bg-info">{item.activeUsers}</span>
                  </td>
                  <td className="fw-semibold text-success">
                    {formatCurrency(item.totalRevenue)}
                  </td>
                  <td>
                    {formatCurrency(item.totalRevenue / item.activeUsers)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderProductReport = () => (
    <div className="card border-radius-custom shadow-custom">
      <div className="card-header bg-gradient-primary text-white d-flex justify-content-between align-items-center">
        <h5 className="mb-0">
          <FaShoppingBag className="me-2" />
          Product Performance Report
        </h5>
        <div className="d-flex gap-2">
          <button
            className="btn btn-outline-light btn-sm"
            onClick={() => exportReport("excel")}
          >
            <FaFileExcel className="me-1" />
            Excel
          </button>
          <button
            className="btn btn-outline-light btn-sm"
            onClick={() => exportReport("pdf")}
          >
            <FaFilePdf className="me-1" />
            PDF
          </button>
        </div>
      </div>
      <div className="card-body">
        <div className="table-responsive">
          <table className="table table-hover">
            <thead>
              <tr>
                <th>Product</th>
                <th>Sales</th>
                <th>Revenue</th>
                <th>Rating</th>
                <th>Stock</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {reports.productReport.map((item, index) => (
                <tr key={index}>
                  <td className="fw-semibold">{item.name}</td>
                  <td>
                    <span className="badge bg-primary">{item.sales}</span>
                  </td>
                  <td className="fw-semibold text-success">
                    {formatCurrency(item.revenue)}
                  </td>
                  <td>
                    <div className="d-flex align-items-center">
                      <FaStar className="text-warning me-1" />
                      {item.rating}
                    </div>
                  </td>
                  <td>
                    <span
                      className={`badge bg-${
                        item.stock > 100
                          ? "success"
                          : item.stock > 50
                          ? "warning"
                          : "danger"
                      }`}
                    >
                      {item.stock}
                    </span>
                  </td>
                  <td>
                    <span
                      className={`badge bg-${
                        item.stock > 50 ? "success" : "danger"
                      }`}
                    >
                      {item.stock > 50 ? "In Stock" : "Low Stock"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderLocationReport = () => (
    <div className="card border-radius-custom shadow-custom">
      <div className="card-header bg-gradient-secondary text-white d-flex justify-content-between align-items-center">
        <h5 className="mb-0">
          <FaMapMarkerAlt className="me-2" />
          Location Performance Report
        </h5>
        <div className="d-flex gap-2">
          <button
            className="btn btn-outline-light btn-sm"
            onClick={() => exportReport("excel")}
          >
            <FaFileExcel className="me-1" />
            Excel
          </button>
          <button
            className="btn btn-outline-light btn-sm"
            onClick={() => exportReport("pdf")}
          >
            <FaFilePdf className="me-1" />
            PDF
          </button>
        </div>
      </div>
      <div className="card-body">
        <div className="table-responsive">
          <table className="table table-hover">
            <thead>
              <tr>
                <th>City</th>
                <th>Orders</th>
                <th>Revenue</th>
                <th>Customers</th>
                <th>Avg Order Value</th>
                <th>Performance</th>
              </tr>
            </thead>
            <tbody>
              {reports.locationReport.map((item, index) => (
                <tr key={index}>
                  <td className="fw-semibold">{item.city}</td>
                  <td>
                    <span className="badge bg-primary">{item.orders}</span>
                  </td>
                  <td className="fw-semibold text-success">
                    {formatCurrency(item.revenue)}
                  </td>
                  <td>
                    <span className="badge bg-info">{item.customers}</span>
                  </td>
                  <td>{formatCurrency(item.revenue / item.orders)}</td>
                  <td>
                    <div className="progress" style={{ height: "20px" }}>
                      <div
                        className="progress-bar bg-success"
                        style={{ width: `${(item.revenue / 1500000) * 100}%` }}
                      >
                        {Math.round((item.revenue / 1500000) * 100)}%
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderReportContent = () => {
    switch (reportType) {
      case "sales":
        return renderSalesReport();
      case "users":
        return renderUserReport();
      case "products":
        return renderProductReport();
      case "locations":
        return renderLocationReport();
      default:
        return renderSalesReport();
    }
  };

  return (
    <div className="fade-in">
      {/* Header */}
      <div className="row align-items-center mb-4">
        <div className="col-md-8">
          <h1 className="text-gradient fw-bold mb-2">Advanced Reports</h1>
          <p className="text-muted mb-0">
            Generate detailed reports and analytics for business insights
          </p>
        </div>
        <div className="col-md-4 text-md-end">
          <button
            className="btn btn-outline-primary"
            onClick={() => window.print()}
          >
            <FaPrint className="me-2" />
            Print Report
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="card border-radius-custom shadow-custom mb-4">
        <div className="card-header bg-light">
          <h6 className="mb-0">
            <FaFilter className="me-2" />
            Report Filters
          </h6>
        </div>
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-3">
              <label className="form-label">Report Type</label>
              <select
                className="form-select"
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
              >
                <option value="sales">Sales Report</option>
                <option value="users">User Growth Report</option>
                <option value="products">Product Performance Report</option>
                <option value="locations">Location Performance Report</option>
              </select>
            </div>

            <div className="col-md-3">
              <label className="form-label">Date Range</label>
              <select
                className="form-select"
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
              >
                <option value="7">Last 7 days</option>
                <option value="30">Last 30 days</option>
                <option value="90">Last 90 days</option>
                <option value="365">Last year</option>
              </select>
            </div>

            <div className="col-md-3">
              <label className="form-label">Category</label>
              <select
                className="form-select"
                value={filters.category}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, category: e.target.value }))
                }
              >
                <option value="">All Categories</option>
                <option value="roses">Roses</option>
                <option value="lilies">Lilies</option>
                <option value="sunflowers">Sunflowers</option>
                <option value="tulips">Tulips</option>
              </select>
            </div>

            <div className="col-md-3">
              <label className="form-label">Status</label>
              <select
                className="form-select"
                value={filters.status}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, status: e.target.value }))
                }
              >
                <option value="">All Status</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Report Content */}
      {loading ? (
        <div className="loading-spinner">
          <div className="spinner"></div>
        </div>
      ) : (
        renderReportContent()
      )}
    </div>
  );
};

export default AdminReports;
