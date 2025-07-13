import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";
import api from "../axios";
import { toast } from "react-toastify";
import {
  FaCreditCard,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
} from "react-icons/fa";

const Checkout = () => {
  const { cart, clearCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [deliveryDetails, setDeliveryDetails] = useState({
    address: "",
    city: "",
    state: "",
    pincode: "",
    phoneNumber: user?.phoneNumber || "",
    deliveryDate: "",
    deliveryTime: "",
    specialInstructions: "",
  });

  const calculateSubtotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const calculateTotal = () => {
    return calculateSubtotal() + 50; // Delivery charge
  };

  const handleInputChange = (e) => {
    setDeliveryDetails({
      ...deliveryDetails,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Create order
      const orderData = {
        deliveryDetails,
        items: cart.map((item) => ({
          productId: item.id,
          quantity: item.quantity,
          price: item.price,
        })),
        totalAmount: calculateTotal(),
      };

      const orderResponse = await api.post("/orders", orderData);
      const order = orderResponse.data;

      // Initialize Razorpay payment
      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY_ID,
        amount: calculateTotal() * 100, // Razorpay expects amount in paise
        currency: "INR",
        name: "BloomKart",
        description: "Flower Purchase",
        order_id: order.paymentOrderId,
        handler: async (response) => {
          try {
            // Verify payment
            await api.post("/orders/verify-payment", {
              orderId: order.id,
              paymentId: response.razorpay_payment_id,
              signature: response.razorpay_signature,
            });

            toast.success("Payment successful! Order placed successfully.");
            clearCart();
            navigate(`/orders/${order.id}`);
          } catch (error) {
            toast.error("Payment verification failed");
          }
        },
        prefill: {
          name: user.name,
          email: user.email,
          contact: deliveryDetails.phoneNumber,
        },
        theme: {
          color: "#e91e63",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("Error creating order:", error);
      toast.error("Failed to create order");
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="container py-5">
        <div className="text-center">
          <h3>Your cart is empty</h3>
          <p>Add some products to your cart before checkout.</p>
          <button
            className="btn btn-primary"
            onClick={() => navigate("/products")}
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <h2 className="mb-4">Checkout</h2>

      <div className="row">
        <div className="col-lg-8">
          <div className="card mb-4">
            <div className="card-header">
              <h5>
                <FaMapMarkerAlt /> Delivery Details
              </h5>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Address</label>
                    <textarea
                      className="form-control"
                      name="address"
                      value={deliveryDetails.address}
                      onChange={handleInputChange}
                      rows="3"
                      required
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">City</label>
                    <input
                      type="text"
                      className="form-control"
                      name="city"
                      value={deliveryDetails.city}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">State</label>
                    <input
                      type="text"
                      className="form-control"
                      name="state"
                      value={deliveryDetails.state}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Pincode</label>
                    <input
                      type="text"
                      className="form-control"
                      name="pincode"
                      value={deliveryDetails.pincode}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Phone Number</label>
                    <input
                      type="tel"
                      className="form-control"
                      name="phoneNumber"
                      value={deliveryDetails.phoneNumber}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Delivery Date</label>
                    <input
                      type="date"
                      className="form-control"
                      name="deliveryDate"
                      value={deliveryDetails.deliveryDate}
                      onChange={handleInputChange}
                      min={new Date().toISOString().split("T")[0]}
                      required
                    />
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Delivery Time</label>
                    <select
                      className="form-select"
                      name="deliveryTime"
                      value={deliveryDetails.deliveryTime}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Select Time</option>
                      <option value="09:00-12:00">09:00 AM - 12:00 PM</option>
                      <option value="12:00-15:00">12:00 PM - 03:00 PM</option>
                      <option value="15:00-18:00">03:00 PM - 06:00 PM</option>
                      <option value="18:00-21:00">06:00 PM - 09:00 PM</option>
                    </select>
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label">Special Instructions</label>
                  <textarea
                    className="form-control"
                    name="specialInstructions"
                    value={deliveryDetails.specialInstructions}
                    onChange={handleInputChange}
                    rows="3"
                    placeholder="Any special delivery instructions..."
                  />
                </div>
              </form>
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="card">
            <div className="card-header">
              <h5>
                <FaCreditCard /> Order Summary
              </h5>
            </div>
            <div className="card-body">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="d-flex justify-content-between mb-2"
                >
                  <div>
                    <strong>{item.name}</strong>
                    <br />
                    <small className="text-muted">Qty: {item.quantity}</small>
                  </div>
                  <span>₹{item.price * item.quantity}</span>
                </div>
              ))}

              <hr />

              <div className="d-flex justify-content-between mb-2">
                <span>Subtotal:</span>
                <span>₹{calculateSubtotal()}</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span>Delivery:</span>
                <span>₹50</span>
              </div>
              <hr />
              <div className="d-flex justify-content-between mb-3">
                <strong>Total:</strong>
                <strong>₹{calculateTotal()}</strong>
              </div>

              <button
                className="btn btn-primary w-100"
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? "Processing..." : "Proceed to Payment"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
