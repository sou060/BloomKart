package com.bloomkart.service;

import com.bloomkart.entity.PaymentMethod;
import com.bloomkart.entity.User;
import com.bloomkart.repository.PaymentMethodRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class PaymentMethodService {

    @Autowired
    private PaymentMethodRepository paymentMethodRepository;

    @Autowired
    private AuthService authService;

    public List<PaymentMethod> getUserPaymentMethods() {
        User currentUser = authService.getCurrentUser();
        return paymentMethodRepository.findByUserAndIsActiveTrueOrderByIsDefaultDescCreatedAtDesc(currentUser);
    }

    @Transactional
    public PaymentMethod addPaymentMethod(PaymentMethod paymentMethod) {
        User currentUser = authService.getCurrentUser();
        paymentMethod.setUser(currentUser);

        // Check if card already exists
        if (paymentMethodRepository.existsByUserAndCardNumberAndIsActiveTrue(currentUser, paymentMethod.getCardNumber())) {
            throw new RuntimeException("Payment method already exists");
        }

        // If this is the first payment method or user wants to set as default
        if (paymentMethod.getIsDefault() || paymentMethodRepository.countActivePaymentMethodsByUser(currentUser) == 0) {
            // Remove default from other payment methods
            List<PaymentMethod> existingMethods = paymentMethodRepository.findByUserAndIsActiveTrueOrderByIsDefaultDescCreatedAtDesc(currentUser);
            for (PaymentMethod method : existingMethods) {
                method.setIsDefault(false);
                paymentMethodRepository.save(method);
            }
            paymentMethod.setIsDefault(true);
        }

        return paymentMethodRepository.save(paymentMethod);
    }

    @Transactional
    public void removePaymentMethod(Long paymentMethodId) {
        User currentUser = authService.getCurrentUser();
        PaymentMethod paymentMethod = paymentMethodRepository.findById(paymentMethodId)
                .orElseThrow(() -> new RuntimeException("Payment method not found"));

        if (!paymentMethod.getUser().getId().equals(currentUser.getId())) {
            throw new RuntimeException("Payment method not found");
        }

        // If removing default payment method, set another one as default
        if (paymentMethod.getIsDefault()) {
            List<PaymentMethod> otherMethods = paymentMethodRepository.findByUserAndIsActiveTrueOrderByIsDefaultDescCreatedAtDesc(currentUser);
            otherMethods.removeIf(method -> method.getId().equals(paymentMethodId));
            
            if (!otherMethods.isEmpty()) {
                PaymentMethod newDefault = otherMethods.get(0);
                newDefault.setIsDefault(true);
                paymentMethodRepository.save(newDefault);
            }
        }

        paymentMethod.setIsActive(false);
        paymentMethodRepository.save(paymentMethod);
    }

    @Transactional
    public PaymentMethod setDefaultPaymentMethod(Long paymentMethodId) {
        User currentUser = authService.getCurrentUser();
        PaymentMethod paymentMethod = paymentMethodRepository.findById(paymentMethodId)
                .orElseThrow(() -> new RuntimeException("Payment method not found"));

        if (!paymentMethod.getUser().getId().equals(currentUser.getId())) {
            throw new RuntimeException("Payment method not found");
        }

        // Remove default from all other payment methods
        List<PaymentMethod> allMethods = paymentMethodRepository.findByUserAndIsActiveTrueOrderByIsDefaultDescCreatedAtDesc(currentUser);
        for (PaymentMethod method : allMethods) {
            method.setIsDefault(false);
            paymentMethodRepository.save(method);
        }

        // Set the selected method as default
        paymentMethod.setIsDefault(true);
        return paymentMethodRepository.save(paymentMethod);
    }

    public PaymentMethod getDefaultPaymentMethod() {
        User currentUser = authService.getCurrentUser();
        return paymentMethodRepository.findDefaultPaymentMethod(currentUser)
                .orElse(null);
    }

    public List<PaymentMethod> getValidPaymentMethods() {
        User currentUser = authService.getCurrentUser();
        List<PaymentMethod> allMethods = paymentMethodRepository.findValidPaymentMethods(currentUser);
        // Filter out expired cards in service layer
        return allMethods.stream()
                .filter(method -> !method.isExpired())
                .toList();
    }

    public boolean hasValidPaymentMethods() {
        User currentUser = authService.getCurrentUser();
        return paymentMethodRepository.countActivePaymentMethodsByUser(currentUser) > 0;
    }
} 