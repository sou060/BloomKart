import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../axios";
import {
  FaArrowLeft,
  FaMapMarkerAlt,
  FaPhone,
  FaCalendar,
} from "react-icons/fa";

const OrderDetail = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const fetchOrder = async () => {
    try {
      const response = await api.get(`/orders/${id}`);
      setOrder(response.data);
    } catch (error) {
      console.error("Error fetching order:", error);
    } finally {
      setLoading(false);
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
      <div className="container py-5">
        <div className="text-center">
          <h3>Order not found</h3>
          <Link to="/orders" className="btn btn-primary">
            Back to Orders
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Order #{order.id}</h2>
        <Link to="/orders" className="btn btn-outline-primary">
          <FaArrowLeft /> Back to Orders
        </Link>
      </div>

      <div className="row">
        <div className="col-lg-8">
          {/* Order Items */}
          <div className="card mb-4">
            <div className="card-header">
              <h5>Order Items</h5>
            </div>
            <div className="card-body">
              {order.orderItems.map((item) => (
                <div key={item.id} className="row align-items-center mb-3">
                  <div className="col-md-2">
                    <img
                      src={item.product.mainImage || item.product.images[0]}
                      alt={item.product.name}
                      className="img-fluid rounded"
                      style={{ height: "80px", objectFit: "cover" }}
                    />
                  </div>
                  <div className="col-md-6">
                    <h6>{item.product.name}</h6>
                    <p className="text-muted mb-0">{item.product.category}</p>
                  </div>
                  <div className="col-md-2">
                    <p className="mb-0">Qty: {item.quantity}</p>
                  </div>
                  <div className="col-md-2">
                    <p className="mb-0">₹{item.price}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Delivery Details */}
          <div className="card mb-4">
            <div className="card-header">
              <h5>
                <FaMapMarkerAlt /> Delivery Details
              </h5>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-6">
                  <p>
                    <strong>Address:</strong>
                  </p>
                  <p className="text-muted">
                    {order.deliveryDetails.address}
                    <br />
                    {order.deliveryDetails.city}, {order.deliveryDetails.state}
                    <br />
                    Pincode: {order.deliveryDetails.pincode}
                  </p>
                </div>
                <div className="col-md-6">
                  <p>
                    <strong>Contact:</strong>
                  </p>
                  <p className="text-muted">
                    <FaPhone /> {order.deliveryDetails.phoneNumber}
                    <br />
                    <FaCalendar /> {order.deliveryDetails.deliveryDate}
                    <br />
                    Time: {order.deliveryDetails.deliveryTime}
                  </p>
                </div>
              </div>
              {order.deliveryDetails.specialInstructions && (
                <div className="mt-3">
                  <p>
                    <strong>Special Instructions:</strong>
                  </p>
                  <p className="text-muted">
                    {order.deliveryDetails.specialInstructions}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          {/* Order Summary */}
          <div className="card mb-4">
            <div className="card-header">
              <h5>Order Summary</h5>
            </div>
            <div className="card-body">
              <div className="d-flex justify-content-between mb-2">
                <span>Subtotal:</span>
                <span>₹{order.totalAmount - 50}</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span>Delivery:</span>
                <span>₹50</span>
              </div>
              <hr />
              <div className="d-flex justify-content-between mb-3">
                <strong>Total:</strong>
                <strong>₹{order.totalAmount}</strong>
              </div>
            </div>
          </div>

          {/* Order Status */}
          <div className="card">
            <div className="card-header">
              <h5>Order Status</h5>
            </div>
            <div className="card-body">
              <div className="mb-3">
                <span
                  className={`badge bg-${getStatusColor(order.status)} fs-6`}
                >
                  {order.status}
                </span>
              </div>
              <p>
                <strong>Order Date:</strong>
              </p>
              <p className="text-muted">
                {new Date(order.createdAt).toLocaleDateString()}
              </p>
              {order.updatedAt && order.updatedAt !== order.createdAt && (
                <>
                  <p>
                    <strong>Last Updated:</strong>
                  </p>
                  <p className="text-muted">
                    {new Date(order.updatedAt).toLocaleDateString()}
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
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

export default OrderDetail;
