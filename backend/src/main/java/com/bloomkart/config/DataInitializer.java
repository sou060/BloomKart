package com.bloomkart.config;

import com.bloomkart.entity.Product;
import com.bloomkart.entity.User;
import com.bloomkart.repository.ProductRepository;
import com.bloomkart.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.Arrays;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProductRepository productRepository;

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
        }

        // Create sample products if none exist
        if (productRepository.count() == 0) {
            createSampleProducts();
            System.out.println("Sample products created");
        }
    }

    private void createSampleProducts() {
        Product product1 = new Product();
        product1.setName("Red Roses Bouquet");
        product1.setDescription("Beautiful red roses arranged in a stunning bouquet. Perfect for romantic occasions.");
        product1.setPrice(new BigDecimal("999.00"));
        product1.setCategory("Roses");
        product1.setStockQuantity(50);
        product1.setFresh(true);
        product1.setFeatured(true);
        product1.setMainImage("/uploads/red-roses.png");
        product1.setImages(Arrays.asList("/uploads/red-roses.png", "/uploads/red-roses-2.png"));
        productRepository.save(product1);

        Product product2 = new Product();
        product2.setName("Sunflower Bundle");
        product2.setDescription("Bright and cheerful sunflowers that bring sunshine to any room.");
        product2.setPrice(new BigDecimal("599.00"));
        product2.setCategory("Sunflowers");
        product2.setStockQuantity(30);
        product2.setFresh(true);
        product2.setFeatured(false);
        product2.setMainImage("/uploads/sunflowers.png");
        product2.setImages(Arrays.asList("/uploads/sunflowers.png"));
        productRepository.save(product2);

        Product product3 = new Product();
        product3.setName("Mixed Flower Basket");
        product3.setDescription("A beautiful assortment of seasonal flowers in an elegant basket.");
        product3.setPrice(new BigDecimal("1299.00"));
        product3.setCategory("Mixed");
        product3.setStockQuantity(20);
        product3.setFresh(true);
        product3.setFeatured(true);
        product3.setMainImage("/uploads/mixed-basket.png");
        product3.setImages(Arrays.asList("/uploads/mixed-basket.png", "/uploads/mixed-basket-2.png"));
        productRepository.save(product3);

        Product product4 = new Product();
        product4.setName("White Lilies");
        product4.setDescription("Pure white lilies symbolizing purity and innocence.");
        product4.setPrice(new BigDecimal("799.00"));
        product4.setCategory("Lilies");
        product4.setStockQuantity(25);
        product4.setFresh(true);
        product4.setFeatured(false);
        product4.setMainImage("/uploads/white-lilies.png");
        product4.setImages(Arrays.asList("/uploads/white-lilies.png"));
        productRepository.save(product4);
    }
} 