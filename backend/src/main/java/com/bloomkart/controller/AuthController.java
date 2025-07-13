package com.bloomkart.controller;

import com.bloomkart.dto.AuthResponse;
import com.bloomkart.dto.LoginRequest;
import com.bloomkart.dto.RegisterRequest;
import com.bloomkart.dto.RefreshTokenRequest;
import com.bloomkart.entity.User;
import com.bloomkart.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest loginRequest) {
        AuthResponse response = authService.login(loginRequest);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest registerRequest) {
        AuthResponse response = authService.register(registerRequest);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/refresh")
    public ResponseEntity<AuthResponse> refreshToken(@Valid @RequestBody RefreshTokenRequest refreshTokenRequest) {
        AuthResponse response = authService.refreshToken(refreshTokenRequest);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/logout")
    public ResponseEntity<Map<String, String>> logout(@RequestBody RefreshTokenRequest refreshTokenRequest) {
        authService.logout(refreshTokenRequest.getRefreshToken());
        return ResponseEntity.ok(Map.of("message", "Logged out successfully"));
    }

    @PostMapping("/logout-all")
    public ResponseEntity<Map<String, String>> logoutAllSessions() {
        authService.logoutAllSessions();
        return ResponseEntity.ok(Map.of("message", "All sessions logged out successfully"));
    }

    @GetMapping("/profile")
    public ResponseEntity<User> getProfile() {
        User user = authService.getCurrentUser();
        return ResponseEntity.ok(user);
    }

    @PutMapping("/profile")
    public ResponseEntity<User> updateProfile(@Valid @RequestBody User user) {
        User updatedUser = authService.updateProfile(user);
        return ResponseEntity.ok(updatedUser);
    }

    @GetMapping("/sessions/count")
    public ResponseEntity<Map<String, Long>> getActiveSessionsCount() {
        User user = authService.getCurrentUser();
        long count = authService.getActiveSessionsCount(user.getId());
        return ResponseEntity.ok(Map.of("activeSessions", count));
    }
} 