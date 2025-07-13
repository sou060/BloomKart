package com.bloomkart.service;

import com.bloomkart.dto.AddressRequest;
import com.bloomkart.dto.AddressResponse;
import com.bloomkart.entity.Address;
import com.bloomkart.entity.User;
import com.bloomkart.repository.AddressRepository;
import com.bloomkart.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class AddressService {

    @Autowired
    private AddressRepository addressRepository;

    @Autowired
    private UserRepository userRepository;

    // Get all active addresses for current user
    public List<AddressResponse> getUserAddresses(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<Address> addresses = addressRepository.findByUserAndIsActiveTrueOrderByIsDefaultDescCreatedAtDesc(user);
        return addresses.stream()
                .map(AddressResponse::new)
                .collect(Collectors.toList());
    }

    // Get address by ID for current user
    public AddressResponse getAddressById(Long addressId, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Address address = addressRepository.findByIdAndUserAndIsActiveTrue(addressId, user)
                .orElseThrow(() -> new RuntimeException("Address not found"));

        return new AddressResponse(address);
    }

    // Create new address
    public AddressResponse createAddress(AddressRequest addressRequest, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // If this is the first address, make it default
        if (addressRepository.countByUserAndIsActiveTrue(user) == 0) {
            addressRequest.setDefault(true);
        }

        // If setting as default, clear other default addresses
        if (addressRequest.isDefault()) {
            addressRepository.clearDefaultAddresses(user);
        }

        Address address = new Address();
        address.setUser(user);
        address.setAddressType(addressRequest.getAddressType());
        address.setFullName(addressRequest.getFullName());
        address.setPhoneNumber(addressRequest.getPhoneNumber());
        address.setAddressLine1(addressRequest.getAddressLine1());
        address.setAddressLine2(addressRequest.getAddressLine2());
        address.setCity(addressRequest.getCity());
        address.setState(addressRequest.getState());
        address.setPostalCode(addressRequest.getPostalCode());
        address.setCountry(addressRequest.getCountry());
        address.setDefault(addressRequest.isDefault());
        address.setActive(true);

        Address savedAddress = addressRepository.save(address);
        return new AddressResponse(savedAddress);
    }

    // Update existing address
    public AddressResponse updateAddress(Long addressId, AddressRequest addressRequest, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Address address = addressRepository.findByIdAndUserAndIsActiveTrue(addressId, user)
                .orElseThrow(() -> new RuntimeException("Address not found"));

        // If setting as default, clear other default addresses
        if (addressRequest.isDefault() && !address.isDefault()) {
            addressRepository.clearDefaultAddresses(user);
        }

        address.setAddressType(addressRequest.getAddressType());
        address.setFullName(addressRequest.getFullName());
        address.setPhoneNumber(addressRequest.getPhoneNumber());
        address.setAddressLine1(addressRequest.getAddressLine1());
        address.setAddressLine2(addressRequest.getAddressLine2());
        address.setCity(addressRequest.getCity());
        address.setState(addressRequest.getState());
        address.setPostalCode(addressRequest.getPostalCode());
        address.setCountry(addressRequest.getCountry());
        address.setDefault(addressRequest.isDefault());

        Address updatedAddress = addressRepository.save(address);
        return new AddressResponse(updatedAddress);
    }

    // Delete address (soft delete)
    public void deleteAddress(Long addressId, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Address address = addressRepository.findByIdAndUserAndIsActiveTrue(addressId, user)
                .orElseThrow(() -> new RuntimeException("Address not found"));

        // If this is the default address, don't allow deletion
        if (address.isDefault()) {
            throw new RuntimeException("Cannot delete default address. Please set another address as default first.");
        }

        addressRepository.softDeleteAddress(addressId, user);
    }

    // Set address as default
    public AddressResponse setDefaultAddress(Long addressId, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Address address = addressRepository.findByIdAndUserAndIsActiveTrue(addressId, user)
                .orElseThrow(() -> new RuntimeException("Address not found"));

        // Clear all default addresses
        addressRepository.clearDefaultAddresses(user);

        // Set this address as default
        addressRepository.setDefaultAddress(addressId, user);

        // Refresh the address to get updated data
        Address updatedAddress = addressRepository.findByIdAndUserAndIsActiveTrue(addressId, user)
                .orElseThrow(() -> new RuntimeException("Address not found"));

        return new AddressResponse(updatedAddress);
    }

    // Get default address
    public AddressResponse getDefaultAddress(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Address defaultAddress = addressRepository.findByUserAndIsDefaultTrueAndIsActiveTrue(user)
                .orElseThrow(() -> new RuntimeException("No default address found"));

        return new AddressResponse(defaultAddress);
    }

    // Check if user has any addresses
    public boolean hasAddresses(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return addressRepository.countByUserAndIsActiveTrue(user) > 0;
    }

    // Get address count for user
    public long getAddressCount(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return addressRepository.countByUserAndIsActiveTrue(user);
    }

    // Get addresses by type
    public List<AddressResponse> getAddressesByType(String addressType, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<Address> addresses = addressRepository.findByUserAndAddressTypeAndIsActiveTrueOrderByIsDefaultDescCreatedAtDesc(user, addressType);
        return addresses.stream()
                .map(AddressResponse::new)
                .collect(Collectors.toList());
    }
} 