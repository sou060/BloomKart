import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import { FaTrash, FaMinus, FaPlus } from "react-icons/fa";

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, clearCart } =
    useContext(CartContext);

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const handleQuantityChange = (id, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(id);
    } else {
      updateQuantity(id, newQuantity);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="container py-5">
        <div className="text-center">
          <h3>Your cart is empty</h3>
          <p>Add some beautiful flowers to your cart!</p>
          <Link to="/products" className="btn btn-primary">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="row">
        <div className="col-lg-8">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2>Shopping Cart</h2>
            <button className="btn btn-outline-danger" onClick={clearCart}>
              Clear Cart
            </button>
          </div>

          {cart.map((item) => (
            <div key={item.id} className="cart-item">
              <div className="row align-items-center">
                <div className="col-md-2">
                  <img
                    src={item.mainImage || item.images[0]}
                    alt={item.name}
                    className="img-fluid rounded"
                    style={{ height: "80px", objectFit: "cover" }}
                  />
                </div>
                <div className="col-md-4">
                  <h5>{item.name}</h5>
                  <p className="text-muted mb-0">{item.category}</p>
                  {item.isFresh && (
                    <span className="badge badge-fresh">Fresh</span>
                  )}
                </div>
                <div className="col-md-2">
                  <p className="fw-bold">₹{item.price}</p>
                </div>
                <div className="col-md-2">
                  <div className="input-group input-group-sm">
                    <button
                      className="btn btn-outline-secondary"
                      onClick={() =>
                        handleQuantityChange(item.id, item.quantity - 1)
                      }
                    >
                      <FaMinus />
                    </button>
                    <input
                      type="number"
                      className="form-control text-center"
                      value={item.quantity}
                      onChange={(e) =>
                        handleQuantityChange(
                          item.id,
                          parseInt(e.target.value) || 1
                        )
                      }
                      min="1"
                      style={{ width: "60px" }}
                    />
                    <button
                      className="btn btn-outline-secondary"
                      onClick={() =>
                        handleQuantityChange(item.id, item.quantity + 1)
                      }
                    >
                      <FaPlus />
                    </button>
                  </div>
                </div>
                <div className="col-md-1">
                  <p className="fw-bold">₹{item.price * item.quantity}</p>
                </div>
                <div className="col-md-1">
                  <button
                    className="btn btn-outline-danger btn-sm"
                    onClick={() => removeFromCart(item.id)}
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="col-lg-4">
          <div className="cart-total">
            <h4 className="mb-3">Order Summary</h4>
            <div className="d-flex justify-content-between mb-2">
              <span>Subtotal:</span>
              <span>₹{calculateTotal()}</span>
            </div>
            <div className="d-flex justify-content-between mb-2">
              <span>Delivery:</span>
              <span>₹50</span>
            </div>
            <hr />
            <div className="d-flex justify-content-between mb-3">
              <strong>Total:</strong>
              <strong>₹{calculateTotal() + 50}</strong>
            </div>
            <Link to="/checkout" className="btn btn-light w-100">
              Proceed to Checkout
            </Link>
            <Link to="/products" className="btn btn-outline-light w-100 mt-2">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
