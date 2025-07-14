package com.bloomkart.controller;

import com.bloomkart.entity.Product;
import com.bloomkart.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/admin/inventory")
@PreAuthorize("hasRole('ADMIN')")
@CrossOrigin(origins = "*")
public class InventoryController {

    @Autowired
    private ProductService productService;

    @GetMapping
    public ResponseEntity<Page<Product>> getInventory(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String search) {
        
        Pageable pageable = PageRequest.of(page, size);
        Page<Product> products;
        
        if (category != null && !category.isEmpty()) {
            products = productService.getProductsByCategory(category, pageable);
        } else if (search != null && !search.isEmpty()) {
            products = productService.searchProducts(search, pageable);
        } else {
            products = productService.getAllProducts(pageable);
        }
        
        return ResponseEntity.ok(products);
    }

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getInventoryStats() {
        Map<String, Object> stats = new HashMap<>();
        
        long totalProducts = productService.getTotalProductCount();
        long outOfStock = productService.getOutOfStockCount();
        long lowStock = productService.getLowStockCount();
        long inStock = productService.getInStockCount();
        
        stats.put("totalProducts", totalProducts);
        stats.put("outOfStock", outOfStock);
        stats.put("lowStock", lowStock);
        stats.put("inStock", inStock);
        stats.put("stockUtilization", totalProducts > 0 ? (double) inStock / totalProducts * 100 : 0);
        
        return ResponseEntity.ok(stats);
    }

    @PutMapping("/{id}/stock")
    public ResponseEntity<Product> updateStock(
            @PathVariable Long id,
            @RequestBody Map<String, Object> stockUpdate) {
        
        Integer newQuantity = (Integer) stockUpdate.get("stockQuantity");
        if (newQuantity == null || newQuantity < 0) {
            return ResponseEntity.badRequest().build();
        }
        
        Product product = productService.getProductById(id);
        product.setStockQuantity(newQuantity);
        Product updatedProduct = productService.updateProduct(id, product, null);
        
        return ResponseEntity.ok(updatedProduct);
    }

    @GetMapping("/low-stock")
    public ResponseEntity<Page<Product>> getLowStockProducts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        Pageable pageable = PageRequest.of(page, size);
        Page<Product> lowStockProducts = productService.getLowStockProducts(pageable);
        return ResponseEntity.ok(lowStockProducts);
    }

    @GetMapping("/out-of-stock")
    public ResponseEntity<Page<Product>> getOutOfStockProducts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        Pageable pageable = PageRequest.of(page, size);
        Page<Product> outOfStockProducts = productService.getOutOfStockProducts(pageable);
        return ResponseEntity.ok(outOfStockProducts);
    }
} 