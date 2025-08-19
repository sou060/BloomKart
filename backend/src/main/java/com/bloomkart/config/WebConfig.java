package com.bloomkart.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    // Inject the upload directory path from application.properties
    @Value("${file.upload-dir}")
    private String uploadDir;

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Ensure the path ends with a slash for correct resource location
        String resourceLocation = uploadDir.endsWith("/") ? uploadDir : uploadDir + "/";
        
        // Use the configured path to serve static files from the uploads directory.
        // The "file:" prefix is crucial for serving from the local filesystem.
        registry.addResourceHandler("/uploads/**")
                .addResourceLocations("file:" + resourceLocation);
    }
}
