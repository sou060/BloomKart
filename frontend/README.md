# BloomKart - Flower E-commerce Frontend

A modern, responsive React.js frontend for an online flower store with beautiful UI and comprehensive functionality.

## Features

### User Features

- **Product Browsing**: Browse flowers by category, search, and filter
- **Product Details**: View detailed product information with image gallery
- **Shopping Cart**: Add/remove items, manage quantities
- **User Authentication**: Register, login, and profile management
- **Order Management**: Place orders, view order history and details
- **Responsive Design**: Mobile-friendly interface

### Admin Features

- **Dashboard**: View statistics and recent orders
- **Product Management**: Add, edit, delete products with image upload
- **Order Management**: View and update order status
- **User Management**: View and manage user accounts
- **Stock Control**: Monitor and update product inventory

## Tech Stack

- **React.js** - Frontend framework
- **React Router** - Client-side routing
- **Bootstrap** - UI framework and responsive design
- **Axios** - HTTP client for API calls
- **React Icons** - Icon library
- **React Toastify** - Toast notifications
- **React Dropzone** - File upload functionality
- **JWT Decode** - JWT token handling

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Backend API running (see backend README)

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd frontend
```

2. Install dependencies:

```bash
npm install
```

3. Create environment variables:
   Create a `.env` file in the root directory:

```env
REACT_APP_API_URL=http://localhost:8080/api
REACT_APP_RAZORPAY_KEY_ID=your_razorpay_key_id
```

4. Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Project Structure

```
src/
├── components/
│   ├── auth/
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── Profile.jsx
│   │   ├── ProtectedRoute.jsx
│   │   └── AdminRoute.jsx
│   ├── admin/
│   │   ├── AdminDashboard.jsx
│   │   ├── AddProduct.jsx
│   │   ├── EditProduct.jsx
│   │   ├── AdminProducts.jsx
│   │   ├── AdminOrders.jsx
│   │   └── AdminUsers.jsx
│   ├── Home.jsx
│   ├── Navbar.jsx
│   ├── ProductList.jsx
│   ├── ProductDetail.jsx
│   ├── Cart.jsx
│   ├── Checkout.jsx
│   ├── Orders.jsx
│   └── OrderDetail.jsx
├── context/
│   ├── AuthContext.jsx
│   └── CartContext.jsx
├── App.jsx
├── main.jsx
├── axios.jsx
├── App.css
└── index.css
```

## API Endpoints

The frontend communicates with the backend API at the following endpoints:

### Authentication

- `POST /auth/login` - User login
- `POST /auth/register` - User registration
- `GET /auth/profile` - Get user profile
- `PUT /auth/profile` - Update user profile

### Products

- `GET /products` - Get all products (with pagination and filters)
- `GET /products/{id}` - Get product details
- `GET /products/featured` - Get featured products
- `GET /products/categories` - Get product categories

### Orders

- `POST /orders` - Create new order
- `GET /orders` - Get user orders
- `GET /orders/{id}` - Get order details
- `POST /orders/verify-payment` - Verify payment

### Admin

- `GET /admin/dashboard/stats` - Get dashboard statistics
- `GET /admin/products` - Get all products (admin)
- `POST /admin/products` - Create product
- `PUT /admin/products/{id}` - Update product
- `DELETE /admin/products/{id}` - Delete product
- `GET /admin/orders` - Get all orders (admin)
- `PUT /admin/orders/{id}/status` - Update order status
- `GET /admin/users` - Get all users (admin)
- `PUT /admin/users/{id}/role` - Update user role

## Key Features Implementation

### Authentication

- JWT-based authentication with automatic token refresh
- Protected routes for authenticated users
- Admin-only routes for administrative functions
- Persistent login state

### Shopping Cart

- Local storage persistence
- Real-time quantity updates
- Cart total calculations
- Add/remove items functionality

### Product Management

- Image upload with drag-and-drop
- Multiple image support
- Category and filter management
- Stock quantity tracking

### Order Processing

- Razorpay payment integration
- Order status tracking
- Delivery scheduling
- Order history and details

## Styling

The application uses a custom CSS framework with:

- Floral-themed color scheme
- Responsive grid system
- Modern card-based layouts
- Smooth animations and transitions
- Mobile-first design approach

## Deployment

### Build for Production

```bash
npm run build
```

### Environment Variables for Production

Set the following environment variables:

- `REACT_APP_API_URL` - Production API URL
- `REACT_APP_RAZORPAY_KEY_ID` - Production Razorpay key

### Deploy to Vercel/Netlify

1. Connect your repository to Vercel or Netlify
2. Set environment variables in the deployment platform
3. Deploy automatically on push to main branch

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please contact the development team or create an issue in the repository.
