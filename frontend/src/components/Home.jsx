import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../axios";
import { FaArrowRight, FaStar, FaHeart, FaShoppingCart } from "react-icons/fa";

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [featuredRes, categoriesRes] = await Promise.all([
          api.get("/products/featured"),
          api.get("/products/categories"),
        ]);
        setFeaturedProducts(featuredRes.data);
        setCategories(categoriesRes.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="loading-spinner">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="fade-in">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6 hero-content">
              <h1 className="hero-title">Fresh Flowers for Every Occasion</h1>
              <p className="hero-subtitle">
                Discover our beautiful collection of fresh flowers, carefully
                selected and arranged to bring joy to your special moments.
              </p>
              <div className="d-flex gap-3 flex-wrap">
                <Link to="/products" className="hero-btn">
                  Shop Now <FaArrowRight className="ms-2" />
                </Link>
                <Link
                  to="/products?category=Roses"
                  className="hero-btn"
                  style={{
                    background: "rgba(255,255,255,0.2)",
                    color: "white",
                  }}
                >
                  View Roses
                </Link>
              </div>
            </div>
            <div className="col-lg-6 text-center">
              <div className="hero-image-container">
                <div className="floating-card">
                  <div className="card bg-white shadow-custom border-radius-custom p-4">
                    <div className="d-flex align-items-center mb-3">
                      <div
                        className="avatar bg-gradient-primary text-white rounded-circle d-flex align-items-center justify-content-center me-3"
                        style={{ width: "50px", height: "50px" }}
                      >
                        <FaHeart />
                      </div>
                      <div>
                        <h6 className="mb-0">Customer Favorite</h6>
                        <small className="text-muted">Red Roses Bouquet</small>
                      </div>
                    </div>
                    <div className="d-flex justify-content-between align-items-center">
                      <span className="h5 text-primary mb-0">₹999</span>
                      <div className="d-flex align-items-center">
                        <FaStar className="text-warning me-1" />
                        <span className="text-muted">4.8 (120 reviews)</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-5">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="text-gradient fw-bold mb-3">Shop by Category</h2>
            <p className="text-muted">
              Explore our diverse collection of beautiful flowers
            </p>
          </div>
          <div className="row g-4">
            {categories.map((category, index) => (
              <div key={index} className="col-md-4 col-lg-3">
                <Link
                  to={`/products?category=${encodeURIComponent(category)}`}
                  className="text-decoration-none"
                >
                  <div className="card category-card h-100 border-radius-custom shadow-custom">
                    <div className="card-body text-center p-4">
                      <div className="category-icon mb-3">
                        <div
                          className="bg-gradient-primary text-white rounded-circle d-flex align-items-center justify-content-center mx-auto"
                          style={{ width: "80px", height: "80px" }}
                        >
                          {category === "Roses" && "🌹"}
                          {category === "Sunflowers" && "🌻"}
                          {category === "Lilies" && "🌸"}
                          {category === "Mixed" && "💐"}
                          {!["Roses", "Sunflowers", "Lilies", "Mixed"].includes(
                            category
                          ) && "🌺"}
                        </div>
                      </div>
                      <h5 className="card-title text-dark mb-2">{category}</h5>
                      <p className="card-text text-muted small">
                        Beautiful {category.toLowerCase()} for every occasion
                      </p>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-5 bg-light">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="text-gradient fw-bold mb-3">Featured Products</h2>
            <p className="text-muted">
              Handpicked flowers that our customers love
            </p>
          </div>
          <div className="row g-4">
            {featuredProducts.slice(0, 8).map((product) => (
              <div key={product.id} className="col-md-6 col-lg-3">
                <div className="product-card h-100">
                  <div className="position-relative">
                    <img
                      src={
                        product.mainImage &&
                        product.mainImage.startsWith("/uploads/")
                          ? `http://localhost:8080/api${product.mainImage}`
                          : product.mainImage ||
                            (product.images?.[0] &&
                            product.images[0].startsWith("/uploads/")
                              ? `http://localhost:8080/api${product.images[0]}`
                              : product.images?.[0]) ||
                            "/placeholder-flower.jpg"
                      }
                      alt={product.name}
                      className="product-image w-100"
                    />
                    <div className="position-absolute top-0 end-0 p-2">
                      {product.isFresh && (
                        <span className="badge-fresh">Fresh</span>
                      )}
                    </div>
                    <div className="position-absolute top-0 start-0 p-2">
                      {product.isFeatured && (
                        <span className="badge-featured">Featured</span>
                      )}
                    </div>
                  </div>
                  <div className="product-card-body">
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <h6 className="product-title">{product.name}</h6>
                      <span className="product-category">
                        {product.category}
                      </span>
                    </div>
                    <p
                      className="text-muted small mb-3"
                      style={{ fontSize: "0.875rem" }}
                    >
                      {product.description?.substring(0, 80)}...
                    </p>
                    <div className="d-flex justify-content-between align-items-center">
                      <span className="product-price">₹{product.price}</span>
                      <Link
                        to={`/products/${product.id}`}
                        className="btn btn-primary btn-sm"
                      >
                        <FaShoppingCart className="me-1" />
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-5">
            <Link to="/products" className="btn btn-primary btn-lg">
              View All Products <FaArrowRight className="ms-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-5">
        <div className="container">
          <div className="row g-4">
            <div className="col-md-4">
              <div className="text-center">
                <div
                  className="bg-gradient-primary text-white rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3"
                  style={{ width: "80px", height: "80px" }}
                >
                  🌸
                </div>
                <h5 className="fw-bold mb-2">Fresh Flowers</h5>
                <p className="text-muted">
                  Handpicked fresh flowers delivered to your doorstep
                </p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="text-center">
                <div
                  className="bg-gradient-secondary text-white rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3"
                  style={{ width: "80px", height: "80px" }}
                >
                  🚚
                </div>
                <h5 className="fw-bold mb-2">Fast Delivery</h5>
                <p className="text-muted">
                  Same day delivery available for orders placed before 2 PM
                </p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="text-center">
                <div
                  className="bg-gradient-primary text-white rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3"
                  style={{ width: "80px", height: "80px" }}
                >
                  💝
                </div>
                <h5 className="fw-bold mb-2">Custom Arrangements</h5>
                <p className="text-muted">
                  Personalized flower arrangements for special occasions
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
