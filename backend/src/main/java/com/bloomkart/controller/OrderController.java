package com.bloomkart.controller;

import com.bloomkart.entity.Order;
import com.bloomkart.entity.User;
import com.bloomkart.service.AuthService;
import com.bloomkart.service.OrderService;
import com.bloomkart.service.PaymentService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/orders")
@CrossOrigin(origins = "*")
public class OrderController {

    @Autowired
    private OrderService orderService;

    @Autowired
    private AuthService authService;

    @Autowired
    private PaymentService paymentService;

    @PostMapping
    public ResponseEntity<Order> createOrder(@Valid @RequestBody Order order) {
        Order createdOrder = orderService.createOrder(order);
        
        // Create Razorpay order
        String paymentOrderId = paymentService.createPaymentOrder(createdOrder);
        createdOrder.setPaymentId(paymentOrderId);
        orderService.updatePaymentStatus(createdOrder.getId(), Order.PaymentStatus.PENDING, paymentOrderId);
        
        return ResponseEntity.ok(createdOrder);
    }

    @GetMapping
    public ResponseEntity<List<Order>> getUserOrders() {
        User currentUser = authService.getCurrentUser();
        List<Order> orders = orderService.getUserOrders(currentUser);
        return ResponseEntity.ok(orders);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Order> getOrder(@PathVariable Long id) {
        User currentUser = authService.getCurrentUser();
        Order order = orderService.getUserOrderById(id, currentUser);
        return ResponseEntity.ok(order);
    }

    @PostMapping("/verify-payment")
    public ResponseEntity<Map<String, String>> verifyPayment(@RequestBody Map<String, String> paymentData) {
        Long orderId = Long.parseLong(paymentData.get("orderId"));
        String paymentId = paymentData.get("paymentId");
        String signature = paymentData.get("signature");

        paymentService.processPaymentSuccess(orderId, paymentId, signature);
        
        return ResponseEntity.ok(Map.of("message", "Payment verified successfully"));
    }
} 