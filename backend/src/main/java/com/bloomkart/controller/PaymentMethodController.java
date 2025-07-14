package com.bloomkart.controller;

import com.bloomkart.entity.PaymentMethod;
import com.bloomkart.service.PaymentMethodService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/payment-methods")
@CrossOrigin(origins = "*")
public class PaymentMethodController {

    @Autowired
    private PaymentMethodService paymentMethodService;

    @GetMapping
    public ResponseEntity<List<PaymentMethod>> getUserPaymentMethods() {
        List<PaymentMethod> paymentMethods = paymentMethodService.getUserPaymentMethods();
        return ResponseEntity.ok(paymentMethods);
    }

    @PostMapping
    public ResponseEntity<PaymentMethod> addPaymentMethod(@Valid @RequestBody PaymentMethod paymentMethod) {
        PaymentMethod savedPaymentMethod = paymentMethodService.addPaymentMethod(paymentMethod);
        return ResponseEntity.ok(savedPaymentMethod);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> removePaymentMethod(@PathVariable Long id) {
        paymentMethodService.removePaymentMethod(id);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{id}/default")
    public ResponseEntity<PaymentMethod> setDefaultPaymentMethod(@PathVariable Long id) {
        PaymentMethod defaultPaymentMethod = paymentMethodService.setDefaultPaymentMethod(id);
        return ResponseEntity.ok(defaultPaymentMethod);
    }

    @GetMapping("/default")
    public ResponseEntity<PaymentMethod> getDefaultPaymentMethod() {
        PaymentMethod defaultPaymentMethod = paymentMethodService.getDefaultPaymentMethod();
        return ResponseEntity.ok(defaultPaymentMethod);
    }

    @GetMapping("/valid")
    public ResponseEntity<List<PaymentMethod>> getValidPaymentMethods() {
        List<PaymentMethod> validPaymentMethods = paymentMethodService.getValidPaymentMethods();
        return ResponseEntity.ok(validPaymentMethods);
    }
} 