package com.bloomkart.exception;

import org.springframework.http.HttpStatus;

/**
 * Custom business exception for handling business logic errors
 */
public class BusinessException extends RuntimeException {
    
    private final HttpStatus status;
    
    public BusinessException(String message, HttpStatus status) {
        super(message);
        this.status = status;
    }
    
    public BusinessException(String message) {
        super(message);
        this.status = HttpStatus.BAD_REQUEST;
    }
    
    public HttpStatus getStatus() {
        return status;
    }
}
