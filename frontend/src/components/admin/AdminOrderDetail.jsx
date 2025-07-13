import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../axios";
import { toast } from "react-toastify";
import {
  FaArrowLeft,
  FaBox,
  FaUser,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaCalendarAlt,
  FaMoneyBillWave,
  FaCreditCard,
  FaTruck,
  FaCheckCircle,
  FaTimes,
  FaEdit,
  FaSave,
} from "react-icons/fa";

const AdminOrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [editingStatus, setEditingStatus] = useState(false);
  const [newStatus, setNewStatus] = useState("");

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const fetchOrder = async () => {
    try {
      const response = await api.get(`/admin/orders/${id}`);
      setOrder(response.data);
      setNewStatus(response.data.status);
    } catch (error) {
      console.error("Error fetching order:", error);
      toast.error("Failed to load order details");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async () => {
    setUpdating(true);
    try {
      await api.put(`/admin/orders/${id}/status`, { status: newStatus });
      setOrder((prev) => ({ ...prev, status: newStatus }));
      setEditingStatus(false);
      toast.success("Order status updated successfully");
    } catch (error) {
      console.error("Error updating order status:", error);
      toast.error("Failed to update order status");
    } finally {
      setUpdating(false);
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
        return <FaTimes className="text-danger" />;
      default:
        return <FaClock className="text-secondary" />;
    }
  };

  if (loading) {
    return (
      <div className="loading-spinner">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-5">
        <h3>Order not found</h3>
        <button
          className="btn btn-primary"
          onClick={() => navigate("/admin/orders")}
        >
          Back to Orders
        </button>
      </div>
    );
  }

  return (
    <div className="fade-in">
      {/* Header */}
      <div className="row align-items-center mb-4">
        <div className="col-md-8">
          <div className="d-flex align-items-center">
            <button
              className="btn btn-outline-secondary me-3"
              onClick={() => navigate("/admin/orders")}
            >
              <FaArrowLeft className="me-1" />
              Back
            </button>
            <div>
              <h1 className="text-gradient fw-bold mb-1">Order #{order.id}</h1>
              <p className="text-muted mb-0">
                Placed on {new Date(order.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
        <div className="col-md-4 text-md-end">
          <div className="d-flex gap-2 justify-content-md-end">
            {editingStatus ? (
              <>
                <select
                  className="form-select form-select-sm"
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  style={{ width: "auto" }}
                >
                  <option value="PENDING">Pending</option>
                  <option value="CONFIRMED">Confirmed</option>
                  <option value="SHIPPED">Shipped</option>
                  <option value="DELIVERED">Delivered</option>
                  <option value="CANCELLED">Cancelled</option>
                </select>
                <button
                  className="btn btn-success btn-sm"
                  onClick={handleStatusUpdate}
                  disabled={updating}
                >
                  <FaSave className="me-1" />
                  {updating ? "Saving..." : "Save"}
                </button>
                <button
                  className="btn btn-outline-secondary btn-sm"
                  onClick={() => {
                    setEditingStatus(false);
                    setNewStatus(order.status);
                  }}
                >
                  Cancel
                </button>
              </>
            ) : (
              <button
                className="btn btn-outline-primary btn-sm"
                onClick={() => setEditingStatus(true)}
              >
                <FaEdit className="me-1" />
                Update Status
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="row g-4">
        {/* Order Details */}
        <div className="col-lg-8">
          <div className="card border-radius-custom shadow-custom mb-4">
            <div className="card-header bg-gradient-primary text-white">
              <h5 className="mb-0">
                <FaBox className="me-2" />
                Order Details
              </h5>
            </div>
            <div className="card-body">
              <div className="row g-3">
                <div className="col-md-6">
                  <div className="d-flex align-items-center mb-3">
                    <div className="bg-light rounded-circle p-2 me-3">
                      <FaCalendarAlt className="text-primary" />
                    </div>
                    <div>
                      <small className="text-muted">Order Date</small>
                      <div className="fw-semibold">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="d-flex align-items-center mb-3">
                    <div className="bg-light rounded-circle p-2 me-3">
                      {getStatusIcon(order.status)}
                    </div>
                    <div>
                      <small className="text-muted">Status</small>
                      <div className="fw-semibold">
                        <span
                          className={`badge bg-${getStatusColor(order.status)}`}
                        >
                          {order.status}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="d-flex align-items-center mb-3">
                    <div className="bg-light rounded-circle p-2 me-3">
                      <FaMoneyBillWave className="text-success" />
                    </div>
                    <div>
                      <small className="text-muted">Total Amount</small>
                      <div className="fw-semibold text-success">
                        ₹{order.totalAmount}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="d-flex align-items-center mb-3">
                    <div className="bg-light rounded-circle p-2 me-3">
                      <FaCreditCard className="text-info" />
                    </div>
                    <div>
                      <small className="text-muted">Payment Status</small>
                      <div className="fw-semibold">
                        <span
                          className={`badge bg-${
                            order.paymentStatus === "PAID"
                              ? "success"
                              : "warning"
                          }`}
                        >
                          {order.paymentStatus}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div className="mt-4">
                <h6 className="mb-3">Order Items</h6>
                <div className="table-responsive">
                  <table className="table table-sm">
                    <thead>
                      <tr>
                        <th>Product</th>
                        <th>Price</th>
                        <th>Quantity</th>
                        <th>Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {order.orderItems?.map((item, index) => (
                        <tr key={index}>
                          <td>
                            <div className="d-flex align-items-center">
                              <img
                                src={item.product?.mainImage}
                                alt={item.product?.name}
                                className="rounded me-2"
                                width="40"
                                height="40"
                                style={{ objectFit: "cover" }}
                              />
                              <div>
                                <div className="fw-semibold">
                                  {item.product?.name}
                                </div>
                                <small className="text-muted">
                                  {item.product?.category}
                                </small>
                              </div>
                            </div>
                          </td>
                          <td>₹{item.price}</td>
                          <td>{item.quantity}</td>
                          <td className="fw-semibold">
                            ₹{item.price * item.quantity}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Customer & Delivery Info */}
        <div className="col-lg-4">
          {/* Customer Information */}
          <div className="card border-radius-custom shadow-custom mb-4">
            <div className="card-header bg-gradient-secondary text-white">
              <h5 className="mb-0">
                <FaUser className="me-2" />
                Customer Information
              </h5>
            </div>
            <div className="card-body">
              <div className="d-flex align-items-center mb-3">
                <div className="bg-light rounded-circle p-2 me-3">
                  <FaUser className="text-primary" />
                </div>
                <div>
                  <div className="fw-semibold">{order.user?.name}</div>
                  <small className="text-muted">{order.user?.email}</small>
                </div>
              </div>

              {order.user?.phoneNumber && (
                <div className="d-flex align-items-center mb-3">
                  <div className="bg-light rounded-circle p-2 me-3">
                    <FaPhone className="text-info" />
                  </div>
                  <div>
                    <small className="text-muted">Phone</small>
                    <div className="fw-semibold">{order.user.phoneNumber}</div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Delivery Information */}
          <div className="card border-radius-custom shadow-custom">
            <div className="card-header bg-gradient-primary text-white">
              <h5 className="mb-0">
                <FaMapMarkerAlt className="me-2" />
                Delivery Information
              </h5>
            </div>
            <div className="card-body">
              {order.deliveryDetails ? (
                <>
                  <div className="d-flex align-items-start mb-3">
                    <div className="bg-light rounded-circle p-2 me-3">
                      <FaMapMarkerAlt className="text-danger" />
                    </div>
                    <div>
                      <div className="fw-semibold">
                        {order.deliveryDetails.address}
                      </div>
                      <small className="text-muted">
                        {order.deliveryDetails.city},{" "}
                        {order.deliveryDetails.state}{" "}
                        {order.deliveryDetails.pincode}
                      </small>
                    </div>
                  </div>

                  {order.deliveryDetails.phone && (
                    <div className="d-flex align-items-center mb-3">
                      <div className="bg-light rounded-circle p-2 me-3">
                        <FaPhone className="text-info" />
                      </div>
                      <div>
                        <small className="text-muted">Delivery Phone</small>
                        <div className="fw-semibold">
                          {order.deliveryDetails.phone}
                        </div>
                      </div>
                    </div>
                  )}

                  {order.deliveryDetails.instructions && (
                    <div className="d-flex align-items-start">
                      <div className="bg-light rounded-circle p-2 me-3">
                        <FaEnvelope className="text-warning" />
                      </div>
                      <div>
                        <small className="text-muted">
                          Delivery Instructions
                        </small>
                        <div className="fw-semibold">
                          {order.deliveryDetails.instructions}
                        </div>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center text-muted py-3">
                  <FaMapMarkerAlt size={48} className="mb-3" />
                  <p>No delivery details available</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOrderDetail;
