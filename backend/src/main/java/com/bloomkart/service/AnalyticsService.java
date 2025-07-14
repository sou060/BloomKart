package com.bloomkart.service;

import com.bloomkart.entity.Order;
import com.bloomkart.entity.Product;
import com.bloomkart.entity.User;
import com.bloomkart.repository.OrderRepository;
import com.bloomkart.repository.ProductRepository;
import com.bloomkart.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class AnalyticsService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProductRepository productRepository;

    public Map<String, Object> getDashboardAnalytics(int days) {
        Map<String, Object> analytics = new HashMap<>();
        
        // Get sales data
        analytics.put("salesData", getSalesData(days));
        
        // Get user growth
        analytics.put("userGrowth", getUserGrowth(12));
        
        // Get top products
        analytics.put("topProducts", getTopProducts(10));
        
        // Get revenue stats
        analytics.put("revenueStats", getRevenueStats(days));
        
        return analytics;
    }

    public Map<String, Object> getSalesData(int days) {
        Map<String, Object> salesData = new HashMap<>();
        List<Map<String, Object>> dailySales = new ArrayList<>();
        
        LocalDate endDate = LocalDate.now();
        LocalDate startDate = endDate.minusDays(days - 1);
        
        // Generate daily sales data
        for (LocalDate date = startDate; !date.isAfter(endDate); date = date.plusDays(1)) {
            Map<String, Object> dayData = new HashMap<>();
            dayData.put("date", date.format(DateTimeFormatter.ISO_LOCAL_DATE));
            
            // Calculate sales for this day
            LocalDateTime dayStart = date.atStartOfDay();
            LocalDateTime dayEnd = date.atTime(23, 59, 59);
            
            BigDecimal dailyRevenue = orderRepository.getRevenueBetweenDates(dayStart, dayEnd);
            dayData.put("sales", dailyRevenue != null ? dailyRevenue.doubleValue() : 0.0);
            
            dailySales.add(dayData);
        }
        
        salesData.put("dailySales", dailySales);
        return salesData;
    }

    public Map<String, Object> getUserGrowth(int months) {
        Map<String, Object> userGrowth = new HashMap<>();
        List<Map<String, Object>> monthlyUsers = new ArrayList<>();
        
        LocalDate endDate = LocalDate.now();
        LocalDate startDate = endDate.minusMonths(months - 1);
        
        // Generate monthly user growth data
        for (LocalDate date = startDate; !date.isAfter(endDate); date = date.plusMonths(1)) {
            Map<String, Object> monthData = new HashMap<>();
            monthData.put("month", date.format(DateTimeFormatter.ofPattern("MMM")));
            
            // Count users registered up to this month
            LocalDateTime monthEnd = date.plusMonths(1).atStartOfDay().minusSeconds(1);
            long userCount = userRepository.countUsersRegisteredBefore(monthEnd);
            monthData.put("users", userCount);
            
            monthlyUsers.add(monthData);
        }
        
        userGrowth.put("monthlyUsers", monthlyUsers);
        return userGrowth;
    }

    public Map<String, Object> getTopProducts(int limit) {
        Map<String, Object> topProducts = new HashMap<>();
        List<Map<String, Object>> products = new ArrayList<>();
        
        // Get top products by sales
        List<Object[]> topProductData = orderRepository.getTopProductsBySales(limit);
        
        for (Object[] data : topProductData) {
            Map<String, Object> product = new HashMap<>();
            product.put("name", data[0]); // Product name
            product.put("sales", data[1]); // Sales count
            product.put("revenue", data[2]); // Revenue
            
            products.add(product);
        }
        
        topProducts.put("products", products);
        return topProducts;
    }

    public Map<String, Object> getRevenueStats(int days) {
        Map<String, Object> revenueStats = new HashMap<>();
        
        LocalDateTime endDate = LocalDateTime.now();
        LocalDateTime startDate = endDate.minusDays(days);
        LocalDateTime previousStartDate = startDate.minusDays(days);
        
        // Current period revenue
        BigDecimal currentRevenue = orderRepository.getRevenueBetweenDates(startDate, endDate);
        currentRevenue = currentRevenue != null ? currentRevenue : BigDecimal.ZERO;
        
        // Previous period revenue
        BigDecimal previousRevenue = orderRepository.getRevenueBetweenDates(previousStartDate, startDate);
        previousRevenue = previousRevenue != null ? previousRevenue : BigDecimal.ZERO;
        
        // Calculate growth percentage
        double growth = 0.0;
        if (previousRevenue.compareTo(BigDecimal.ZERO) > 0) {
            growth = ((currentRevenue.doubleValue() - previousRevenue.doubleValue()) / previousRevenue.doubleValue()) * 100;
        }
        
        // Get total orders
        long totalOrders = orderRepository.countOrdersBetweenDates(startDate, endDate);
        
        // Calculate average order value
        BigDecimal averageOrder = totalOrders > 0 ? currentRevenue.divide(BigDecimal.valueOf(totalOrders), 2, BigDecimal.ROUND_HALF_UP) : BigDecimal.ZERO;
        
        revenueStats.put("currentMonth", currentRevenue.doubleValue());
        revenueStats.put("previousMonth", previousRevenue.doubleValue());
        revenueStats.put("growth", Math.round(growth * 10.0) / 10.0); // Round to 1 decimal place
        revenueStats.put("averageOrder", averageOrder.doubleValue());
        revenueStats.put("totalOrders", totalOrders);
        
        return revenueStats;
    }
} 