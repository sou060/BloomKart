package com.bloomkart.repository;

import com.bloomkart.entity.Address;
import com.bloomkart.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AddressRepository extends JpaRepository<Address, Long> {

    // Find all active addresses for a user
    List<Address> findByUserAndIsActiveTrueOrderByIsDefaultDescCreatedAtDesc(User user);

    // Find all addresses for a user (including inactive)
    List<Address> findByUserOrderByIsDefaultDescCreatedAtDesc(User user);

    // Find default address for a user
    Optional<Address> findByUserAndIsDefaultTrueAndIsActiveTrue(User user);

    // Find address by ID and user
    Optional<Address> findByIdAndUserAndIsActiveTrue(Long id, User user);

    // Count active addresses for a user
    long countByUserAndIsActiveTrue(User user);

    // Check if user has any default address
    boolean existsByUserAndIsDefaultTrueAndIsActiveTrue(User user);

    // Set all addresses as non-default for a user
    @Modifying
    @Query("UPDATE Address a SET a.isDefault = false WHERE a.user = :user AND a.isActive = true")
    void clearDefaultAddresses(@Param("user") User user);

    // Set a specific address as default
    @Modifying
    @Query("UPDATE Address a SET a.isDefault = true WHERE a.id = :addressId AND a.user = :user AND a.isActive = true")
    void setDefaultAddress(@Param("addressId") Long addressId, @Param("user") User user);

    // Soft delete address (set as inactive)
    @Modifying
    @Query("UPDATE Address a SET a.isActive = false WHERE a.id = :addressId AND a.user = :user")
    void softDeleteAddress(@Param("addressId") Long addressId, @Param("user") User user);

    // Find addresses by type for a user
    List<Address> findByUserAndAddressTypeAndIsActiveTrueOrderByIsDefaultDescCreatedAtDesc(User user, String addressType);

    // Check if address exists and belongs to user
    boolean existsByIdAndUserAndIsActiveTrue(Long id, User user);
} 