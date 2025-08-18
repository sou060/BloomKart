package com.bloomkart.config;

import jakarta.servlet.Filter;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.time.Instant;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class RateLimitingFilter implements Filter {
    private static final int MAX_REQUESTS_PER_MINUTE = 5;
    private static final long WINDOW_MILLIS = 60_000;
    private final Map<String, RequestInfo> requestCounts = new ConcurrentHashMap<>();

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {
        HttpServletRequest req = (HttpServletRequest) request;
        String path = req.getRequestURI();
        if (path.equals("/api/auth/login") || path.equals("/api/auth/register")) {
            String ip = request.getRemoteAddr();
            long now = Instant.now().toEpochMilli();
            RequestInfo info = requestCounts.computeIfAbsent(ip, k -> new RequestInfo(0, now));
            synchronized (info) {
                if (now - info.windowStart > WINDOW_MILLIS) {
                    info.windowStart = now;
                    info.count = 1;
                } else {
                    info.count++;
                }
                if (info.count > MAX_REQUESTS_PER_MINUTE) {
                    HttpServletResponse resp = (HttpServletResponse) response;
                    resp.setStatus(429);
                    resp.setContentType("application/json");
                    resp.getWriter().write("{\"error\":\"Too many requests. Please try again later.\"}");
                    return;
                }
            }
        }
        chain.doFilter(request, response);
    }

    private static class RequestInfo {
        int count;
        long windowStart;
        RequestInfo(int count, long windowStart) {
            this.count = count;
            this.windowStart = windowStart;
        }
    }
} 