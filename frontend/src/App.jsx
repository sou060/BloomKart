import { BrowserRouter as Router, Routes, Route, Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import ProductList from "./components/ProductList";
import ProductDetail from "./components/ProductDetail";
import Cart from "./components/Cart";
import Checkout from "./components/Checkout";
import Orders from "./components/Orders";
import OrderDetail from "./components/OrderDetail";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import Profile from "./pages/Profile";
import Addresses from "./pages/Addresses";
import OAuth2RedirectHandler from "./components/OAuth2RedirectHandler";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import AdminRoute from "./components/auth/AdminRoute";
import AdminDashboard from "./components/admin/AdminDashboard";
import AddProduct from "./components/admin/AddProduct";
import AdminProducts from "./components/admin/AdminProducts";
import AdminOrders from "./components/admin/AdminOrders";
import AdminUsers from "./components/admin/AdminUsers";
import EditProduct from "./components/admin/EditProduct";
import AdminLayout from "./components/admin/AdminLayout";
import AdminAnalytics from "./components/admin/AdminAnalytics";
import AdminSettings from "./components/admin/AdminSettings";
import AdminOrderDetail from "./components/admin/AdminOrderDetail";
import AdminReports from "./components/admin/AdminReports";
import AdminInventory from "./components/admin/AdminInventory";
import AdminNotifications from "./components/admin/AdminNotifications";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { ThemeProvider } from "./context/ThemeContext";
import "./App.css";
import "./styles/auth.css";

function App() {
    return (
        <ThemeProvider>
            <AuthProvider>
                <CartProvider>
                    <Router>
                        <Navbar />
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/products" element={<ProductList />} />
                            <Route path="/products/:id" element={<ProductDetail />} />
                            <Route path="/cart" element={<Cart />} />
                            <Route
                                path="/checkout"
                                element={
                                    <ProtectedRoute>
                                        <Checkout />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/orders"
                                element={
                                    <ProtectedRoute>
                                        <Orders />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/orders/:id"
                                element={
                                    <ProtectedRoute>
                                        <OrderDetail />
                                    </ProtectedRoute>
                                }
                            />
                            <Route path="/login" element={<Login />} />
                            <Route path="/register" element={<Register />} />
                            <Route
                                path="/oauth2/redirect"
                                element={<OAuth2RedirectHandler />}
                            />
                            <Route
                                path="/profile"
                                element={
                                    <ProtectedRoute>
                                        <Profile />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/addresses"
                                element={
                                    <ProtectedRoute>
                                        <Addresses />
                                    </ProtectedRoute>
                                }
                            />
                            {/* Admin routes */}
                            {/* Create a parent route for the admin section that handles the layout and protection */}
                            <Route
                                path="/admin"
                                element={
                                    <AdminRoute>
                                        <AdminLayout>
                                            {/* The Outlet component will render the matched child route */}
                                            <Outlet />
                                        </AdminLayout>
                                    </AdminRoute>
                                }
                            >
                                {/* These child routes will render inside the AdminLayout's <Outlet /> */}
                                <Route path="dashboard" element={<AdminDashboard />} />
                                <Route path="products" element={<AdminProducts />} />
                                <Route path="products/add" element={<AddProduct />} />
                                <Route path="products/:id/edit" element={<EditProduct />} />
                                <Route path="orders" element={<AdminOrders />} />
                                <Route path="orders/:id" element={<AdminOrderDetail />} />
                                <Route path="users" element={<AdminUsers />} />
                                <Route path="analytics" element={<AdminAnalytics />} />
                                <Route path="reports" element={<AdminReports />} />
                                <Route path="inventory" element={<AdminInventory />} />
                                <Route path="notifications" element={<AdminNotifications />} />
                                <Route path="settings" element={<AdminSettings />} />
                            </Route>
                        </Routes>
                    </Router>
                </CartProvider>
            </AuthProvider>
        </ThemeProvider>
    );
}

export default App;