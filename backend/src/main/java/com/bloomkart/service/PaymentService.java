package com.bloomkart.service;

import com.bloomkart.entity.Order;
import com.bloomkart.repository.OrderRepository;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import com.razorpay.Utils;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.Optional;

@Service
public class PaymentService {

    @Value("${razorpay.key.id}")
    private String razorpayKeyId;

    @Value("${razorpay.key.secret}")
    private String razorpayKeySecret;

    private final OrderService orderService;

    public PaymentService(OrderService orderService) {
        this.orderService = orderService;
    }

    /**
     * Creates a Razorpay order and returns its order ID
     */
    public String createPaymentOrder(Order order) {
        try {
            RazorpayClient razorpay = new RazorpayClient(razorpayKeyId, razorpayKeySecret);

            JSONObject options = new JSONObject();
            options.put("amount", order.getTotalAmount().multiply(BigDecimal.valueOf(100)).longValue()); // in paise
            options.put("currency", "INR");
            options.put("receipt", "order_rcptid_" + order.getId());
            options.put("payment_capture", 1); // Auto-capture payment

            com.razorpay.Order razorpayOrder = razorpay.orders.create(options);

            // Save Razorpay order ID to our database for later verification
            order.setPaymentId(razorpayOrder.get("id"));
            order.setPaymentStatus(Order.PaymentStatus.PENDING);
            orderService.createOrder(order);

            return razorpayOrder.get("id");
        } catch (RazorpayException e) {
            throw new RuntimeException("Failed to create payment order", e);
        }
    }

    /**
     * Verifies payment signature
     */
    public boolean verifyPayment(String razorpayOrderId, String razorpayPaymentId, String razorpaySignature) {
        try {
            JSONObject attributes = new JSONObject();
            attributes.put("razorpay_order_id", razorpayOrderId);
            attributes.put("razorpay_payment_id", razorpayPaymentId);
            attributes.put("razorpay_signature", razorpaySignature);

            Utils.verifyPaymentSignature(attributes, razorpayKeySecret);
            return true;
        } catch (RazorpayException e) {
            return false;
        }
    }

    /**
     * Final step after successful payment
     */
    public void processPaymentSuccess(Long orderId, String razorpayPaymentId, String razorpaySignature) {
        Order order = orderService.getOrderById(orderId);

        if (order == null || order.getPaymentId() == null) {
            throw new RuntimeException("Order or Razorpay order ID not found");
        }

        if (verifyPayment(order.getPaymentId(), razorpayPaymentId, razorpaySignature)) {
            orderService.updatePaymentStatus(orderId, Order.PaymentStatus.COMPLETED, razorpayPaymentId);
        } else {
            orderService.updatePaymentStatus(orderId, Order.PaymentStatus.FAILED, null);
            throw new RuntimeException("Payment verification failed");
        }
    }
}
