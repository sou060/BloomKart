package com.bloomkart.controller;

import com.bloomkart.entity.Order;
import com.bloomkart.entity.Product;
import com.bloomkart.entity.User;
import com.bloomkart.service.OrderService;
import com.bloomkart.service.ProductService;
import com.bloomkart.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/admin/reports")
@PreAuthorize("hasRole('ADMIN')")
@CrossOrigin(origins = "*")
public class ReportsController {

    @Autowired
    private OrderService orderService;

    @Autowired
    private ProductService productService;

    @Autowired
    private UserService userService;

    @GetMapping("/sales")
    public ResponseEntity<Map<String, Object>> getSalesReport(
            @RequestParam(defaultValue = "30") int days) {
        
        Map<String, Object> report = new HashMap<>();
        
        try {
            // Get all orders (simplified approach)
            Pageable pageable = PageRequest.of(0, 1000); // Get up to 1000 orders
            Page<Order> orderPage = orderService.getAllOrders(pageable);
            List<Order> orders = orderPage.getContent();
            
            // Filter orders for the last N days
            LocalDate endDate = LocalDate.now();
            LocalDate startDate = endDate.minusDays(days);
            
            List<Order> filteredOrders = orders.stream()
                    .filter(order -> {
                        LocalDate orderDate = order.getCreatedAt().toLocalDate();
                        return !orderDate.isBefore(startDate) && !orderDate.isAfter(endDate);
                    })
                    .collect(Collectors.toList());
            
            // Group orders by date
            Map<String, List<Order>> ordersByDate = filteredOrders.stream()
                    .collect(Collectors.groupingBy(order -> 
                        order.getCreatedAt().toLocalDate().format(DateTimeFormatter.ISO_LOCAL_DATE)));
            
            List<Map<String, Object>> salesData = new ArrayList<>();
            
            for (int i = 0; i < days; i++) {
                LocalDate date = endDate.minusDays(i);
                String dateStr = date.format(DateTimeFormatter.ISO_LOCAL_DATE);
                List<Order> dayOrders = ordersByDate.getOrDefault(dateStr, new ArrayList<>());
                
                int orderCount = dayOrders.size();
                BigDecimal revenue = dayOrders.stream()
                        .map(Order::getTotalAmount)
                        .reduce(BigDecimal.ZERO, BigDecimal::add);
                BigDecimal avgOrder = orderCount > 0 ? revenue.divide(BigDecimal.valueOf(orderCount), 2, BigDecimal.ROUND_HALF_UP) : BigDecimal.ZERO;
                
                Map<String, Object> dayData = new HashMap<>();
                dayData.put("date", dateStr);
                dayData.put("orders", orderCount);
                dayData.put("revenue", revenue.doubleValue());
                dayData.put("avgOrder", avgOrder.doubleValue());
                
                salesData.add(dayData);
            }
            
            // Reverse to show oldest first
            Collections.reverse(salesData);
            
            BigDecimal totalRevenue = filteredOrders.stream()
                    .map(Order::getTotalAmount)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);
            BigDecimal avgOrderValue = filteredOrders.size() > 0 ? 
                totalRevenue.divide(BigDecimal.valueOf(filteredOrders.size()), 2, BigDecimal.ROUND_HALF_UP) : BigDecimal.ZERO;
            
            report.put("salesReport", salesData);
            report.put("totalOrders", filteredOrders.size());
            report.put("totalRevenue", totalRevenue.doubleValue());
            report.put("avgOrderValue", avgOrderValue.doubleValue());
            
        } catch (Exception e) {
            report.put("error", "Failed to generate sales report");
        }
        
        return ResponseEntity.ok(report);
    }

    @GetMapping("/users")
    public ResponseEntity<Map<String, Object>> getUserReport() {
        Map<String, Object> report = new HashMap<>();
        
        try {
            Pageable pageable = PageRequest.of(0, 1000); // Get up to 1000 users
            Page<User> userPage = userService.getAllUsers(pageable);
            List<User> users = userPage.getContent();
            
            // Group users by registration month
            Map<String, List<User>> usersByMonth = users.stream()
                    .collect(Collectors.groupingBy(user -> 
                        user.getCreatedAt().getMonth().toString()));
            
            List<Map<String, Object>> userData = new ArrayList<>();
            
            for (String month : usersByMonth.keySet()) {
                List<User> monthUsers = usersByMonth.get(month);
                
                Map<String, Object> monthData = new HashMap<>();
                monthData.put("month", month);
                monthData.put("newUsers", monthUsers.size());
                monthData.put("activeUsers", monthUsers.size()); // Simplified
                monthData.put("totalRevenue", 0.0); // Would need order data per user
                
                userData.add(monthData);
            }
            
            report.put("userReport", userData);
            report.put("totalUsers", users.size());
            
        } catch (Exception e) {
            report.put("error", "Failed to generate user report");
        }
        
        return ResponseEntity.ok(report);
    }

    @GetMapping("/products")
    public ResponseEntity<Map<String, Object>> getProductReport() {
        Map<String, Object> report = new HashMap<>();
        
        try {
            Pageable pageable = PageRequest.of(0, 1000); // Get up to 1000 products
            Page<Product> productPage = productService.getAllProducts(pageable);
            List<Product> products = productPage.getContent();
            
            List<Map<String, Object>> productData = products.stream()
                    .map(product -> {
                        Map<String, Object> data = new HashMap<>();
                        data.put("name", product.getName());
                        data.put("sales", 0); // Would need order item data
                        data.put("revenue", 0.0); // Would need order item data
                        data.put("rating", 4.5); // Would need review data
                        data.put("stock", product.getStockQuantity());
                        return data;
                    })
                    .collect(Collectors.toList());
            
            report.put("productReport", productData);
            report.put("totalProducts", products.size());
            
        } catch (Exception e) {
            report.put("error", "Failed to generate product report");
        }
        
        return ResponseEntity.ok(report);
    }

    @GetMapping("/locations")
    public ResponseEntity<Map<String, Object>> getLocationReport() {
        Map<String, Object> report = new HashMap<>();
        
        try {
            Pageable pageable = PageRequest.of(0, 1000); // Get up to 1000 orders
            Page<Order> orderPage = orderService.getAllOrders(pageable);
            List<Order> orders = orderPage.getContent();
            
            // Group orders by city
            Map<String, List<Order>> ordersByCity = orders.stream()
                    .collect(Collectors.groupingBy(order -> order.getDeliveryDetails().getCity()));
            
            List<Map<String, Object>> locationData = ordersByCity.entrySet().stream()
                    .map(entry -> {
                        String city = entry.getKey();
                        List<Order> cityOrders = entry.getValue();
                        
                        BigDecimal cityRevenue = cityOrders.stream()
                                .map(Order::getTotalAmount)
                                .reduce(BigDecimal.ZERO, BigDecimal::add);
                        
                        Map<String, Object> data = new HashMap<>();
                        data.put("city", city);
                        data.put("orders", cityOrders.size());
                        data.put("revenue", cityRevenue.doubleValue());
                        data.put("customers", cityOrders.stream().map(order -> order.getUser().getId()).distinct().count());
                        
                        return data;
                    })
                    .sorted((a, b) -> Double.compare((Double) b.get("revenue"), (Double) a.get("revenue")))
                    .collect(Collectors.toList());
            
            report.put("locationReport", locationData);
            
        } catch (Exception e) {
            report.put("error", "Failed to generate location report");
        }
        
        return ResponseEntity.ok(report);
    }

    @GetMapping("/dashboard")
    public ResponseEntity<Map<String, Object>> getDashboardReport() {
        Map<String, Object> report = new HashMap<>();
        
        try {
            // Get all reports
            ResponseEntity<Map<String, Object>> salesResponse = getSalesReport(30);
            ResponseEntity<Map<String, Object>> usersResponse = getUserReport();
            ResponseEntity<Map<String, Object>> productsResponse = getProductReport();
            ResponseEntity<Map<String, Object>> locationsResponse = getLocationReport();
            
            report.put("sales", salesResponse.getBody());
            report.put("users", usersResponse.getBody());
            report.put("products", productsResponse.getBody());
            report.put("locations", locationsResponse.getBody());
            
        } catch (Exception e) {
            report.put("error", "Failed to generate dashboard report");
        }
        
        return ResponseEntity.ok(report);
    }
} 