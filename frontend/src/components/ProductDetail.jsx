import React, { useState, useEffect, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import api from "../axios";
import { toast } from "react-toastify";
import {
  FaShoppingCart,
  FaHeart,
  FaStar,
  FaPlus,
  FaMinus,
} from "react-icons/fa";

const ProductDetail = () => {
  const { id } = useParams();
  const { addToCart, updateQuantity, cart = [] } = useContext(CartContext);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [reviews, setReviews] = useState([]);
  const [reviewStats, setReviewStats] = useState({
    averageRating: 0,
    reviewCount: 0,
  });
  const [userReview, setUserReview] = useState(null);
  const [hasReviewed, setHasReviewed] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: "" });
  const [submittingReview, setSubmittingReview] = useState(false);

  // Get current quantity from cart
  const productQuantity = Array.isArray(cart)
    ? cart.find((item) => item.id === product?.id)?.quantity || 0
    : 0;

  useEffect(() => {
    fetchProduct();
    fetchReviews();
    checkUserReview();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const response = await api.get(`/products/${id}`);
      setProduct(response.data);
      setSelectedImage(0);
    } catch (error) {
      console.error("Error fetching product:", error);
      toast.error("Failed to load product");
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    try {
      const [reviewsResponse, statsResponse] = await Promise.all([
        api.get(`/reviews/product/${id}`),
        api.get(`/reviews/product/${id}/stats`),
      ]);
      setReviews(reviewsResponse.data);
      setReviewStats(statsResponse.data);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  };

  const checkUserReview = async () => {
    try {
      const [hasReviewedResponse, userReviewResponse] = await Promise.all([
        api.get(`/reviews/product/${id}/has-reviewed`),
        api.get(`/reviews/product/${id}/user-review`),
      ]);
      setHasReviewed(hasReviewedResponse.data.hasReviewed);
      setUserReview(userReviewResponse.data);
      if (userReviewResponse.data) {
        setReviewForm({
          rating: userReviewResponse.data.rating,
          comment: userReviewResponse.data.comment,
        });
      }
    } catch (error) {
      console.error("Error checking user review:", error);
    }
  };

  const handleAddToCart = () => {
    addToCart(product, 1);
    toast.success(`${product.name} added to cart!`);
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setSubmittingReview(true);

    try {
      if (hasReviewed) {
        await api.put(`/reviews/product/${id}`, reviewForm);
        toast.success("Review updated successfully!");
      } else {
        await api.post(`/reviews/product/${id}`, reviewForm);
        toast.success("Review submitted successfully!");
      }

      await fetchReviews();
      await checkUserReview();
      setShowReviewForm(false);
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error(error.response?.data?.message || "Failed to submit review");
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleDeleteReview = async () => {
    try {
      await api.delete(`/reviews/product/${id}`);
      toast.success("Review deleted successfully!");
      setUserReview(null);
      setHasReviewed(false);
      setReviewForm({ rating: 5, comment: "" });
      await fetchReviews();
    } catch (error) {
      console.error("Error deleting review:", error);
      toast.error("Failed to delete review");
    }
  };

  const renderStars = (rating, interactive = false, onStarClick = null) => {
    return [...Array(5)].map((_, i) => (
      <FaStar
        key={i}
        className={`${i < rating ? "text-warning" : "text-muted"} ${
          interactive ? "cursor-pointer" : ""
        }`}
        onClick={interactive ? () => onStarClick(i + 1) : undefined}
        style={{ fontSize: interactive ? "1.5rem" : "1rem" }}
      />
    ));
  };

  if (loading) {
    return (
      <div className="loading-spinner">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container py-5">
        <div className="text-center">
          <h3>Product not found</h3>
          <Link to="/products" className="btn btn-primary">
            Back to Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="row">
        {/* Product Images */}
        <div className="col-lg-6 mb-4">
          <div className="product-image-gallery">
            <div className="main-image mb-3">
              <img
                src={
                  product.images[selectedImage] &&
                  product.images[selectedImage].startsWith("/uploads/")
                    ? `http://localhost:8080/api${product.images[selectedImage]}`
                    : product.images[selectedImage]
                }
                alt={product.name}
                className="img-fluid rounded"
                style={{ width: "100%", height: "400px", objectFit: "cover" }}
              />
            </div>
            {product.images.length > 1 && (
              <div className="thumbnail-images">
                <div className="row">
                  {product.images.map((image, index) => (
                    <div key={index} className="col-3 mb-2">
                      <img
                        src={
                          image && image.startsWith("/uploads/")
                            ? `http://localhost:8080/api${image}`
                            : image
                        }
                        alt={`${product.name} ${index + 1}`}
                        className={`img-fluid rounded cursor-pointer ${
                          selectedImage === index ? "border border-primary" : ""
                        }`}
                        style={{ height: "80px", objectFit: "cover" }}
                        onClick={() => setSelectedImage(index)}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Product Info */}
        <div className="col-lg-6">
          <div className="product-info">
            <h2 className="mb-3">{product.name}</h2>

            {/* Rating Display */}
            <div className="mb-3">
              <div className="d-flex align-items-center gap-2 mb-2">
                {renderStars(Math.round(reviewStats.averageRating))}
                <span className="text-muted">
                  ({reviewStats.reviewCount} reviews)
                </span>
              </div>
              <span className="h3 text-primary">₹{product.price}</span>
            </div>

            <div className="mb-3">
              <p className="text-muted">Category: {product.category}</p>
            </div>

            <div className="mb-3">
              <p>{product.description}</p>
            </div>

            <div className="mb-3">
              <div className="d-flex gap-2">
                {product.isFresh && (
                  <span className="badge badge-fresh">Fresh</span>
                )}
                {product.isFeatured && (
                  <span className="badge badge-featured">Featured</span>
                )}
              </div>
            </div>

            <div className="mb-3">
              <p>
                <strong>Stock:</strong> {product.stockQuantity} available
              </p>
            </div>

            <div className="mb-4">
              <div className="d-flex align-items-center gap-3">
                <span className="fw-bold">Quantity:</span>
                {productQuantity === 0 ? (
                  <button
                    className="btn btn-primary cart-add-btn"
                    onClick={handleAddToCart}
                    disabled={product.stockQuantity === 0}
                  >
                    <FaShoppingCart className="me-2" />
                    Add to Cart
                  </button>
                ) : (
                  <div className="cart-controls">
                    <button
                      className="cart-btn"
                      type="button"
                      onClick={() => {
                        if (productQuantity > 1) {
                          updateQuantity(product.id, productQuantity - 1);
                        } else if (productQuantity === 1) {
                          updateQuantity(product.id, 0);
                        }
                      }}
                      disabled={productQuantity === 0}
                    >
                      <FaMinus />
                    </button>
                    <span className="cart-qty">{productQuantity}</span>
                    <button
                      className="cart-btn"
                      type="button"
                      onClick={() =>
                        updateQuantity(product.id, productQuantity + 1)
                      }
                      disabled={productQuantity >= product.stockQuantity}
                    >
                      <FaPlus />
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="d-grid gap-2">
              <button className="btn btn-outline-primary">
                <FaHeart /> Add to Wishlist
              </button>
            </div>

            {product.stockQuantity === 0 && (
              <div className="alert alert-warning mt-3">
                This product is currently out of stock.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Review Section */}
      <div className="row mt-5">
        <div className="col-12">
          <div className="card">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h4>Customer Reviews</h4>
              <button
                className="btn btn-primary btn-sm"
                onClick={() => setShowReviewForm(!showReviewForm)}
              >
                {hasReviewed ? "Edit Review" : "Write a Review"}
              </button>
            </div>

            {/* Review Form */}
            {showReviewForm && (
              <div className="card-body border-bottom">
                <form onSubmit={handleReviewSubmit}>
                  <div className="mb-3">
                    <label className="form-label">Rating:</label>
                    <div className="d-flex gap-1">
                      {renderStars(reviewForm.rating, true, (rating) =>
                        setReviewForm({ ...reviewForm, rating })
                      )}
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Comment:</label>
                    <textarea
                      className="form-control"
                      rows="3"
                      value={reviewForm.comment}
                      onChange={(e) =>
                        setReviewForm({
                          ...reviewForm,
                          comment: e.target.value,
                        })
                      }
                      placeholder="Share your experience with this product..."
                      required
                      minLength="10"
                      maxLength="500"
                    />
                  </div>
                  <div className="d-flex gap-2">
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={submittingReview}
                    >
                      {submittingReview
                        ? "Submitting..."
                        : hasReviewed
                        ? "Update Review"
                        : "Submit Review"}
                    </button>
                    {hasReviewed && (
                      <button
                        type="button"
                        className="btn btn-outline-danger"
                        onClick={handleDeleteReview}
                      >
                        Delete Review
                      </button>
                    )}
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={() => setShowReviewForm(false)}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Reviews List */}
            <div className="card-body">
              {reviews.length > 0 ? (
                reviews.map((review) => (
                  <div
                    key={review.id}
                    className="review-item border-bottom pb-3 mb-3"
                  >
                    <div className="d-flex justify-content-between align-items-start">
                      <div className="flex-grow-1">
                        <h6>{review.user.name}</h6>
                        <div className="mb-2">{renderStars(review.rating)}</div>
                        <p>{review.comment}</p>
                      </div>
                      <small className="text-muted">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </small>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-muted">
                  No reviews yet. Be the first to review!
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
