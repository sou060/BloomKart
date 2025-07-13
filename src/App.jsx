import "./styles/themes.css";
import "./styles/typography.css";
import "./styles/navbar.css";
import "./styles/cards.css";
import React, { Suspense, lazy } from "react";
import Navbar from "./components/Navbar";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Lazy load components
const Home = lazy(() => import("./components/Home"));
const AddProduct = lazy(() => import("./components/AddProduct"));

// Loading component
const LoadingSpinner = () => (
  <div style={{ 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center', 
    height: '100vh',
    paddingTop: '80px'
  }}>
    <div className="spinner-border" role="status">
      <span className="visually-hidden">Loading...</span>
    </div>
  </div>
);

function App() {
  return (
      <BrowserRouter>
        <Navbar />
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/add_product" element={<AddProduct />} />   
          </Routes>
        </Suspense>
      </BrowserRouter>
  );
}

export default App;
