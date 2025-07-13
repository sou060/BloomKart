# Frontend API Endpoints Configuration

This document outlines the correct API endpoints that the frontend should use to communicate with the Spring Boot backend.

## Base Configuration

- **Base URL**: `http://localhost:8080/api`
- **Authentication**: JWT Bearer token (automatically included via axios interceptor)
- **CORS**: Configured for `http://localhost:5173`, `http://localhost:5179`, `http://localhost:3000`

## Authentication Endpoints

| Method | Endpoint         | Description              | Auth Required |
| ------ | ---------------- | ------------------------ | ------------- |
| POST   | `/auth/login`    | User login               | No            |
| POST   | `/auth/register` | User registration        | No            |
| GET    | `/auth/profile`  | Get current user profile | Yes           |
| PUT    | `/auth/profile`  | Update user profile      | Yes           |

## Product Endpoints (Public)

| Method | Endpoint               | Description                   | Auth Required |
| ------ | ---------------------- | ----------------------------- | ------------- |
| GET    | `/products`            | Get all products with filters | No            |
| GET    | `/products/{id}`       | Get product by ID             | No            |
| GET    | `/products/featured`   | Get featured products         | No            |
| GET    | `/products/categories` | Get all categories            | No            |

## Product Endpoints (Admin)

| Method | Endpoint         | Description        | Auth Required |
| ------ | ---------------- | ------------------ | ------------- |
| POST   | `/products`      | Create new product | Yes (ADMIN)   |
| PUT    | `/products/{id}` | Update product     | Yes (ADMIN)   |
| DELETE | `/products/{id}` | Delete product     | Yes (ADMIN)   |

## Order Endpoints

| Method | Endpoint                 | Description      | Auth Required |
| ------ | ------------------------ | ---------------- | ------------- |
| POST   | `/orders`                | Create new order | Yes           |
| GET    | `/orders`                | Get user orders  | Yes           |
| GET    | `/orders/{id}`           | Get order by ID  | Yes           |
| POST   | `/orders/verify-payment` | Verify payment   | Yes           |

## Admin Endpoints

| Method | Endpoint                    | Description                   | Auth Required |
| ------ | --------------------------- | ----------------------------- | ------------- |
| GET    | `/admin/dashboard/stats`    | Get dashboard statistics      | Yes (ADMIN)   |
| GET    | `/admin/products`           | Get all products (admin view) | Yes (ADMIN)   |
| GET    | `/admin/orders`             | Get all orders (admin view)   | Yes (ADMIN)   |
| PUT    | `/admin/orders/{id}/status` | Update order status           | Yes (ADMIN)   |
| GET    | `/admin/users`              | Get all users                 | Yes (ADMIN)   |
| PUT    | `/admin/users/{id}/role`    | Update user role              | Yes (ADMIN)   |
| DELETE | `/admin/users/{id}`         | Delete user                   | Yes (ADMIN)   |

## File Upload Endpoints

| Method | Endpoint        | Description       | Auth Required |
| ------ | --------------- | ----------------- | ------------- |
| POST   | `/upload/image` | Upload image file | Yes           |

## Authentication Flow

1. **Login/Register**: Frontend sends credentials to `/auth/login` or `/auth/register`
2. **Token Storage**: JWT token is stored in localStorage
3. **Automatic Headers**: Axios interceptor automatically adds `Authorization: Bearer <token>` to all requests
4. **Token Expiration**: If 401 response, user is redirected to login page

## Error Handling

- **401 Unauthorized**: Token expired or invalid - redirect to login
- **403 Forbidden**: Insufficient permissions (ADMIN required)
- **404 Not Found**: Resource not found
- **500 Internal Server Error**: Server error

## Sample API Calls

### Login

```javascript
const response = await api.post("/auth/login", { email, password });
const { token, user } = response.data;
```

### Get Products with Filters

```javascript
const response = await api.get(
  "/products?category=Roses&minPrice=500&maxPrice=1000"
);
const products = response.data.content;
```

### Create Order

```javascript
const orderData = {
  orderItems: [...],
  deliveryDetails: {...},
  totalAmount: 999.00
};
const response = await api.post("/orders", orderData);
```

### Admin - Get Dashboard Stats

```javascript
const response = await api.get("/admin/dashboard/stats");
const stats = response.data;
```

## Testing Credentials

### Admin User

- **Email**: `admin@bloomkart.com`
- **Password**: `admin123`
- **Role**: ADMIN

### Regular User

- Register a new user through the registration form
- **Role**: USER (default)

## Notes

- All admin endpoints require the user to have the ADMIN role
- JWT tokens are automatically handled by the axios interceptor
- CORS is configured to allow requests from the frontend development server
- File uploads use multipart/form-data format
- All responses follow RESTful conventions
