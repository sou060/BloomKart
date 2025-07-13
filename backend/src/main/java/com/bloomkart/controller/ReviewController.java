package com.bloomkart.controller;

import com.bloomkart.entity.Review;
import com.bloomkart.service.ReviewService;
import com.bloomkart.dto.ReviewRequest;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/reviews")
@CrossOrigin(origins = "*")
public class ReviewController {

    @Autowired
    private ReviewService reviewService;

    @GetMapping("/product/{productId}")
    public ResponseEntity<List<Review>> getProductReviews(@PathVariable Long productId) {
        List<Review> reviews = reviewService.getProductReviews(productId);
        return ResponseEntity.ok(reviews);
    }

    @GetMapping("/product/{productId}/stats")
    public ResponseEntity<Map<String, Object>> getProductReviewStats(@PathVariable Long productId) {
        Double averageRating = reviewService.getAverageRating(productId);
        Long reviewCount = reviewService.getReviewCount(productId);
        
        Map<String, Object> stats = Map.of(
            "averageRating", averageRating != null ? averageRating : 0.0,
            "reviewCount", reviewCount != null ? reviewCount : 0L
        );
        
        return ResponseEntity.ok(stats);
    }

    @PostMapping("/product/{productId}")
    public ResponseEntity<Review> createReview(
            @PathVariable Long productId,
            @Valid @RequestBody ReviewRequest reviewRequest) {
        Review review = reviewService.createReview(productId, reviewRequest);
        return ResponseEntity.ok(review);
    }

    @PutMapping("/product/{productId}")
    public ResponseEntity<Review> updateReview(
            @PathVariable Long productId,
            @Valid @RequestBody ReviewRequest reviewRequest) {
        Review review = reviewService.updateReview(productId, reviewRequest);
        return ResponseEntity.ok(review);
    }

    @DeleteMapping("/product/{productId}")
    public ResponseEntity<Void> deleteReview(@PathVariable Long productId) {
        reviewService.deleteReview(productId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/product/{productId}/user-review")
    public ResponseEntity<Review> getUserReview(@PathVariable Long productId) {
        Review review = reviewService.getUserReview(productId);
        return ResponseEntity.ok(review);
    }

    @GetMapping("/product/{productId}/has-reviewed")
    public ResponseEntity<Map<String, Boolean>> hasUserReviewed(@PathVariable Long productId) {
        boolean hasReviewed = reviewService.hasUserReviewed(productId);
        return ResponseEntity.ok(Map.of("hasReviewed", hasReviewed));
    }
} 