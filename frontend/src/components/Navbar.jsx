import React, { useState, useContext, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { CartContext } from "../context/CartContext";
import { useTheme } from "../context/ThemeContext";
import UserProfileDropdown from "./UserProfileDropdown";
import {
  FaShoppingCart,
  FaSearch,
  FaHome,
  FaStore,
  FaBox,
  FaSun,
  FaMoon,
} from "react-icons/fa";

const Navbar = () => {
  const { user } = useContext(AuthContext);
  const { cart } = useContext(CartContext);
  const { isDarkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Hide navbar on admin pages
  const isAdminPage = location.pathname.startsWith("/admin");
  if (isAdminPage) {
    return null;
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProfileDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleProfileToggle = () => {
    setIsProfileDropdownOpen(!isProfileDropdownOpen);
  };

  const handleProfileClose = () => {
    setIsProfileDropdownOpen(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchTerm.trim())}`);
      setSearchTerm("");
    }
  };

  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar navbar-expand-lg sticky-top">
      <div className="container">
        {/* Brand */}
        <Link className="navbar-brand" to="/">
          <span className="text-gradient">🌸 BloomKart</span>
        </Link>

        {/* Mobile Toggle */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Navigation Items */}
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link
                className={`nav-link ${isActive("/") ? "active" : ""}`}
                to="/"
              >
                <FaHome className="me-1" />
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className={`nav-link ${isActive("/products") ? "active" : ""}`}
                to="/products"
              >
                <FaStore className="me-1" />
                Products
              </Link>
            </li>
            {user && (
              <>
                <li className="nav-item">
                  <Link
                    className={`nav-link ${
                      isActive("/orders") ? "active" : ""
                    }`}
                    to="/orders"
                  >
                    <FaBox className="me-1" />
                    My Orders
                  </Link>
                </li>
              </>
            )}
          </ul>

          {/* Search Bar */}
          <form className="d-flex me-3" onSubmit={handleSearch}>
            <div className="search-container">
              <FaSearch className="search-icon" />
              <input
                className={`form-control search-input ${
                  isSearchFocused ? "focused" : ""
                }`}
                type="search"
                placeholder="Search flowers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
                aria-label="Search"
              />
            </div>
          </form>

          {/* Right Side Items */}
          <ul className="navbar-nav">
            {/* Theme Toggle */}
            <li className="nav-item">
              <button
                className="nav-link btn btn-link"
                onClick={toggleTheme}
                title={
                  isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"
                }
              >
                {isDarkMode ? <FaSun size={18} /> : <FaMoon size={18} />}
              </button>
            </li>

            {/* Cart */}
            <li className="nav-item">
              <Link className="nav-link position-relative" to="/cart">
                <FaShoppingCart size={20} />
                {cartItemCount > 0 && (
                  <span className="cart-badge">{cartItemCount}</span>
                )}
              </Link>
            </li>

            {/* User Profile Dropdown */}
            {user ? (
              <li className="nav-item" ref={dropdownRef}>
                <UserProfileDropdown
                  user={user}
                  isOpen={isProfileDropdownOpen}
                  onToggle={handleProfileToggle}
                  onClose={handleProfileClose}
                />
              </li>
            ) : (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/login">
                    Login
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="btn btn-outline-light ms-2" to="/register">
                    Register
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
