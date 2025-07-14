package com.bloomkart.config;

import com.bloomkart.entity.User;
import com.bloomkart.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // Create admin user if not exists
        if (!userRepository.existsByEmail("admin@bloomkart.com")) {
            User admin = new User();
            admin.setName("Admin User");
            admin.setEmail("admin@bloomkart.com");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setPhoneNumber("9876543210");
            admin.setRole(User.Role.ADMIN);
            userRepository.save(admin);
            System.out.println("Admin user created: admin@bloomkart.com / admin123");
        } else {
            System.out.println("Admin user already exists");
        }
        
        System.out.println("Data initialization completed. System ready for real data.");
    }
} 