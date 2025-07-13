package com.bloomkart.service;

import com.bloomkart.entity.Review;
import com.bloomkart.entity.Product;
import com.bloomkart.entity.User;
import com.bloomkart.repository.ReviewRepository;
import com.bloomkart.repository.ProductRepository;
import com.bloomkart.dto.ReviewRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ReviewService {

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private AuthService authService;

    public List<Review> getProductReviews(Long productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));
        return reviewRepository.findByProductOrderByCreatedAtDesc(product);
    }

    public Double getAverageRating(Long productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));
        return reviewRepository.getAverageRatingByProduct(product);
    }

    public Long getReviewCount(Long productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));
        return reviewRepository.getReviewCountByProduct(product);
    }

    @Transactional
    public Review createReview(Long productId, ReviewRequest reviewRequest) {
        User currentUser = authService.getCurrentUser();
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        // Check if user already reviewed this product
        if (reviewRepository.existsByUserAndProduct(currentUser, product)) {
            throw new RuntimeException("You have already reviewed this product");
        }

        Review review = new Review();
        review.setUser(currentUser);
        review.setProduct(product);
        review.setRating(reviewRequest.getRating());
        review.setComment(reviewRequest.getComment());

        return reviewRepository.save(review);
    }

    @Transactional
    public Review updateReview(Long productId, ReviewRequest reviewRequest) {
        User currentUser = authService.getCurrentUser();
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        Review existingReview = reviewRepository.findByUserAndProduct(currentUser, product)
                .orElseThrow(() -> new RuntimeException("Review not found"));

        existingReview.setRating(reviewRequest.getRating());
        existingReview.setComment(reviewRequest.getComment());

        return reviewRepository.save(existingReview);
    }

    @Transactional
    public void deleteReview(Long productId) {
        User currentUser = authService.getCurrentUser();
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        Review review = reviewRepository.findByUserAndProduct(currentUser, product)
                .orElseThrow(() -> new RuntimeException("Review not found"));

        reviewRepository.delete(review);
    }

    public boolean hasUserReviewed(Long productId) {
        User currentUser = authService.getCurrentUser();
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));
        return reviewRepository.existsByUserAndProduct(currentUser, product);
    }

    public Review getUserReview(Long productId) {
        User currentUser = authService.getCurrentUser();
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));
        return reviewRepository.findByUserAndProduct(currentUser, product)
                .orElse(null);
    }
} 