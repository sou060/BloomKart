import React, { useState, useEffect } from "react";
import api from "../../axios";
import { toast } from "react-toastify";
import {
  FaUsers,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaShoppingBag,
  FaMoneyBillWave,
  FaStar,
  FaChartLine,
  FaFilter,
  FaSearch,
  FaEdit,
  FaEye,
  FaTrash,
  FaDownload,
  FaCrown,
  FaClock,
  FaCheckCircle,
  FaExclamationTriangle,
  FaHeart,
  FaGift,
} from "react-icons/fa";

const AdminCustomers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCustomers, setSelectedCustomers] = useState([]);
  const [filters, setFilters] = useState({
    segment: "",
    status: "",
    search: "",
    minOrders: "",
    maxOrders: "",
  });
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [viewMode, setViewMode] = useState("list"); // list, grid, analytics
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showCustomerModal, setShowCustomerModal] = useState(false);

  useEffect(() => {
    fetchCustomers();
  }, [filters, sortBy, sortOrder]);

  const fetchCustomers = async () => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const mockCustomers = [
        {
          id: 1,
          name: "John Doe",
          email: "john.doe@email.com",
          phone: "+91 9876543210",
          address: "123 Main St, Mumbai, Maharashtra",
          joinDate: "2023-01-15",
          totalOrders: 25,
          totalSpent: 75000,
          averageOrder: 3000,
          lastOrder: "2024-01-10",
          status: "active",
          segment: "premium",
          loyaltyPoints: 1250,
          favoriteCategory: "Roses",
          tags: ["VIP", "Regular Buyer"],
          notes: "Prefers red roses, orders frequently for special occasions",
        },
        {
          id: 2,
          name: "Sarah Wilson",
          email: "sarah.wilson@email.com",
          phone: "+91 8765432109",
          address: "456 Park Ave, Delhi, Delhi",
          joinDate: "2023-03-20",
          totalOrders: 15,
          totalSpent: 45000,
          averageOrder: 3000,
          lastOrder: "2024-01-08",
          status: "active",
          segment: "regular",
          loyaltyPoints: 750,
          favoriteCategory: "Lilies",
          tags: ["New Customer"],
          notes: "Likes white flowers, prefers delivery in evenings",
        },
        {
          id: 3,
          name: "Mike Johnson",
          email: "mike.johnson@email.com",
          phone: "+91 7654321098",
          address: "789 Oak Rd, Bangalore, Karnataka",
          joinDate: "2023-06-10",
          totalOrders: 8,
          totalSpent: 24000,
          averageOrder: 3000,
          lastOrder: "2023-12-25",
          status: "inactive",
          segment: "occasional",
          loyaltyPoints: 400,
          favoriteCategory: "Sunflowers",
          tags: ["Seasonal Buyer"],
          notes: "Orders mainly during holidays and birthdays",
        },
        {
          id: 4,
          name: "Emily Brown",
          email: "emily.brown@email.com",
          phone: "+91 6543210987",
          address: "321 Pine St, Chennai, Tamil Nadu",
          joinDate: "2023-08-05",
          totalOrders: 32,
          totalSpent: 96000,
          averageOrder: 3000,
          lastOrder: "2024-01-12",
          status: "active",
          segment: "premium",
          loyaltyPoints: 1600,
          favoriteCategory: "Orchids",
          tags: ["VIP", "High Value"],
          notes: "Corporate client, orders for office events",
        },
        {
          id: 5,
          name: "David Lee",
          email: "david.lee@email.com",
          phone: "+91 5432109876",
          address: "654 Elm St, Kolkata, West Bengal",
          joinDate: "2023-11-12",
          totalOrders: 5,
          totalSpent: 15000,
          averageOrder: 3000,
          lastOrder: "2024-01-05",
          status: "active",
          segment: "new",
          loyaltyPoints: 250,
          favoriteCategory: "Tulips",
          tags: ["New Customer"],
          notes: "First-time buyer, interested in seasonal flowers",
        },
      ];

      setCustomers(mockCustomers);
    } catch (error) {
      console.error("Error fetching customers:", error);
      toast.error("Failed to load customers");
    } finally {
      setLoading(false);
    }
  };

  const getSegmentColor = (segment) => {
    switch (segment) {
      case "premium":
        return "danger";
      case "regular":
        return "primary";
      case "occasional":
        return "warning";
      case "new":
        return "success";
      default:
        return "secondary";
    }
  };

  const getStatusColor = (status) => {
    return status === "active" ? "success" : "secondary";
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount);
  };

  const getTimeAgo = (date) => {
    const now = new Date();
    const orderDate = new Date(date);
    const diffInDays = Math.floor((now - orderDate) / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) return "Today";
    if (diffInDays === 1) return "Yesterday";
    if (diffInDays < 7) return `${diffInDays} days ago`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
    return `${Math.floor(diffInDays / 30)} months ago`;
  };

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedCustomers(filteredCustomers.map((c) => c.id));
    } else {
      setSelectedCustomers([]);
    }
  };

  const handleSelectCustomer = (customerId, checked) => {
    if (checked) {
      setSelectedCustomers((prev) => [...prev, customerId]);
    } else {
      setSelectedCustomers((prev) => prev.filter((id) => id !== customerId));
    }
  };

  const filteredCustomers = customers
    .filter((customer) => {
      if (filters.segment && customer.segment !== filters.segment) return false;
      if (filters.status && customer.status !== filters.status) return false;
      if (
        filters.search &&
        !customer.name.toLowerCase().includes(filters.search.toLowerCase())
      )
        return false;
      if (
        filters.minOrders &&
        customer.totalOrders < parseInt(filters.minOrders)
      )
        return false;
      if (
        filters.maxOrders &&
        customer.totalOrders > parseInt(filters.maxOrders)
      )
        return false;
      return true;
    })
    .sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];

      if (typeof aValue === "string") {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  const renderCustomerAnalytics = () => (
    <div className="row g-4 mb-4">
      <div className="col-md-3">
        <div className="admin-stat-card">
          <div className="d-flex align-items-center justify-content-between">
            <div>
              <div className="admin-stat-number text-primary">
                {customers.length}
              </div>
              <div className="admin-stat-label">Total Customers</div>
            </div>
            <div className="admin-stat-icon bg-gradient-primary text-white">
              <FaUsers size={24} />
            </div>
          </div>
        </div>
      </div>

      <div className="col-md-3">
        <div className="admin-stat-card">
          <div className="d-flex align-items-center justify-content-between">
            <div>
              <div className="admin-stat-number text-success">
                {customers.filter((c) => c.status === "active").length}
              </div>
              <div className="admin-stat-label">Active Customers</div>
            </div>
            <div className="admin-stat-icon bg-gradient-secondary text-white">
              <FaCheckCircle size={24} />
            </div>
          </div>
        </div>
      </div>

      <div className="col-md-3">
        <div className="admin-stat-card">
          <div className="d-flex align-items-center justify-content-between">
            <div>
              <div className="admin-stat-number text-warning">
                {customers.filter((c) => c.segment === "premium").length}
              </div>
              <div className="admin-stat-label">Premium Customers</div>
            </div>
            <div className="admin-stat-icon bg-gradient-primary text-white">
              <FaCrown size={24} />
            </div>
          </div>
        </div>
      </div>

      <div className="col-md-3">
        <div className="admin-stat-card">
          <div className="d-flex align-items-center justify-content-between">
            <div>
              <div className="admin-stat-number text-info">
                {formatCurrency(
                  customers.reduce((sum, c) => sum + c.totalSpent, 0)
                )}
              </div>
              <div className="admin-stat-label">Total Revenue</div>
            </div>
            <div className="admin-stat-icon bg-gradient-secondary text-white">
              <FaMoneyBillWave size={24} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderCustomerList = () => (
    <div className="card border-radius-custom shadow-custom">
      <div className="card-header bg-gradient-primary text-white d-flex justify-content-between align-items-center">
        <h5 className="mb-0">
          <FaUsers className="me-2" />
          Customer List ({filteredCustomers.length})
        </h5>
        <div className="d-flex gap-2">
          <button className="btn btn-outline-light btn-sm">
            <FaDownload className="me-1" />
            Export
          </button>
        </div>
      </div>
      <div className="card-body">
        <div className="table-responsive">
          <table className="table table-hover">
            <thead>
              <tr>
                <th>
                  <input
                    type="checkbox"
                    className="form-check-input"
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    checked={
                      selectedCustomers.length === filteredCustomers.length &&
                      filteredCustomers.length > 0
                    }
                  />
                </th>
                <th>Customer</th>
                <th>Contact</th>
                <th>Segment</th>
                <th>Orders</th>
                <th>Total Spent</th>
                <th>Last Order</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.map((customer) => (
                <tr key={customer.id}>
                  <td>
                    <input
                      type="checkbox"
                      className="form-check-input"
                      checked={selectedCustomers.includes(customer.id)}
                      onChange={(e) =>
                        handleSelectCustomer(customer.id, e.target.checked)
                      }
                    />
                  </td>
                  <td>
                    <div className="d-flex align-items-center">
                      <div className="bg-light rounded-circle p-2 me-3">
                        <FaUser className="text-primary" />
                      </div>
                      <div>
                        <div className="fw-semibold">{customer.name}</div>
                        <small className="text-muted">
                          Joined{" "}
                          {new Date(customer.joinDate).toLocaleDateString()}
                        </small>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div>
                      <div className="small">{customer.email}</div>
                      <div className="small text-muted">{customer.phone}</div>
                    </div>
                  </td>
                  <td>
                    <span
                      className={`badge bg-${getSegmentColor(
                        customer.segment
                      )}`}
                    >
                      {customer.segment.toUpperCase()}
                    </span>
                  </td>
                  <td>
                    <div className="fw-semibold">{customer.totalOrders}</div>
                    <small className="text-muted">
                      ₹{customer.averageOrder} avg
                    </small>
                  </td>
                  <td className="fw-semibold text-success">
                    {formatCurrency(customer.totalSpent)}
                  </td>
                  <td>
                    <small className="text-muted">
                      {getTimeAgo(customer.lastOrder)}
                    </small>
                  </td>
                  <td>
                    <span
                      className={`badge bg-${getStatusColor(customer.status)}`}
                    >
                      {customer.status.toUpperCase()}
                    </span>
                  </td>
                  <td>
                    <div className="btn-group btn-group-sm">
                      <button
                        className="btn btn-outline-primary"
                        onClick={() => {
                          setSelectedCustomer(customer);
                          setShowCustomerModal(true);
                        }}
                        title="View Details"
                      >
                        <FaEye />
                      </button>
                      <button
                        className="btn btn-outline-info"
                        title="Edit Customer"
                      >
                        <FaEdit />
                      </button>
                      <button
                        className="btn btn-outline-danger"
                        title="Delete Customer"
                      >
                        <FaTrash />
                      </button>
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

  const renderCustomerGrid = () => (
    <div className="row g-4">
      {filteredCustomers.map((customer) => (
        <div key={customer.id} className="col-md-6 col-lg-4">
          <div className="card border-radius-custom shadow-custom h-100">
            <div className="card-header bg-light">
              <div className="d-flex justify-content-between align-items-center">
                <div className="d-flex align-items-center">
                  <div className="bg-light rounded-circle p-2 me-2">
                    <FaUser className="text-primary" />
                  </div>
                  <div>
                    <h6 className="mb-0">{customer.name}</h6>
                    <small className="text-muted">{customer.email}</small>
                  </div>
                </div>
                <div className="form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    checked={selectedCustomers.includes(customer.id)}
                    onChange={(e) =>
                      handleSelectCustomer(customer.id, e.target.checked)
                    }
                  />
                </div>
              </div>
            </div>
            <div className="card-body">
              <div className="row g-2 mb-3">
                <div className="col-6">
                  <small className="text-muted">Segment</small>
                  <div>
                    <span
                      className={`badge bg-${getSegmentColor(
                        customer.segment
                      )}`}
                    >
                      {customer.segment.toUpperCase()}
                    </span>
                  </div>
                </div>
                <div className="col-6">
                  <small className="text-muted">Status</small>
                  <div>
                    <span
                      className={`badge bg-${getStatusColor(customer.status)}`}
                    >
                      {customer.status.toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>

              <div className="row g-2 mb-3">
                <div className="col-6">
                  <small className="text-muted">Orders</small>
                  <div className="fw-semibold">{customer.totalOrders}</div>
                </div>
                <div className="col-6">
                  <small className="text-muted">Total Spent</small>
                  <div className="fw-semibold text-success">
                    {formatCurrency(customer.totalSpent)}
                  </div>
                </div>
              </div>

              <div className="mb-3">
                <small className="text-muted">Favorite Category</small>
                <div className="fw-semibold">{customer.favoriteCategory}</div>
              </div>

              <div className="d-flex gap-2">
                <button
                  className="btn btn-outline-primary btn-sm flex-fill"
                  onClick={() => {
                    setSelectedCustomer(customer);
                    setShowCustomerModal(true);
                  }}
                >
                  <FaEye className="me-1" />
                  View
                </button>
                <button className="btn btn-outline-info btn-sm">
                  <FaEdit />
                </button>
                <button className="btn btn-outline-danger btn-sm">
                  <FaTrash />
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="fade-in">
      {/* Header */}
      <div className="row align-items-center mb-4">
        <div className="col-md-8">
          <h1 className="text-gradient fw-bold mb-2">Customer Management</h1>
          <p className="text-muted mb-0">
            Manage customer relationships, track behavior, and analyze customer
            data
          </p>
        </div>
        <div className="col-md-4 text-md-end">
          <div className="d-flex gap-2 justify-content-md-end">
            <div className="btn-group btn-group-sm">
              <button
                className={`btn ${
                  viewMode === "list" ? "btn-primary" : "btn-outline-primary"
                }`}
                onClick={() => setViewMode("list")}
              >
                <FaUsers />
              </button>
              <button
                className={`btn ${
                  viewMode === "grid" ? "btn-primary" : "btn-outline-primary"
                }`}
                onClick={() => setViewMode("grid")}
              >
                <FaUser />
              </button>
              <button
                className={`btn ${
                  viewMode === "analytics"
                    ? "btn-primary"
                    : "btn-outline-primary"
                }`}
                onClick={() => setViewMode("analytics")}
              >
                <FaChartLine />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Analytics Overview */}
      {viewMode === "analytics" && renderCustomerAnalytics()}

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
                  placeholder="Search customers..."
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
                value={filters.segment}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, segment: e.target.value }))
                }
              >
                <option value="">All Segments</option>
                <option value="premium">Premium</option>
                <option value="regular">Regular</option>
                <option value="occasional">Occasional</option>
                <option value="new">New</option>
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
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            <div className="col-md-2">
              <select
                className="form-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="name">Name</option>
                <option value="totalOrders">Orders</option>
                <option value="totalSpent">Total Spent</option>
                <option value="joinDate">Join Date</option>
              </select>
            </div>

            <div className="col-md-2">
              <select
                className="form-select"
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
              >
                <option value="asc">Ascending</option>
                <option value="desc">Descending</option>
              </select>
            </div>

            <div className="col-md-1">
              <button className="btn btn-outline-secondary w-100">
                <FaFilter />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Customer Content */}
      {loading ? (
        <div className="loading-spinner">
          <div className="spinner"></div>
        </div>
      ) : viewMode === "list" ? (
        renderCustomerList()
      ) : viewMode === "grid" ? (
        renderCustomerGrid()
      ) : (
        <div className="text-center py-5">
          <FaChartLine size={48} className="text-muted mb-3" />
          <h5 className="text-muted">Customer Analytics</h5>
          <p className="text-muted">
            Advanced analytics and insights would be displayed here
          </p>
        </div>
      )}

      {/* Customer Detail Modal */}
      {showCustomerModal && selectedCustomer && (
        <div
          className="modal fade show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  Customer Details - {selectedCustomer.name}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => {
                    setShowCustomerModal(false);
                    setSelectedCustomer(null);
                  }}
                />
              </div>
              <div className="modal-body">
                <div className="row g-4">
                  <div className="col-md-6">
                    <h6>Basic Information</h6>
                    <div className="mb-3">
                      <small className="text-muted">Name</small>
                      <div className="fw-semibold">{selectedCustomer.name}</div>
                    </div>
                    <div className="mb-3">
                      <small className="text-muted">Email</small>
                      <div className="fw-semibold">
                        {selectedCustomer.email}
                      </div>
                    </div>
                    <div className="mb-3">
                      <small className="text-muted">Phone</small>
                      <div className="fw-semibold">
                        {selectedCustomer.phone}
                      </div>
                    </div>
                    <div className="mb-3">
                      <small className="text-muted">Address</small>
                      <div className="fw-semibold">
                        {selectedCustomer.address}
                      </div>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <h6>Customer Metrics</h6>
                    <div className="mb-3">
                      <small className="text-muted">Total Orders</small>
                      <div className="fw-semibold">
                        {selectedCustomer.totalOrders}
                      </div>
                    </div>
                    <div className="mb-3">
                      <small className="text-muted">Total Spent</small>
                      <div className="fw-semibold text-success">
                        {formatCurrency(selectedCustomer.totalSpent)}
                      </div>
                    </div>
                    <div className="mb-3">
                      <small className="text-muted">Average Order Value</small>
                      <div className="fw-semibold">
                        {formatCurrency(selectedCustomer.averageOrder)}
                      </div>
                    </div>
                    <div className="mb-3">
                      <small className="text-muted">Loyalty Points</small>
                      <div className="fw-semibold text-warning">
                        {selectedCustomer.loyaltyPoints} pts
                      </div>
                    </div>
                  </div>

                  <div className="col-12">
                    <h6>Customer Tags & Notes</h6>
                    <div className="mb-3">
                      <small className="text-muted">Tags</small>
                      <div>
                        {selectedCustomer.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="badge bg-light text-dark me-1"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="mb-3">
                      <small className="text-muted">Notes</small>
                      <div className="fw-semibold">
                        {selectedCustomer.notes}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    setShowCustomerModal(false);
                    setSelectedCustomer(null);
                  }}
                >
                  Close
                </button>
                <button type="button" className="btn btn-primary">
                  Edit Customer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCustomers;
