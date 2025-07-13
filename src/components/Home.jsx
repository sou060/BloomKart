import React, { useMemo, useCallback } from "react";
import useApi from "../hooks/useApi";

// Memoized Product Card Component
const ProductCard = React.memo(({ product, onAddToCart }) => {
  const handleAddToCart = useCallback(() => {
    onAddToCart(product);
  }, [product, onAddToCart]);

  return (
    <div
      className="card mb-3"
      style={{
        width: "270px",
        height: "210px",
        boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
        borderRadius: "10px",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "stretch",
      }}
    >
      <div
        className="card-body"
        style={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "10px",
        }}
      >
        <div>
          <h5
            className="card-title"
            style={{ margin: "0 0 10px 0", fontSize: "1.2rem" }}
          >
            {product.name.toUpperCase()}
          </h5>
          <i
            className="card-brand"
            style={{ fontStyle: "italic", fontSize: "0.8rem" }}
          >
            {"by " + product.brand}
          </i>
        </div>
        <hr className="hr-line" style={{ margin: "10px 0" }} />
        <div className="home-cart-price">
          <h5
            className="card-text"
            style={{
              fontWeight: "600",
              fontSize: "1.1rem",
              marginBottom: "5px",
            }}
          >
            <i className="bi bi-currency-rupee"></i>
            {product.price}
          </h5>
        </div>
        <button
          className="btn-hover color-9"
          style={{ margin: "10px 25px 0px " }}
          onClick={handleAddToCart}
        >
          Add To Cart
        </button>
      </div>
    </div>
  );
});

ProductCard.displayName = 'ProductCard';

const Home = () => {
  const { data: products = [], loading, error, refetch } = useApi("http://localhost:8080/api/products");

  const handleAddToCart = useCallback((product) => {
    // TODO: Implement add to cart functionality
    console.log("Adding to cart:", product);
  }, []);

  // Memoize the products grid to prevent unnecessary re-renders
  const productsGrid = useMemo(() => {
    if (loading) {
      return (
        <div className="text-center" style={{ padding: "10rem" }}>
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-center" style={{ padding: "10rem" }}>
          <h2>Something went wrong...</h2>
          <button className="btn btn-primary mt-3" onClick={refetch}>
            Try Again
          </button>
        </div>
      );
    }

    return (
      <div className="grid">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onAddToCart={handleAddToCart}
          />
        ))}
      </div>
    );
  }, [products, loading, error, handleAddToCart, refetch]);

  return <>{productsGrid}</>;
};

export default React.memo(Home);
