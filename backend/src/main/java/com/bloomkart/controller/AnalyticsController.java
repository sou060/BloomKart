package com.bloomkart.controller;

import com.bloomkart.service.AnalyticsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/admin/analytics")
@PreAuthorize("hasRole('ADMIN')")
@CrossOrigin(origins = "*")
public class AnalyticsController {

    @Autowired
    private AnalyticsService analyticsService;

    @GetMapping("/dashboard")
    public ResponseEntity<Map<String, Object>> getDashboardAnalytics(
            @RequestParam(defaultValue = "30") int days) {
        Map<String, Object> analytics = analyticsService.getDashboardAnalytics(days);
        return ResponseEntity.ok(analytics);
    }

    @GetMapping("/sales")
    public ResponseEntity<Map<String, Object>> getSalesData(
            @RequestParam(defaultValue = "30") int days) {
        Map<String, Object> salesData = analyticsService.getSalesData(days);
        return ResponseEntity.ok(salesData);
    }

    @GetMapping("/users")
    public ResponseEntity<Map<String, Object>> getUserGrowth(
            @RequestParam(defaultValue = "12") int months) {
        Map<String, Object> userGrowth = analyticsService.getUserGrowth(months);
        return ResponseEntity.ok(userGrowth);
    }

    @GetMapping("/products")
    public ResponseEntity<Map<String, Object>> getTopProducts(
            @RequestParam(defaultValue = "10") int limit) {
        Map<String, Object> topProducts = analyticsService.getTopProducts(limit);
        return ResponseEntity.ok(topProducts);
    }

    @GetMapping("/revenue")
    public ResponseEntity<Map<String, Object>> getRevenueStats(
            @RequestParam(defaultValue = "30") int days) {
        Map<String, Object> revenueStats = analyticsService.getRevenueStats(days);
        return ResponseEntity.ok(revenueStats);
    }
} 