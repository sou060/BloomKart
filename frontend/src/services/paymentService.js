import api from "../axios";
import { toast } from "react-toastify";

class PaymentService {
  constructor() {
    this.razorpayKeyId =
      import.meta.env.VITE_RAZORPAY_KEY_ID || "rzp_test_your_key_id";
  }

  // Initialize Razorpay payment
  async initializePayment(orderData, user, onSuccess, onFailure) {
    try {
      console.log("Initializing payment with data:", orderData);
      console.log("Razorpay Key ID:", this.razorpayKeyId);

      // Create order in backend
      const orderResponse = await api.post("/orders", orderData);
      const order = orderResponse.data;

      console.log("Order created:", order);

      // Check if Razorpay is available
      if (!window.Razorpay) {
        throw new Error(
          "Razorpay is not loaded. Please check your internet connection."
        );
      }

      // Configure Razorpay options
      const options = {
        key: this.razorpayKeyId,
        amount: orderData.totalAmount * 100, // Convert to paise
        currency: "INR",
        name: "BloomKart",
        description: "Flower Purchase",
        order_id: order.paymentId,
        handler: async (response) => {
          try {
            console.log("Payment response:", response);
            // Verify payment with backend
            await this.verifyPayment(
              order.id,
              response.razorpay_payment_id,
              response.razorpay_signature
            );
            onSuccess(order, response);
          } catch (error) {
            console.error("Payment verification failed:", error);
            onFailure("Payment verification failed");
          }
        },
        prefill: {
          name: user.name,
          email: user.email,
          contact: orderData.deliveryDetails.phoneNumber,
        },
        notes: {
          address: `${orderData.deliveryDetails.address}, ${orderData.deliveryDetails.city}`,
          order_id: order.id.toString(),
        },
        theme: {
          color: "#e91e63",
        },
        modal: {
          ondismiss: () => {
            onFailure("Payment cancelled");
          },
        },
      };

      console.log("Razorpay options:", options);

      // Open Razorpay modal
      const rzp = new window.Razorpay(options);
      rzp.open();

      return order;
    } catch (error) {
      console.error("Error initializing payment:", error);
      throw new Error(`Failed to initialize payment: ${error.message}`);
    }
  }

  // Verify payment with backend
  async verifyPayment(orderId, paymentId, signature) {
    try {
      const response = await api.post("/orders/verify-payment", {
        orderId,
        paymentId,
        signature,
      });
      return response.data;
    } catch (error) {
      console.error("Payment verification error:", error);
      throw new Error("Payment verification failed");
    }
  }

  // Get payment methods for user
  async getPaymentMethods() {
    try {
      const response = await api.get("/payment-methods");
      return response.data;
    } catch (error) {
      console.error("Error fetching payment methods:", error);
      return [];
    }
  }

  // Add new payment method
  async addPaymentMethod(paymentMethodData) {
    try {
      const response = await api.post("/payment-methods", paymentMethodData);
      toast.success("Payment method added successfully");
      return response.data;
    } catch (error) {
      console.error("Error adding payment method:", error);
      toast.error("Failed to add payment method");
      throw error;
    }
  }

  // Remove payment method
  async removePaymentMethod(paymentMethodId) {
    try {
      await api.delete(`/payment-methods/${paymentMethodId}`);
      toast.success("Payment method removed successfully");
    } catch (error) {
      console.error("Error removing payment method:", error);
      toast.error("Failed to remove payment method");
      throw error;
    }
  }

  // Get payment history
  async getPaymentHistory() {
    try {
      const response = await api.get("/payment-history");
      return response.data;
    } catch (error) {
      console.error("Error fetching payment history:", error);
      return [];
    }
  }

  // Process refund
  async processRefund(orderId, amount, reason) {
    try {
      const response = await api.post(`/orders/${orderId}/refund`, {
        amount,
        reason,
      });
      toast.success("Refund request submitted successfully");
      return response.data;
    } catch (error) {
      console.error("Error processing refund:", error);
      toast.error("Failed to process refund");
      throw error;
    }
  }

  // Get payment status
  async getPaymentStatus(orderId) {
    try {
      const response = await api.get(`/orders/${orderId}/payment-status`);
      return response.data;
    } catch (error) {
      console.error("Error fetching payment status:", error);
      throw error;
    }
  }

  // Format amount for display
  formatAmount(amount) {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount);
  }

  // Format amount for Razorpay (in paise)
  formatAmountForRazorpay(amount) {
    return Math.round(amount * 100);
  }

  // Validate payment data
  validatePaymentData(orderData) {
    const errors = [];

    if (!orderData.deliveryDetails) {
      errors.push("Delivery details are required");
    } else {
      const { address, city, state, pincode, phoneNumber } =
        orderData.deliveryDetails;
      if (!address || !city || !state || !pincode || !phoneNumber) {
        errors.push("All delivery details are required");
      }
    }

    if (!orderData.items || orderData.items.length === 0) {
      errors.push("Order must contain at least one item");
    }

    if (!orderData.totalAmount || orderData.totalAmount <= 0) {
      errors.push("Invalid total amount");
    }

    return errors;
  }
}

export default new PaymentService();
