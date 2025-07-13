package com.bloomkart.repository;

import com.bloomkart.entity.Review;
import com.bloomkart.entity.Product;
import com.bloomkart.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {

    List<Review> findByProductOrderByCreatedAtDesc(Product product);

    Optional<Review> findByUserAndProduct(User user, Product product);

    boolean existsByUserAndProduct(User user, Product product);

    @Query("SELECT AVG(r.rating) FROM Review r WHERE r.product = :product")
    Double getAverageRatingByProduct(@Param("product") Product product);

    @Query("SELECT COUNT(r) FROM Review r WHERE r.product = :product")
    Long getReviewCountByProduct(@Param("product") Product product);

    @Query("SELECT r FROM Review r WHERE r.product = :product ORDER BY r.createdAt DESC")
    List<Review> findRecentReviewsByProduct(@Param("product") Product product, org.springframework.data.domain.Pageable pageable);
} 