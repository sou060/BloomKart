package com.bloomkart.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // The context path "/api" is stripped by Spring Boot before this handler is called.
        // Therefore, we only need to match the remaining part of the path.
        String uploadDir = "C:/Users/soura/IdeaProjects/BloomKart/uploads/";

        // Use an absolute path to the uploads directory.
        // For Windows, the path should start with "file:" for absolute paths on the filesystem.
        registry.addResourceHandler("/uploads/**")
                .addResourceLocations("file:" + uploadDir);
    }
}
