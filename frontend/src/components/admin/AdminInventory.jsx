import React, { useState, useEffect } from "react";
import api from "../../axios";
import { toast } from "react-toastify";
import {
  FaBoxes,
  FaExclamationTriangle,
  FaPlus,
  FaMinus,
  FaEdit,
  FaEye,
  FaTrash,
  FaDownload,
  FaUpload,
  FaFilter,
  FaSearch,
  FaSort,
  FaCheckCircle,
  FaTimes,
  FaHistory,
  FaChartLine,
} from "react-icons/fa";

const AdminInventory = () => {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedItems, setSelectedItems] = useState([]);
  const [filters, setFilters] = useState({
    category: "",
    stockLevel: "",
    status: "",
    search: "",
  });
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [showLowStock, setShowLowStock] = useState(false);
  const [bulkAction, setBulkAction] = useState("");
  const [editingItem, setEditingItem] = useState(null);
  const [stockAdjustment, setStockAdjustment] = useState({
    quantity: "",
    reason: "",
    type: "add",
  });

  useEffect(() => {
    fetchInventory();
  }, [filters, sortBy, sortOrder]);

  const fetchInventory = async () => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      const mockInventory = [
        {
          id: 1,
          name: "Red Roses",
          category: "Roses",
          currentStock: 45,
          minStock: 50,
          maxStock: 200,
          unitPrice: 500,
          supplier: "Rose Garden Ltd",
          lastUpdated: "2024-01-15",
          status: "low",
          location: "Warehouse A",
          sku: "ROSE-001",
        },
        {
          id: 2,
          name: "White Lilies",
          category: "Lilies",
          currentStock: 120,
          minStock: 30,
          maxStock: 150,
          unitPrice: 400,
          supplier: "Lily Farm Co",
          lastUpdated: "2024-01-14",
          status: "normal",
          location: "Warehouse B",
          sku: "LILY-002",
        },
        {
          id: 3,
          name: "Sunflowers",
          category: "Sunflowers",
          currentStock: 200,
          minStock: 40,
          maxStock: 300,
          unitPrice: 300,
          supplier: "Sunny Fields",
          lastUpdated: "2024-01-13",
          status: "normal",
          location: "Warehouse A",
          sku: "SUN-003",
        },
        {
          id: 4,
          name: "Tulips",
          category: "Tulips",
          currentStock: 25,
          minStock: 50,
          maxStock: 100,
          unitPrice: 350,
          supplier: "Tulip World",
          lastUpdated: "2024-01-12",
          status: "low",
          location: "Warehouse C",
          sku: "TULIP-004",
        },
        {
          id: 5,
          name: "Orchids",
          category: "Orchids",
          currentStock: 15,
          minStock: 20,
          maxStock: 80,
          unitPrice: 800,
          supplier: "Orchid Paradise",
          lastUpdated: "2024-01-11",
          status: "critical",
          location: "Warehouse B",
          sku: "ORCHID-005",
        },
      ];

      setInventory(mockInventory);
    } catch (error) {
      console.error("Error fetching inventory:", error);
      toast.error("Failed to load inventory");
    } finally {
      setLoading(false);
    }
  };

  const handleStockAdjustment = async (itemId, adjustment) => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));
      
      setInventory(prev => prev.map(item => {
        if (item.id === itemId) {
          const newStock = adjustment.type === "add" 
            ? item.currentStock + parseInt(adjustment.quantity)
            : item.currentStock - parseInt(adjustment.quantity);
          
          return {
            ...item,
            currentStock: Math.max(0, newStock),
            lastUpdated: new Date().toISOString().split('T')[0],
            status: getStockStatus(Math.max(0, newStock), item.minStock),
          };
        }
        return item;
      }));

      toast.success(`Stock ${adjustment.type === "add" ? "added" : "removed"} successfully`);
      setStockAdjustment({ quantity: "", reason: "", type: "add" });
      setEditingItem(null);
    } catch (error) {
      console.error("Error adjusting stock:", error);
      toast.error("Failed to adjust stock");
    }
  };

  const getStockStatus = (current, min) => {
    if (current === 0) return "out";
    if (current <= min * 0.5) return "critical";
    if (current <= min) return "low";
    return "normal";
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "normal":
        return "success";
      case "low":
        return "warning";
      case "critical":
        return "danger";
      case "out":
        return "secondary";
      default:
        return "secondary";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "normal":
        return <FaCheckCircle className="text-success" />;
      case "low":
        return <FaExclamationTriangle className="text-warning" />;
      case "critical":
        return <FaExclamationTriangle className="text-danger" />;
      case "out":
        return <FaTimes className="text-secondary" />;
      default:
        return <FaBoxes className="text-secondary" />;
    }
  };

  const handleBulkAction = async () => {
    if (selectedItems.length === 0) {
      toast.warning("Please select items for bulk action");
      return;
    }

    try {
      switch (bulkAction) {
        case "export":
          toast.success("Inventory exported successfully!");
          break;
        case "update":
          toast.success("Selected items updated successfully!");
          break;
        case "delete":
          if (window.confirm("Are you sure you want to delete selected items?")) {
            setInventory(prev => prev.filter(item => !selectedItems.includes(item.id)));
            setSelectedItems([]);
            toast.success("Selected items deleted successfully!");
          }
          break;
        default:
          break;
      }
      setBulkAction("");
    } catch (error) {
      console.error("Error performing bulk action:", error);
      toast.error("Failed to perform bulk action");
    }
  };

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedItems(inventory.map(item => item.id));
    } else {
      setSelectedItems([]);
    }
  };

  const handleSelectItem = (itemId, checked) => {
    if (checked) {
      setSelectedItems(prev => [...prev, itemId]);
    } else {
      setSelectedItems(prev => prev.filter(id => id !== itemId));
    }
  };

  const filteredInventory = inventory
    .filter(item => {
      if (filters.category && item.category !== filters.category) return false;
      if (filters.stockLevel && item.status !== filters.stockLevel) return false;
      if (filters.status && item.status !== filters.status) return false;
      if (filters.search && !item.name.toLowerCase().includes(filters.search.toLowerCase())) return false;
      if (showLowStock && item.status === "normal") return false;
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

  return (
    <div className="fade-in">
      {/* Header */}
      <div className="row align-items-center mb-4">
        <div className="col-md-8">
          <h1 className="text-gradient fw-bold mb-2">Inventory Management</h1>
          <p className="text-muted mb-0">
            Manage product inventory, track stock levels, and handle stock adjustments
          </p>
        </div>
        <div className="col-md-4 text-md-end">
          <div className="d-flex gap-2 justify-content-md-end">
            <button className="btn btn-outline-primary btn-sm">
              <FaDownload className="me-1" />
              Export
            </button>
            <button className="btn btn-primary btn-sm">
              <FaUpload className="me-1" />
              Import
            </button>
          </div>
        </div>
      </div>

      {/* Filters and Controls */}
      <div className="card border-radius-custom shadow-custom mb-4">
        <div className="card-header bg-light">
          <div className="row align-items-center">
            <div className="col-md-6">
              <h6 className="mb-0">
                <FaFilter className="me-2" />
                Filters & Controls
              </h6>
            </div>
            <div className="col-md-6 text-md-end">
              <div className="form-check form-switch d-inline-block me-3">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="showLowStock"
                  checked={showLowStock}
                  onChange={(e) => setShowLowStock(e.target.checked)}
                />
                <label className="form-check-label" htmlFor="showLowStock">
                  Show Low Stock Only
                </label>
              </div>
            </div>
          </div>
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
                  placeholder="Search products..."
                  value={filters.search}
                  onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                />
              </div>
            </div>
            
            <div className="col-md-2">
              <select
                className="form-select"
                value={filters.category}
                onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
              >
                <option value="">All Categories</option>
                <option value="Roses">Roses</option>
                <option value="Lilies">Lilies</option>
                <option value="Sunflowers">Sunflowers</option>
                <option value="Tulips">Tulips</option>
                <option value="Orchids">Orchids</option>
              </select>
            </div>
            
            <div className="col-md-2">
              <select
                className="form-select"
                value={filters.stockLevel}
                onChange={(e) => setFilters(prev => ({ ...prev, stockLevel: e.target.value }))}
              >
                <option value="">All Stock Levels</option>
                <option value="normal">Normal</option>
                <option value="low">Low</option>
                <option value="critical">Critical</option>
                <option value="out">Out of Stock</option>
              </select>
            </div>
            
            <div className="col-md-2">
              <select
                className="form-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="name">Name</option>
                <option value="currentStock">Stock</option>
                <option value="unitPrice">Price</option>
                <option value="lastUpdated">Last Updated</option>
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
                <FaSort />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedItems.length > 0 && (
        <div className="card border-radius-custom shadow-custom mb-4">
          <div className="card-body">
            <div className="row align-items-center">
              <div className="col-md-6">
                <span className="text-muted">
                  {selectedItems.length} item(s) selected
                </span>
              </div>
              <div className="col-md-6 text-md-end">
                <div className="d-flex gap-2 justify-content-md-end">
                  <select
                    className="form-select form-select-sm"
                    style={{ width: "auto" }}
                    value={bulkAction}
                    onChange={(e) => setBulkAction(e.target.value)}
                  >
                    <option value="">Bulk Actions</option>
                    <option value="export">Export Selected</option>
                    <option value="update">Update Selected</option>
                    <option value="delete">Delete Selected</option>
                  </select>
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={handleBulkAction}
                    disabled={!bulkAction}
                  >
                    Apply
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Inventory Table */}
      <div className="card border-radius-custom shadow-custom">
        <div className="card-header bg-gradient-primary text-white">
          <h5 className="mb-0">
            <FaBoxes className="me-2" />
            Inventory Items ({filteredInventory.length})
          </h5>
        </div>
        <div className="card-body">
          {loading ? (
            <div className="loading-spinner">
              <div className="spinner"></div>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>
                      <input
                        type="checkbox"
                        className="form-check-input"
                        onChange={(e) => handleSelectAll(e.target.checked)}
                        checked={selectedItems.length === filteredInventory.length && filteredInventory.length > 0}
                      />
                    </th>
                    <th>Product</th>
                    <th>SKU</th>
                    <th>Category</th>
                    <th>Current Stock</th>
                    <th>Min Stock</th>
                    <th>Status</th>
                    <th>Unit Price</th>
                    <th>Location</th>
                    <th>Last Updated</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredInventory.map((item) => (
                    <tr key={item.id}>
                      <td>
                        <input
                          type="checkbox"
                          className="form-check-input"
                          checked={selectedItems.includes(item.id)}
                          onChange={(e) => handleSelectItem(item.id, e.target.checked)}
                        />
                      </td>
                      <td>
                        <div className="fw-semibold">{item.name}</div>
                        <small className="text-muted">{item.supplier}</small>
                      </td>
                      <td>
                        <span className="badge bg-light text-dark">{item.sku}</span>
                      </td>
                      <td>{item.category}</td>
                      <td>
                        <div className="d-flex align-items-center">
                          <span className="fw-semibold me-2">{item.currentStock}</span>
                          <div className="progress flex-grow-1" style={{ height: "6px" }}>
                            <div
                              className={`progress-bar bg-${getStatusColor(item.status)}`}
                              style={{ width: `${(item.currentStock / item.maxStock) * 100}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      <td>{item.minStock}</td>
                      <td>
                        <div className="d-flex align-items-center">
                          {getStatusIcon(item.status)}
                          <span className={`badge bg-${getStatusColor(item.status)} ms-2`}>
                            {item.status.toUpperCase()}
                          </span>
                        </div>
                      </td>
                      <td className="fw-semibold">₹{item.unitPrice}</td>
                      <td>{item.location}</td>
                      <td>
                        <small className="text-muted">
                          {new Date(item.lastUpdated).toLocaleDateString()}
                        </small>
                      </td>
                      <td>
                        <div className="btn-group btn-group-sm">
                          <button
                            className="btn btn-outline-primary"
                            onClick={() => setEditingItem(item)}
                            title="Adjust Stock"
                          >
                            <FaEdit />
                          </button>
                          <button
                            className="btn btn-outline-info"
                            title="View History"
                          >
                            <FaHistory />
                          </button>
                          <button
                            className="btn btn-outline-danger"
                            title="Delete"
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
          )}
        </div>
      </div>

      {/* Stock Adjustment Modal */}
      {editingItem && (
        <div className="modal fade show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Adjust Stock - {editingItem.name}</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => {
                    setEditingItem(null);
                    setStockAdjustment({ quantity: "", reason: "", type: "add" });
                  }}
                />
              </div>
              <div className="modal-body">
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label">Current Stock</label>
                    <input
                      type="text"
                      className="form-control"
                      value={editingItem.currentStock}
                      readOnly
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Action</label>
                    <select
                      className="form-select"
                      value={stockAdjustment.type}
                      onChange={(e) => setStockAdjustment(prev => ({ ...prev, type: e.target.value }))}
                    >
                      <option value="add">Add Stock</option>
                      <option value="remove">Remove Stock</option>
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Quantity</label>
                    <input
                      type="number"
                      className="form-control"
                      value={stockAdjustment.quantity}
                      onChange={(e) => setStockAdjustment(prev => ({ ...prev, quantity: e.target.value }))}
                      min="1"
                    />
                  </div>
                  <div className="col-12">
                    <label className="form-label">Reason</label>
                    <textarea
                      className="form-control"
                      rows="3"
                      value={stockAdjustment.reason}
                      onChange={(e) => setStockAdjustment(prev => ({ ...prev, reason: e.target.value }))}
                      placeholder="Enter reason for stock adjustment..."
                    />
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    setEditingItem(null);
                    setStockAdjustment({ quantity: "", reason: "", type: "add" });
                  }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => handleStockAdjustment(editingItem.id, stockAdjustment)}
                  disabled={!stockAdjustment.quantity || !stockAdjustment.reason}
                >
                  Update Stock
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminInventory; 