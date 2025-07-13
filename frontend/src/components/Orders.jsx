import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../axios";
import { FaEye } from "react-icons/fa";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await api.get("/orders");
      setOrders(response.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
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

  return (
    <div className="container py-5">
      <h2 className="mb-4">My Orders</h2>

      {orders.length === 0 ? (
        <div className="text-center">
          <h4>No orders found</h4>
          <p>You haven't placed any orders yet.</p>
          <Link to="/products" className="btn btn-primary">
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="row">
          {orders.map((order) => (
            <div key={order.id} className="col-12 mb-4">
              <div className="card">
                <div className="card-header d-flex justify-content-between align-items-center">
                  <h5 className="mb-0">Order #{order.id}</h5>
                  <span className={`badge bg-${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                </div>
                <div className="card-body">
                  <div className="row">
                    <div className="col-md-6">
                      <p>
                        <strong>Order Date:</strong>{" "}
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                      <p>
                        <strong>Total Amount:</strong> ₹{order.totalAmount}
                      </p>
                      <p>
                        <strong>Items:</strong> {order.orderItems.length} items
                      </p>
                    </div>
                    <div className="col-md-6">
                      <p>
                        <strong>Delivery Address:</strong>
                      </p>
                      <p className="text-muted">
                        {order.deliveryDetails.address}
                        <br />
                        {order.deliveryDetails.city},{" "}
                        {order.deliveryDetails.state}{" "}
                        {order.deliveryDetails.pincode}
                      </p>
                    </div>
                  </div>
                  <div className="mt-3">
                    <Link
                      to={`/orders/${order.id}`}
                      className="btn btn-outline-primary btn-sm"
                    >
                      <FaEye /> View Details
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
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

export default Orders;
