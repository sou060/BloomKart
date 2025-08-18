# BloomKart - Flower E-commerce Platform

A modern, full-stack e-commerce platform built for flower and plant retailers. BloomKart provides a complete solution for online flower sales with advanced features like OAuth2 authentication, real-time inventory management, and comprehensive admin dashboard.

## 🌸 Features

### Authentication & Security
- **JWT-based Authentication** with access and refresh tokens
- **Google OAuth2 Integration** for seamless social login
- **Role-based Access Control** (User/Admin)
- **Session Management** with logout capabilities
- **Security Headers** and Content Security Policy

### User Features
- **Product Browsing** with advanced filtering and search
- **Shopping Cart** with persistent storage
- **Order Management** with real-time status tracking
- **Address Management** with multiple address types
- **Product Reviews & Ratings** system
- **User Profile** management

### Admin Features
- **Comprehensive Dashboard** with analytics
- **Product Management** with image uploads
- **Order Management** with status updates
- **User Management** with role assignment
- **Inventory Tracking** with stock alerts
- **Sales Analytics** and reporting

### Technical Features
- **Responsive Design** optimized for mobile and desktop
- **Dark/Light Theme** toggle
- **Real-time Updates** using WebSocket
- **Image Optimization** and CDN support
- **API Documentation** with OpenAPI/Swagger
- **Error Handling** with standardized responses

## 🚀 Technology Stack

### Backend
- **Spring Boot 3.x** - Main framework
- **Spring Security** - Authentication and authorization
- **Spring Data JPA** - Data persistence
- **MySQL 8** - Primary database
- **JWT** - Token-based authentication
- **OAuth2** - Social login integration
- **Maven** - Dependency management

### Frontend
- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Bootstrap 5** - CSS framework
- **React Context** - State management
- **React Toastify** - Notifications

### DevOps & Tools
- **Docker** - Containerization
- **GitHub Actions** - CI/CD pipeline
- **ESLint** - Code linting
- **Prettier** - Code formatting

## 📋 Prerequisites

- Java 17 or higher
- Node.js 16 or higher
- MySQL 8.0 or higher
- Maven 3.6 or higher
- Git

## 🛠️ Installation

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/bloomkart.git
cd bloomkart
```

### 2. Backend Setup

#### Database Configuration
1. Create a MySQL database:
   ```sql
   CREATE DATABASE bloomkart;
   ```

2. Update `backend/src/main/resources/application.properties`:
   ```properties
   spring.datasource.url=jdbc:mysql://localhost:3306/bloomkart
   spring.datasource.username=your_username
   spring.datasource.password=your_password
   ```

#### Google OAuth2 Setup
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Create OAuth2 credentials
5. Add authorized redirect URIs:
   - `http://localhost:8080/api/oauth2/callback/google`
   - `http://localhost:5173/oauth2/redirect`
6. Update `application.properties` with your credentials:
   ```properties
   spring.security.oauth2.client.registration.google.client-id=your_client_id
   spring.security.oauth2.client.registration.google.client-secret=your_client_secret
   ```

#### Run Backend
```bash
cd backend
mvn clean install
mvn spring-boot:run
```

The backend will start on `http://localhost:8080/api`

### 3. Frontend Setup

#### Install Dependencies
```bash
cd frontend
npm install
```

#### Environment Configuration
Create `.env` file in the frontend directory:
```env
VITE_API_BASE_URL=http://localhost:8080/api
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

#### Run Frontend
```bash
npm run dev
```

The frontend will start on `http://localhost:5173`

## 🔧 Configuration

### Environment Variables

#### Backend
- `DB_USERNAME` - MySQL username
- `DB_PASSWORD` - MySQL password
- `JWT_SECRET` - JWT signing secret
- `GOOGLE_CLIENT_ID` - Google OAuth2 client ID
- `GOOGLE_CLIENT_SECRET` - Google OAuth2 client secret

#### Frontend
- `VITE_API_BASE_URL` - Backend API URL
- `VITE_GOOGLE_CLIENT_ID` - Google OAuth2 client ID

### Database Configuration
The application uses JPA with Hibernate. Database schema is automatically created on startup with `spring.jpa.hibernate.ddl-auto=update`.

## 📚 API Documentation

### Authentication Endpoints
- `POST /auth/login` - User login
- `POST /auth/register` - User registration
- `POST /auth/refresh` - Refresh access token
- `POST /auth/logout` - User logout
- `GET /auth/profile` - Get user profile
- `PUT /auth/profile` - Update user profile

### Product Endpoints
- `GET /products` - Get products with filtering
- `GET /products/{id}` - Get product details
- `GET /products/featured` - Get featured products
- `POST /products` - Create product (Admin)
- `PUT /products/{id}` - Update product (Admin)
- `DELETE /products/{id}` - Delete product (Admin)

### Order Endpoints
- `GET /orders` - Get user orders
- `POST /orders` - Create order
- `GET /orders/{id}` - Get order details
- `PUT /orders/{id}/status` - Update order status (Admin)

### Address Endpoints
- `GET /addresses` - Get user addresses
- `POST /addresses` - Create address
- `PUT /addresses/{id}` - Update address
- `DELETE /addresses/{id}` - Delete address

## 🔒 Security Features

### Authentication
- JWT-based stateless authentication
- Refresh token mechanism
- Token blacklisting for logout
- OAuth2 integration with Google

### Authorization
- Role-based access control
- Method-level security with `@PreAuthorize`
- URL-based security with Spring Security

### Security Headers
- Content Security Policy (CSP)
- X-Frame-Options
- X-Content-Type-Options
- Strict-Transport-Security
- Referrer-Policy

## 🧪 Testing

### Backend Testing
```bash
cd backend
mvn test
```

### Frontend Testing
```bash
cd frontend
npm test
```

### API Testing
Use the provided Postman collection or test with curl:
```bash
# Login
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password"}'
```

## 🚀 Deployment

### Docker Deployment
```bash
# Build and run with Docker Compose
docker-compose up -d
```

### Manual Deployment
1. Build the backend:
   ```bash
   cd backend
   mvn clean package
   ```

2. Build the frontend:
   ```bash
   cd frontend
   npm run build
   ```

3. Deploy the JAR file and built frontend to your server.

## 📊 Monitoring

### Health Checks
- `GET /actuator/health` - Application health
- `GET /actuator/info` - Application info
- `GET /actuator/metrics` - Application metrics

### Logging
The application uses structured logging with different levels:
- `DEBUG` - Detailed debugging information
- `INFO` - General application information
- `WARN` - Warning messages
- `ERROR` - Error messages

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Style
- Backend: Follow Google Java Style Guide
- Frontend: Use ESLint and Prettier configuration
- Commit messages: Use conventional commits format

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Spring Boot team for the excellent framework
- React team for the amazing UI library
- Bootstrap team for the responsive CSS framework
- Google for OAuth2 integration

## 📞 Support

For support and questions:
- Create an issue in the GitHub repository
- Contact the development team
- Check the documentation in the `/docs` folder

---

**BloomKart** - Making flower shopping beautiful and convenient! 🌸
