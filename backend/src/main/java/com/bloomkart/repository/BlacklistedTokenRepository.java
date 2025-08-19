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

    /**
     * Finds a blacklisted token by its token string.
     * @param token The JWT token string.
     * @return An Optional containing the BlacklistedToken if found.
     */
    Optional<BlacklistedToken> findByToken(String token);

    /**
     * Checks if a token exists in the blacklist.
     * This is more efficient than findByToken when you only need to know if it exists.
     * @param token The JWT token string.
     * @return true if the token is blacklisted, false otherwise.
     */
    boolean existsByToken(String token);

    /**
     * Counts the number of active tokens for a specific user.
     * Can be used to enforce a limit on concurrent sessions.
     * @param userId The ID of the user.
     * @return The count of blacklisted (active) tokens for the user.
     */
    @Query("SELECT COUNT(bt) FROM BlacklistedToken bt WHERE bt.userId = :userId")
    long countByUserId(@Param("userId") Long userId);

    /**
     * Deletes all tokens from the blacklist that have expired.
     * This should be run periodically by a scheduled task to keep the table clean.
     * @param now The current date and time.
     */
    @Modifying
    @Query("DELETE FROM BlacklistedToken bt WHERE bt.expiresAt < :now")
    void deleteExpiredTokens(@Param("now") LocalDateTime now);

    /**
     * Deletes all tokens associated with a specific user ID.
     * Useful for "log out from all devices" functionality or when a user is deleted.
     * @param userId The ID of the user whose tokens should be deleted.
     */
    @Modifying
    @Query("DELETE FROM BlacklistedToken bt WHERE bt.userId = :userId")
    void deleteByUserId(@Param("userId") Long userId);
} 