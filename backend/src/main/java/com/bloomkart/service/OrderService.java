package com.bloomkart.service;

import com.bloomkart.entity.Order;
import com.bloomkart.entity.OrderItem;
import com.bloomkart.entity.Product;
import com.bloomkart.entity.User;
import com.bloomkart.repository.OrderRepository;
import com.bloomkart.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private AuthService authService;

    public Page<Order> getAllOrders(Pageable pageable) {
        return orderRepository.findAll(pageable);
    }

    public Page<Order> getOrdersByStatus(Order.OrderStatus status, Pageable pageable) {
        return orderRepository.findByStatus(status, pageable);
    }

    public List<Order> getUserOrders(User user) {
        return orderRepository.findByUserOrderByCreatedAtDesc(user);
    }

    public Order getOrderById(Long id) {
        return orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found"));
    }

    public Order getUserOrderById(Long orderId, User user) {
        Order order = getOrderById(orderId);
        if (!order.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Order not found");
        }
        return order;
    }

    @Transactional
    public Order createOrder(Order orderRequest) {
        User currentUser = authService.getCurrentUser();
        orderRequest.setUser(currentUser);

        // Calculate total and validate stock
        BigDecimal total = BigDecimal.ZERO;
        for (OrderItem item : orderRequest.getOrderItems()) {
            Product product = productRepository.findById(item.getProduct().getId())
                    .orElseThrow(() -> new RuntimeException("Product not found"));

            if (product.getStockQuantity() < item.getQuantity()) {
                throw new RuntimeException("Insufficient stock for product: " + product.getName());
            }

            item.setPrice(product.getPrice());
            item.setOrder(orderRequest);
            total = total.add(item.getSubtotal());

            // Update stock
            product.setStockQuantity(product.getStockQuantity() - item.getQuantity());
            productRepository.save(product);
        }

        orderRequest.setTotalAmount(total);
        return orderRepository.save(orderRequest);
    }

    public Order updateOrderStatus(Long orderId, Order.OrderStatus status) {
        Order order = getOrderById(orderId);
        order.setStatus(status);
        return orderRepository.save(order);
    }

    public Order updatePaymentStatus(Long orderId, Order.PaymentStatus paymentStatus, String paymentId) {
        Order order = getOrderById(orderId);
        order.setPaymentStatus(paymentStatus);
        if (paymentId != null) {
            order.setPaymentId(paymentId);
        }
        return orderRepository.save(order);
    }

    public long getOrderCountByStatus(Order.OrderStatus status) {
        return orderRepository.countByStatus(status);
    }

    public BigDecimal getTotalRevenue() {
        return orderRepository.getTotalRevenueSince(java.time.LocalDateTime.now().minusDays(30));
    }

    public long getRecentOrderCount() {
        return orderRepository.countOrdersSince(java.time.LocalDateTime.now().minusDays(7));
    }

    public long getTotalOrderCount() {
        return orderRepository.count();
    }
} 