package com.bloomkart.dto;

import com.bloomkart.entity.User;

public class AuthResponse {

    private String accessToken;
    private String refreshToken;
    private String type = "Bearer";
    private User user;
    private long expiresIn;

    // Constructors
    public AuthResponse() {
    }

    public AuthResponse(String accessToken, String refreshToken, User user, long expiresIn) {
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
        this.user = user;
        this.expiresIn = expiresIn;
    }

    // Legacy constructor for backward compatibility
    public AuthResponse(String accessToken, User user) {
        this.accessToken = accessToken;
        this.user = user;
        this.expiresIn = 86400000; // 24 hours
    }

    // Getters and Setters
    public String getAccessToken() {
        return accessToken;
    }

    public void setAccessToken(String accessToken) {
        this.accessToken = accessToken;
    }

    public String getRefreshToken() {
        return refreshToken;
    }

    public void setRefreshToken(String refreshToken) {
        this.refreshToken = refreshToken;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public long getExpiresIn() {
        return expiresIn;
    }

    public void setExpiresIn(long expiresIn) {
        this.expiresIn = expiresIn;
    }

    // Backward compatibility
    public String getToken() {
        return accessToken;
    }

    public void setToken(String token) {
        this.accessToken = token;
    }
} 