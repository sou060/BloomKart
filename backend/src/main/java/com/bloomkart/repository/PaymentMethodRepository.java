package com.bloomkart.repository;

import com.bloomkart.entity.PaymentMethod;
import com.bloomkart.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PaymentMethodRepository extends JpaRepository<PaymentMethod, Long> {

    List<PaymentMethod> findByUserAndIsActiveTrueOrderByIsDefaultDescCreatedAtDesc(User user);

    Optional<PaymentMethod> findByUserAndIsDefaultTrueAndIsActiveTrue(User user);

    @Query("SELECT pm FROM PaymentMethod pm WHERE pm.user = :user AND pm.isActive = true AND pm.isDefault = true")
    Optional<PaymentMethod> findDefaultPaymentMethod(@Param("user") User user);

    @Query("SELECT COUNT(pm) FROM PaymentMethod pm WHERE pm.user = :user AND pm.isActive = true")
    long countActivePaymentMethodsByUser(@Param("user") User user);

    @Query("SELECT pm FROM PaymentMethod pm WHERE pm.user = :user AND pm.isActive = true")
    List<PaymentMethod> findValidPaymentMethods(@Param("user") User user);

    boolean existsByUserAndCardNumberAndIsActiveTrue(User user, String cardNumber);
} 