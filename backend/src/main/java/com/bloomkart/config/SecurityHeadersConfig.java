package com.bloomkart.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.web.header.HeaderWriter;
import org.springframework.security.web.header.writers.DelegatingRequestMatcherHeaderWriter;
import org.springframework.security.web.header.writers.StaticHeadersWriter;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;

@Configuration
public class SecurityHeadersConfig {

    @Bean
    public HeaderWriter securityHeadersWriter() {
        return new DelegatingRequestMatcherHeaderWriter(
            new AntPathRequestMatcher("/**"),
            new StaticHeadersWriter("X-Content-Type-Options", "nosniff")
        );
    }

    @Bean
    public HeaderWriter contentSecurityPolicyWriter() {
        return new DelegatingRequestMatcherHeaderWriter(
            new AntPathRequestMatcher("/**"),
            new StaticHeadersWriter("Content-Security-Policy", 
                "default-src 'self'; " +
                "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://accounts.google.com; " +
                "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
                "font-src 'self' https://fonts.gstatic.com; " +
                "img-src 'self' data: https:; " +
                "connect-src 'self' https://accounts.google.com; " +
                "frame-src 'self' https://accounts.google.com; " +
                "object-src 'none'; " +
                "base-uri 'self'; " +
                "form-action 'self'")
        );
    }

    @Bean
    public HeaderWriter strictTransportSecurityWriter() {
        return new DelegatingRequestMatcherHeaderWriter(
            new AntPathRequestMatcher("/**"),
            new StaticHeadersWriter("Strict-Transport-Security", "max-age=31536000; includeSubDomains")
        );
    }
}
