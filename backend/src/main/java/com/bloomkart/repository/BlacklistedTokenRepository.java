package com.bloomkart.repository;

import com.bloomkart.entity.BlacklistedToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Optional;

@Repository
public interface BlacklistedTokenRepository extends JpaRepository<BlacklistedToken, Long> {

    Optional<BlacklistedToken> findByToken(String token);

    boolean existsByToken(String token);

    @Query("SELECT COUNT(bt) FROM BlacklistedToken bt WHERE bt.userId = :userId")
    long countByUserId(@Param("userId") Long userId);

    @Modifying
    @Query("DELETE FROM BlacklistedToken bt WHERE bt.expiresAt < :now")
    void deleteExpiredTokens(@Param("now") LocalDateTime now);

    @Modifying
    @Query("DELETE FROM BlacklistedToken bt WHERE bt.userId = :userId")
    void deleteByUserId(@Param("userId") Long userId);
} 