package com.bloomkart.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.Map;

@RestController
@RequestMapping("/")
public class RootController {

    @GetMapping
    public ResponseEntity<Map<String, Object>> getApiInfo() {
        Map<String, Object> response = Map.of(
            "service", "BloomKart Flower Ecommerce API",
            "status", "running",
            "timestamp", LocalDateTime.now(),
            "version", "1.0.0",
            "endpoints", Map.of(
                "auth", "/api/auth",
                "products", "/api/products", 
                "orders", "/api/orders",
                "addresses", "/api/addresses",
                "reviews", "/api/reviews",
                "upload", "/api/upload",
                "admin", "/api/admin"
            )
        );
        return ResponseEntity.ok(response);
    }
}