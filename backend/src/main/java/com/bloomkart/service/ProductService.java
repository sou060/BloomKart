package com.bloomkart.service;

import com.bloomkart.entity.Product;
import com.bloomkart.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.math.BigDecimal;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.UUID;

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    @Value("${file.upload-dir}")
    private String uploadPath;

    public Page<Product> getAllProducts(Pageable pageable) {
        return productRepository.findAll(pageable);
    }

    public Product getProductById(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));
    }

    public Page<Product> getProductsWithFilters(String category, BigDecimal minPrice, BigDecimal maxPrice,
                                              Boolean isFresh, String search, Pageable pageable) {
        return productRepository.findWithFilters(category, minPrice, maxPrice, isFresh, search, pageable);
    }

    public List<Product> getFeaturedProducts() {
        return productRepository.findByIsFeaturedTrue();
    }

    public List<String> getAllCategories() {
        return productRepository.findAllCategories();
    }

    public Product createProduct(Product product, List<MultipartFile> images) {
        if (images != null && !images.isEmpty()) {
            List<String> imageUrls = saveImages(images);
            product.setImages(imageUrls);
            if (!imageUrls.isEmpty()) {
                product.setMainImage(imageUrls.get(0));
            }
        }
        return productRepository.save(product);
    }

    public Product updateProduct(Long id, Product product, List<MultipartFile> newImages) {
        Product existingProduct = getProductById(id);
        
        existingProduct.setName(product.getName());
        existingProduct.setDescription(product.getDescription());
        existingProduct.setPrice(product.getPrice());
        existingProduct.setCategory(product.getCategory());
        existingProduct.setStockQuantity(product.getStockQuantity());
        existingProduct.setFresh(product.isFresh());
        existingProduct.setFeatured(product.isFeatured());

        if (newImages != null && !newImages.isEmpty()) {
            List<String> newImageUrls = saveImages(newImages);
            List<String> existingImages = existingProduct.getImages();
            existingImages.addAll(newImageUrls);
            existingProduct.setImages(existingImages);
        }

        return productRepository.save(existingProduct);
    }

    public void deleteProduct(Long id) {
        Product product = getProductById(id);
        productRepository.delete(product);
    }

    public void updateStock(Long productId, Integer quantity) {
        Product product = getProductById(productId);
        product.setStockQuantity(product.getStockQuantity() - quantity);
        productRepository.save(product);
    }

    public long getTotalProductCount() {
        return productRepository.count();
    }

    public Page<Product> getProductsByCategory(String category, Pageable pageable) {
        return productRepository.findByCategory(category, pageable);
    }

    public Page<Product> searchProducts(String search, Pageable pageable) {
        return productRepository.findByNameContainingIgnoreCase(search, pageable);
    }

    public long getOutOfStockCount() {
        return productRepository.countOutOfStock();
    }

    public long getLowStockCount() {
        return productRepository.countLowStock();
    }

    public long getInStockCount() {
        return productRepository.countInStock();
    }

    public Page<Product> getLowStockProducts(Pageable pageable) {
        return productRepository.findLowStockProducts(pageable);
    }

    public Page<Product> getOutOfStockProducts(Pageable pageable) {
        return productRepository.findOutOfStockProducts(pageable);
    }

    private List<String> saveImages(List<MultipartFile> images) {
        try {
            Path uploadDir = Paths.get(uploadPath);
            if (!Files.exists(uploadDir)) {
                Files.createDirectories(uploadDir);
            }

            return images.stream()
                    .map(this::saveImage)
                    .toList();
        } catch (IOException e) {
            throw new RuntimeException("Failed to save images", e);
        }
    }

    private String saveImage(MultipartFile image) {
        try {
            String fileName = UUID.randomUUID().toString() + "_" + image.getOriginalFilename();
            Path filePath = Paths.get(uploadPath, fileName);
            Files.copy(image.getInputStream(), filePath);
            return "/uploads/" + fileName;
        } catch (IOException e) {
            throw new RuntimeException("Failed to save image", e);
        }
    }
}
