package com.bloomkart.controller;

import com.bloomkart.dto.AddressRequest;
import com.bloomkart.dto.AddressResponse;
import com.bloomkart.service.AddressService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/addresses")
@CrossOrigin(origins = "*")
public class AddressController {

    @Autowired
    private AddressService addressService;

    // Get all addresses for current user
    @GetMapping
    public ResponseEntity<List<AddressResponse>> getUserAddresses() {
        String userEmail = getCurrentUserEmail();
        List<AddressResponse> addresses = addressService.getUserAddresses(userEmail);
        return ResponseEntity.ok(addresses);
    }

    // Get address by ID
    @GetMapping("/{id}")
    public ResponseEntity<AddressResponse> getAddressById(@PathVariable Long id) {
        String userEmail = getCurrentUserEmail();
        AddressResponse address = addressService.getAddressById(id, userEmail);
        return ResponseEntity.ok(address);
    }

    // Create new address
    @PostMapping
    public ResponseEntity<AddressResponse> createAddress(@Valid @RequestBody AddressRequest addressRequest) {
        String userEmail = getCurrentUserEmail();
        AddressResponse address = addressService.createAddress(addressRequest, userEmail);
        return ResponseEntity.status(HttpStatus.CREATED).body(address);
    }

    // Update existing address
    @PutMapping("/{id}")
    public ResponseEntity<AddressResponse> updateAddress(@PathVariable Long id, 
                                                        @Valid @RequestBody AddressRequest addressRequest) {
        String userEmail = getCurrentUserEmail();
        AddressResponse address = addressService.updateAddress(id, addressRequest, userEmail);
        return ResponseEntity.ok(address);
    }

    // Delete address
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteAddress(@PathVariable Long id) {
        String userEmail = getCurrentUserEmail();
        addressService.deleteAddress(id, userEmail);
        return ResponseEntity.ok(Map.of("message", "Address deleted successfully"));
    }

    // Set address as default
    @PutMapping("/{id}/default")
    public ResponseEntity<AddressResponse> setDefaultAddress(@PathVariable Long id) {
        String userEmail = getCurrentUserEmail();
        AddressResponse address = addressService.setDefaultAddress(id, userEmail);
        return ResponseEntity.ok(address);
    }

    // Get default address
    @GetMapping("/default")
    public ResponseEntity<AddressResponse> getDefaultAddress() {
        String userEmail = getCurrentUserEmail();
        AddressResponse address = addressService.getDefaultAddress(userEmail);
        return ResponseEntity.ok(address);
    }

    // Get addresses by type
    @GetMapping("/type/{addressType}")
    public ResponseEntity<List<AddressResponse>> getAddressesByType(@PathVariable String addressType) {
        String userEmail = getCurrentUserEmail();
        List<AddressResponse> addresses = addressService.getAddressesByType(addressType, userEmail);
        return ResponseEntity.ok(addresses);
    }

    // Get address count
    @GetMapping("/count")
    public ResponseEntity<Map<String, Long>> getAddressCount() {
        String userEmail = getCurrentUserEmail();
        long count = addressService.getAddressCount(userEmail);
        return ResponseEntity.ok(Map.of("count", count));
    }

    // Check if user has addresses
    @GetMapping("/has-addresses")
    public ResponseEntity<Map<String, Boolean>> hasAddresses() {
        String userEmail = getCurrentUserEmail();
        boolean hasAddresses = addressService.hasAddresses(userEmail);
        return ResponseEntity.ok(Map.of("hasAddresses", hasAddresses));
    }

    // Helper method to get current user email
    private String getCurrentUserEmail() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof org.springframework.security.core.userdetails.UserDetails) {
            return ((org.springframework.security.core.userdetails.UserDetails) authentication.getPrincipal()).getUsername();
        }
        throw new RuntimeException("User not authenticated");
    }
} 