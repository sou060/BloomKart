package com.bloomkart.service;

import com.bloomkart.dto.AuthResponse;
import com.bloomkart.dto.LoginRequest;
import com.bloomkart.dto.RegisterRequest;
import com.bloomkart.dto.RefreshTokenRequest;
import com.bloomkart.entity.User;
import com.bloomkart.entity.BlacklistedToken;
import com.bloomkart.repository.UserRepository;
import com.bloomkart.repository.BlacklistedTokenRepository;
import com.bloomkart.security.JwtUtils;
import org.springframework.beans.factory.annotation.Autowired;
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
import java.util.UUID;

@Service
public class AuthService {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtils jwtUtils;

    @Autowired
    private BlacklistedTokenRepository blacklistedTokenRepository;

    @Autowired
    private EmailService emailService;

    public AuthResponse login(LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        String accessToken = jwtUtils.generateAccessToken(userDetails);
        String refreshToken = jwtUtils.generateRefreshToken(userDetails);

        User user = userRepository.findByEmail(loginRequest.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

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
        user.setEnabled(false); // Require email verification
        String token = UUID.randomUUID().toString();
        user.setVerificationToken(token);

        User savedUser = userRepository.save(user);

        // Send verification email
        String verifyUrl = "http://localhost:8080/api/auth/verify?token=" + token;
        String subject = "Verify your BloomKart account";
        String body = "Welcome to BloomKart! Please verify your email by clicking the link: " + verifyUrl;
        emailService.sendEmail(user.getEmail(), subject, body);

        return new AuthResponse(null, null, savedUser, 0); // No tokens until verified
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
                .orElseThrow(() -> new RuntimeException("User not found"));

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
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public User updateProfile(User userUpdate) {
        User currentUser = getCurrentUser();
        
        currentUser.setName(userUpdate.getName());
        currentUser.setPhoneNumber(userUpdate.getPhoneNumber());
        
        return userRepository.save(currentUser);
    }

    public void logout(String refreshToken) {
        System.out.println("Logout called with token: " + refreshToken);
        if (jwtUtils.validateJwtToken(refreshToken) && jwtUtils.isRefreshToken(refreshToken)) {
            String email = jwtUtils.getUsernameFromToken(refreshToken);
            System.out.println("Token valid, user email: " + email);
            User user = userRepository.findByEmail(email).orElse(null);

            if (user != null) {
                System.out.println("User found, blacklisting token...");
                blacklistToken(refreshToken, user.getId(), "User logout");
                System.out.println("Token blacklisted.");
            } else {
                System.out.println("User not found for email: " + email);
            }
        } else {
            System.out.println("Invalid or non-refresh token.");
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

    public String verifyEmail(String token) {
        User user = userRepository.findAll().stream()
            .filter(u -> token.equals(u.getVerificationToken()))
            .findFirst()
            .orElseThrow(() -> new RuntimeException("Invalid or expired verification token"));
        user.setEnabled(true);
        user.setVerificationToken(null);
        userRepository.save(user);
        return "Email verified successfully. You can now log in.";
    }
} 