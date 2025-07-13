package com.bloomkart.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableScheduling;
 
@Configuration
@EnableScheduling
public class SchedulingConfig {
    // This enables the @Scheduled annotation for cleanup tasks
} 