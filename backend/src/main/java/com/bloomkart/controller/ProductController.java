package com.bloomkart.controller;

import com.bloomkart.entity.Product;
import com.bloomkart.service.AuditLogService;
import com.bloomkart.service.ProductService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.util.List;
import org.springframework.security.core.context.SecurityContextHolder;

@RestController
@RequestMapping("/products")
public class ProductController {

    @Autowired
    private ProductService productService;

    @Autowired
    private AuditLogService auditLogService;

    @GetMapping
    public ResponseEntity<Page<Product>> getProducts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(required = false) Boolean isFresh,
            @RequestParam(required = false) String search) {

        Pageable pageable = PageRequest.of(page, size);
        Page<Product> products = productService.getProductsWithFilters(category, minPrice, maxPrice, isFresh, search, pageable);
        return ResponseEntity.ok(products);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Product> getProduct(@PathVariable Long id) {
        Product product = productService.getProductById(id);
        return ResponseEntity.ok(product);
    }

    @GetMapping("/featured")
    public ResponseEntity<List<Product>> getFeaturedProducts() {
        List<Product> products = productService.getFeaturedProducts();
        return ResponseEntity.ok(products);
    }

    @GetMapping("/categories")
    public ResponseEntity<List<String>> getCategories() {
        List<String> categories = productService.getAllCategories();
        return ResponseEntity.ok(categories);
    }

    @PostMapping
    public ResponseEntity<Product> createProduct(
            @Valid @RequestPart("product") Product product,
            @RequestPart(value = "images", required = false) List<MultipartFile> images) {
        Product createdProduct = productService.createProduct(product, images);
        String adminEmail = SecurityContextHolder.getContext().getAuthentication().getName();
        auditLogService.logAction(
            "CREATE_PRODUCT",
            "Created product: " + createdProduct.getName() + " (ID: " + createdProduct.getId() + ")",
            adminEmail
        );
        return ResponseEntity.ok(createdProduct);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Product> updateProduct(
            @PathVariable Long id,
            @Valid @RequestPart("product") Product product,
            @RequestPart(value = "newImages", required = false) List<MultipartFile> newImages) {
        Product updatedProduct = productService.updateProduct(id, product, newImages);
        String adminEmail = SecurityContextHolder.getContext().getAuthentication().getName();
        auditLogService.logAction(
            "UPDATE_PRODUCT",
            "Updated product: " + updatedProduct.getName() + " (ID: " + updatedProduct.getId() + ")",
            adminEmail
        );
        return ResponseEntity.ok(updatedProduct);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
        String adminEmail = SecurityContextHolder.getContext().getAuthentication().getName();
        auditLogService.logAction(
            "DELETE_PRODUCT",
            "Deleted product with ID: " + id,
            adminEmail
        );
        return ResponseEntity.noContent().build();
    }
} 