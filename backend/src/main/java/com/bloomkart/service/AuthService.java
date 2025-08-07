package com.bloomkart.service;

import com.bloomkart.dto.AuthResponse;
import com.bloomkart.dto.LoginRequest;
import com.bloomkart.dto.ProfileUpdateRequest;
import com.bloomkart.dto.RegisterRequest;
import com.bloomkart.dto.RefreshTokenRequest;
import com.bloomkart.entity.User;
import com.bloomkart.entity.BlacklistedToken;
import com.bloomkart.exception.BusinessException;
import com.bloomkart.repository.UserRepository;
import com.bloomkart.repository.BlacklistedTokenRepository;
import com.bloomkart.security.JwtUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils;
    private final BlacklistedTokenRepository blacklistedTokenRepository;

    @Autowired
    public AuthService(AuthenticationManager authenticationManager,
                      UserRepository userRepository,
                      PasswordEncoder passwordEncoder,
                      JwtUtils jwtUtils,
                      BlacklistedTokenRepository blacklistedTokenRepository) {
        this.authenticationManager = authenticationManager;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtils = jwtUtils;
        this.blacklistedTokenRepository = blacklistedTokenRepository;
    }

    public AuthResponse login(LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);

        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        String accessToken = jwtUtils.generateAccessToken(userDetails);
        String refreshToken = jwtUtils.generateRefreshToken(userDetails);

        User user = userRepository.findByEmail(loginRequest.getEmail())
                .orElseThrow(() -> new BusinessException("User not found", HttpStatus.NOT_FOUND));

        return new AuthResponse(accessToken, refreshToken, user, 86400000); // 24 hours
    }

    public AuthResponse register(RegisterRequest registerRequest) {
        if (userRepository.existsByEmail(registerRequest.getEmail())) {
            throw new RuntimeException("Email is already registered");
        }

        User user = new User();
        user.setName(registerRequest.getName());
        user.setEmail(registerRequest.getEmail());
        user.setPassword(passwordEncoder.encode(registerRequest.getPassword()));
        user.setPhoneNumber(registerRequest.getPhoneNumber());
        user.setRole(User.Role.USER);

        User savedUser = userRepository.save(user);

        String accessToken = jwtUtils.generateAccessToken(savedUser);
        String refreshToken = jwtUtils.generateRefreshToken(savedUser);

        return new AuthResponse(accessToken, refreshToken, savedUser, 86400000);
    }

    public AuthResponse refreshToken(RefreshTokenRequest refreshTokenRequest) {
        String refreshToken = refreshTokenRequest.getRefreshToken();

        // Check if token is blacklisted
        if (blacklistedTokenRepository.existsByToken(refreshToken)) {
            throw new RuntimeException("Token has been invalidated");
        }

        if (!jwtUtils.validateJwtToken(refreshToken) || !jwtUtils.isRefreshToken(refreshToken)) {
            throw new RuntimeException("Invalid refresh token");
        }

        String email = jwtUtils.getUsernameFromToken(refreshToken);
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new BusinessException("User not found", HttpStatus.NOT_FOUND));

        String newAccessToken = jwtUtils.generateAccessToken(user);
        String newRefreshToken = jwtUtils.generateRefreshToken(user);

        // Blacklist the old refresh token
        blacklistToken(refreshToken, user.getId(), "Token refresh");

        return new AuthResponse(newAccessToken, newRefreshToken, user, 86400000);
    }

    public User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new BusinessException("User not found", HttpStatus.NOT_FOUND));
    }

    public User updateProfile(ProfileUpdateRequest profileUpdateRequest) {
        User currentUser = getCurrentUser();

        currentUser.setName(profileUpdateRequest.getName());
        currentUser.setPhoneNumber(profileUpdateRequest.getPhoneNumber());

        return userRepository.save(currentUser);
    }

    public void logout(String refreshToken) {
        if (jwtUtils.validateJwtToken(refreshToken) && jwtUtils.isRefreshToken(refreshToken)) {
            String email = jwtUtils.getUsernameFromToken(refreshToken);
            User user = userRepository.findByEmail(email).orElse(null);

            if (user != null) {
                blacklistToken(refreshToken, user.getId(), "User logout");
            }
        }
    }

    public void logoutAllSessions() {
        User currentUser = getCurrentUser();
        blacklistedTokenRepository.deleteByUserId(currentUser.getId());
    }

    public void logoutAllSessionsForUser(Long userId) {
        blacklistedTokenRepository.deleteByUserId(userId);
    }

    private void blacklistToken(String token, Long userId, String reason) {
        try {
            // Get token expiration from JWT
            java.util.Date expiration = jwtUtils.getExpirationDateFromToken(token);
            LocalDateTime expiresAt = expiration.toInstant()
                    .atZone(java.time.ZoneId.systemDefault())
                    .toLocalDateTime();

            BlacklistedToken blacklistedToken = new BlacklistedToken(token, userId, expiresAt, reason);
            blacklistedTokenRepository.save(blacklistedToken);
        } catch (Exception e) {
            // Log error but don't fail the operation
            System.err.println("Error blacklisting token: " + e.getMessage());
        }
    }

    public boolean isTokenBlacklisted(String token) {
        return blacklistedTokenRepository.existsByToken(token);
    }

    public long getActiveSessionsCount(Long userId) {
        // For now, return a placeholder value since we don't track active sessions
        // In a real implementation, you would track active sessions separately
        return 1; // Assume at least one active session (current user)
    }

    // Scheduled task to clean up expired blacklisted tokens
    @Scheduled(cron = "0 0 2 * * ?") // Run daily at 2 AM
    public void cleanupExpiredBlacklistedTokens() {
        LocalDateTime now = LocalDateTime.now();
        blacklistedTokenRepository.deleteExpiredTokens(now);
    }
} 
