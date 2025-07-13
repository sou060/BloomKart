# BloomKart Backend

A Spring Boot backend for the BloomKart flower e-commerce application.

## Features

- **User Authentication & Authorization**: JWT-based authentication with role-based access control
- **Product Management**: CRUD operations for flower products with image upload
- **Order Management**: Complete order lifecycle with status tracking
- **Payment Integration**: Razorpay payment gateway integration
- **Admin Dashboard**: Comprehensive admin panel for managing products, orders, and users
- **File Upload**: Image upload functionality for product images
- **RESTful APIs**: Well-structured REST endpoints with proper error handling

## Tech Stack

- **Framework**: Spring Boot 3.2.0
- **Database**: MySQL 8.0
- **Security**: Spring Security with JWT
- **Payment**: Razorpay
- **File Upload**: Spring MultipartFile
- **Validation**: Jakarta Validation
- **Documentation**: OpenAPI/Swagger

## Prerequisites

- Java 17 or higher
- MySQL 8.0 or higher
- Maven 3.6 or higher

## Setup Instructions

### 1. Database Setup

Create a MySQL database:

```sql
CREATE DATABASE bloomkart_db;
```

### 2. Configuration

Update `src/main/resources/application.properties` with your database credentials and other configurations:

```properties
# Database Configuration
spring.datasource.url=jdbc:mysql://localhost:3306/bloomkart_db
spring.datasource.username=your_username
spring.datasource.password=your_password

# JWT Configuration
jwt.secret=your_jwt_secret_key_here_make_it_long_and_secure
jwt.expiration=86400000

# File Upload Configuration
file.upload.path=./uploads

# Razorpay Configuration
razorpay.key.id=your_razorpay_key_id
razorpay.key.secret=your_razorpay_secret_key

# CORS Configuration
cors.allowed-origins=http://localhost:3000,http://localhost:5173
cors.allowed-methods=GET,POST,PUT,DELETE,OPTIONS
cors.allowed-headers=*
```

### 3. Build and Run

```bash
# Navigate to backend directory
cd backend

# Build the project
mvn clean install

# Run the application
mvn spring-boot:run
```

The application will start on `http://localhost:8080`

## API Endpoints

### Authentication

- `POST /auth/login` - User login
- `POST /auth/register` - User registration
- `GET /auth/profile` - Get current user profile
- `PUT /auth/profile` - Update user profile

### Products (Public)

- `GET /products` - Get all products with filters
- `GET /products/{id}` - Get product by ID
- `GET /products/featured` - Get featured products
- `GET /products/categories` - Get all categories

### Products (Admin)

- `POST /products` - Create new product
- `PUT /products/{id}` - Update product
- `DELETE /products/{id}` - Delete product

### Orders

- `POST /orders` - Create new order
- `GET /orders` - Get user orders
- `GET /orders/{id}` - Get order by ID
- `POST /orders/verify-payment` - Verify payment

### Admin

- `GET /admin/dashboard/stats` - Get dashboard statistics
- `GET /admin/products` - Get all products (admin view)
- `GET /admin/orders` - Get all orders (admin view)
- `PUT /admin/orders/{id}/status` - Update order status
- `GET /admin/users` - Get all users
- `PUT /admin/users/{id}/role` - Update user role
- `DELETE /admin/users/{id}` - Delete user

### File Upload

- `POST /upload/image` - Upload image file

## Database Schema

### Users Table

- id (Primary Key)
- name
- email (Unique)
- password (Encrypted)
- phone_number
- role (USER/ADMIN)
- enabled
- created_at
- updated_at

### Products Table

- id (Primary Key)
- name
- description
- price
- category
- stock_quantity
- is_fresh
- is_featured
- main_image
- images (JSON)
- created_at
- updated_at

### Orders Table

- id (Primary Key)
- user_id (Foreign Key)
- total_amount
- status
- payment_id
- payment_status
- delivery_details (Embedded)
- created_at
- updated_at

### Order_Items Table

- id (Primary Key)
- order_id (Foreign Key)
- product_id (Foreign Key)
- quantity
- price

## Security

- JWT-based authentication
- Role-based authorization (USER/ADMIN)
- Password encryption using BCrypt
- CORS configuration for frontend integration
- Input validation using Jakarta Validation

## Payment Integration

The application integrates with Razorpay for payment processing:

- Payment order creation
- Payment verification
- Payment status tracking

## File Upload

- Supports multiple image uploads
- Generates unique filenames
- Stores file paths in database
- Configurable upload directory

## Error Handling

- Global exception handling
- Proper HTTP status codes
- Detailed error messages
- Validation error responses

## Development

### Running Tests

```bash
mvn test
```

### Code Formatting

```bash
mvn spring-javaformat:apply
```

## Deployment

### Production Configuration

- Update database URL for production
- Set secure JWT secret
- Configure production Razorpay keys
- Set appropriate CORS origins
- Configure file upload path for production

### Docker Deployment

```bash
# Build Docker image
docker build -t bloomkart-backend .

# Run container
docker run -p 8080:8080 bloomkart-backend
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.
