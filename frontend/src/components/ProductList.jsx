import React, { useState, useEffect, useContext } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  FaSearch,
  FaFilter,
  FaSort,
  FaShoppingCart,
  FaHeart,
  FaPlus,
  FaMinus,
} from "react-icons/fa";
import api from "../axios";
import { CartContext } from "../context/CartContext";
import { toast } from "react-toastify";

const ProductList = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [showFilters, setShowFilters] = useState(false);

  const { addToCart, updateQuantity, cart = [] } = useContext(CartContext);

  console.log("ProductList component initialized");

  const [filters, setFilters] = useState({
    search: searchParams.get("search") || "",
    category: searchParams.get("category") || "",
    minPrice: searchParams.get("minPrice") || "",
    maxPrice: searchParams.get("maxPrice") || "",
    isFresh: searchParams.get("isFresh") === "true" ? true : null,
    sortBy: searchParams.get("sortBy") || "name",
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [
    currentPage,
    filters.search,
    filters.category,
    filters.minPrice,
    filters.maxPrice,
    filters.isFresh,
    filters.sortBy,
  ]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage,
        size: 12,
      });

      // Only add non-null, non-empty filters
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== null && value !== "" && value !== undefined) {
          params.append(key, value);
        }
      });

      console.log("Fetching products with params:", params.toString());
      const response = await api.get(`/products?${params}`);
      console.log("Products response:", response.data);
      console.log("Products content:", response.data.content);
      console.log("Products content length:", response.data.content?.length);
      setProducts(response.data.content || []);
      setTotalPages(response.data.totalPages || 0);
    } catch (error) {
      console.error("Error fetching products:", error);
      console.error("Error details:", error.response?.data);
      setProducts([]);
      setTotalPages(0);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      console.log("Fetching categories...");
      const response = await api.get("/products/categories");
      console.log("Categories response:", response.data);
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
      console.error("Error details:", error.response?.data);
    }
  };

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    setCurrentPage(0);
    const newSearchParams = new URLSearchParams();
    Object.entries(newFilters).forEach(([k, v]) => {
      if (v !== "" && v !== false && v !== null) {
        newSearchParams.set(k, v);
      }
    });
    setSearchParams(newSearchParams);
  };

  const clearFilters = () => {
    const clearedFilters = {
      search: "",
      category: "",
      minPrice: "",
      maxPrice: "",
      isFresh: null,
      sortBy: "name",
    };
    setFilters(clearedFilters);
    setCurrentPage(0);
    setSearchParams({});
  };

  const getSortOptions = () => [
    { value: "name", label: "Name A-Z" },
    { value: "name,desc", label: "Name Z-A" },
    { value: "price", label: "Price Low to High" },
    { value: "price,desc", label: "Price High to Low" },
    { value: "createdAt,desc", label: "Newest First" },
  ];

  console.log(
    "ProductList render - loading:",
    loading,
    "products:",
    products.length,
    "categories:",
    categories.length
  );

  if (loading) {
    return (
      <div className="loading-spinner">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="container py-5 fade-in">
      {/* Header */}
      <div className="row align-items-center mb-4">
        <div className="col-md-6">
          <h1 className="text-gradient fw-bold mb-2">Our Flower Collection</h1>
          <p className="text-muted mb-0">
            Discover {products.length} beautiful flowers for every occasion
          </p>
        </div>
        <div className="col-md-6 text-md-end">
          <button
            className="btn btn-outline-primary"
            onClick={() => setShowFilters(!showFilters)}
          >
            <FaFilter className="me-2" />
            {showFilters ? "Hide" : "Show"} Filters
          </button>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="card mb-4 border-radius-custom shadow-custom">
          <div className="card-header bg-gradient-primary text-white">
            <h5 className="mb-0">
              <FaFilter className="me-2" />
              Filters & Search
            </h5>
          </div>
          <div className="card-body">
            <div className="row g-3">
              {/* Search */}
              <div className="col-md-6">
                <label className="form-label">Search</label>
                <div className="input-group">
                  <span className="input-group-text">
                    <FaSearch />
                  </span>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search flowers..."
                    value={filters.search}
                    onChange={(e) =>
                      handleFilterChange("search", e.target.value)
                    }
                  />
                </div>
              </div>

              {/* Category */}
              <div className="col-md-6">
                <label className="form-label">Category</label>
                <select
                  className="form-select"
                  value={filters.category}
                  onChange={(e) =>
                    handleFilterChange("category", e.target.value)
                  }
                >
                  <option value="">All Categories</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price */}
              <div className="col-md-3">
                <label className="form-label">Min Price</label>
                <input
                  type="number"
                  className="form-control"
                  placeholder="₹0"
                  value={filters.minPrice}
                  onChange={(e) =>
                    handleFilterChange("minPrice", e.target.value)
                  }
                />
              </div>
              <div className="col-md-3">
                <label className="form-label">Max Price</label>
                <input
                  type="number"
                  className="form-control"
                  placeholder="₹5000"
                  value={filters.maxPrice}
                  onChange={(e) =>
                    handleFilterChange("maxPrice", e.target.value)
                  }
                />
              </div>

              {/* Sort */}
              <div className="col-md-3">
                <label className="form-label">Sort By</label>
                <select
                  className="form-select"
                  value={filters.sortBy}
                  onChange={(e) => handleFilterChange("sortBy", e.target.value)}
                >
                  {getSortOptions().map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Fresh */}
              <div className="col-md-3">
                <label className="form-label">Fresh Flowers</label>
                <div className="form-check form-switch">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="freshFilter"
                    checked={filters.isFresh === true}
                    onChange={(e) =>
                      handleFilterChange(
                        "isFresh",
                        e.target.checked ? true : null
                      )
                    }
                  />
                  <label className="form-check-label" htmlFor="freshFilter">
                    Show only fresh flowers
                  </label>
                </div>
              </div>

              {/* Clear Filters */}
              <div className="col-12">
                <button
                  className="btn btn-outline-secondary"
                  onClick={clearFilters}
                >
                  Clear All Filters
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Product Cards */}
      {products.length === 0 ? (
        <div className="text-center py-5">
          <h3 className="text-muted">No flowers found</h3>
          <p className="text-muted">Try adjusting your filters</p>
          <button className="btn btn-primary" onClick={clearFilters}>
            Reset Filters
          </button>
        </div>
      ) : (
        <>
          <div className="row g-4">
            {products.map((product) => {
              const productQuantity = Array.isArray(cart)
                ? cart.find((item) => item.id === product.id)?.quantity || 0
                : 0;
              return (
                <div key={product.id} className="col-md-6 col-lg-4 col-xl-3">
                  <Link
                    to={`/products/${product.id}`}
                    className="product-card-link"
                  >
                    <div className="product-card h-100">
                      {/* Featured badge: top-left */}
                      <div className="position-absolute top-0 start-0 p-2">
                        {product.featured && (
                          <span className="badge-featured">Featured</span>
                        )}
                      </div>
                      {/* Fresh badge: top-right */}
                      <div className="position-absolute top-0 end-0 p-2">
                        {product.fresh && (
                          <span className="badge-fresh">Fresh</span>
                        )}
                      </div>
                      <div className="position-relative">
                        <img
                          src={
                            product.mainImage &&
                            product.mainImage.startsWith("/uploads/")
                              ? `http://localhost:8080/api${product.mainImage}`
                              : product.mainImage
                          }
                          alt={product.name}
                          className="product-image w-100"
                        />
                        <div className="position-absolute bottom-0 start-0 end-0 p-2">
                          <div className="d-flex justify-content-between align-items-center">
                            <span className="product-category">
                              {product.category}
                            </span>
                            <button
                              className="btn btn-sm btn-outline-primary rounded-circle"
                              style={{ width: "35px", height: "35px" }}
                            >
                              <FaHeart size={12} />
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className="product-card-body">
                        <h6 className="product-title mb-2">{product.name}</h6>
                        <p className="text-muted small mb-2">
                          {product.description?.substring(0, 80)}...
                        </p>
                        <div className="product-price-section mb-3">
                          <span className="product-price">
                            ₹{product.price}
                          </span>
                        </div>
                        <div
                          className="product-controls-row"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="cart-controls-container">
                            {productQuantity === 0 ? (
                              <button
                                className="btn btn-primary btn-sm cart-add-btn"
                                onClick={() => {
                                  addToCart(product, 1);
                                  toast.success(
                                    `${product.name} added to cart!`
                                  );
                                }}
                              >
                                <FaShoppingCart className="me-1" />
                                Add
                              </button>
                            ) : (
                              <div className="cart-controls">
                                <button
                                  className="cart-btn"
                                  type="button"
                                  onClick={() => {
                                    if (productQuantity > 1) {
                                      updateQuantity(
                                        product.id,
                                        productQuantity - 1
                                      );
                                    } else if (productQuantity === 1) {
                                      updateQuantity(product.id, 0);
                                    }
                                  }}
                                  disabled={productQuantity === 0}
                                >
                                  <FaMinus />
                                </button>
                                <span className="cart-qty">
                                  {productQuantity}
                                </span>
                                <button
                                  className="cart-btn"
                                  type="button"
                                  onClick={() =>
                                    updateQuantity(
                                      product.id,
                                      productQuantity + 1
                                    )
                                  }
                                >
                                  <FaPlus />
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <nav className="mt-5">
              <ul className="pagination justify-content-center">
                <li
                  className={`page-item ${currentPage === 0 ? "disabled" : ""}`}
                >
                  <button
                    className="page-link"
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 0}
                  >
                    Previous
                  </button>
                </li>
                {[...Array(totalPages)].map((_, index) => (
                  <li
                    key={index}
                    className={`page-item ${
                      currentPage === index ? "active" : ""
                    }`}
                  >
                    <button
                      className="page-link"
                      onClick={() => setCurrentPage(index)}
                    >
                      {index + 1}
                    </button>
                  </li>
                ))}
                <li
                  className={`page-item ${
                    currentPage === totalPages - 1 ? "disabled" : ""
                  }`}
                >
                  <button
                    className="page-link"
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage === totalPages - 1}
                  >
                    Next
                  </button>
                </li>
              </ul>
            </nav>
          )}
        </>
      )}
    </div>
  );
};

export default ProductList;
