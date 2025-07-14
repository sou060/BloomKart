# Payment Integration Guide - BloomKart

This document provides a comprehensive guide to the payment integration system implemented in BloomKart.

## Overview

BloomKart uses **Razorpay** as the primary payment gateway for processing online payments. The integration includes:

- **Frontend**: React components for payment processing
- **Backend**: Spring Boot services for payment management
- **Payment Methods**: User can save and manage payment methods
- **Payment History**: Complete transaction history tracking
- **Refund Processing**: Automated refund request handling

## Features Implemented

### 1. Payment Processing

- ✅ Razorpay integration with secure checkout
- ✅ Payment verification and signature validation
- ✅ Order creation and payment linking
- ✅ Real-time payment status updates

### 2. Payment Methods Management

- ✅ Add/remove payment methods
- ✅ Set default payment method
- ✅ Card type detection (Visa, Mastercard, etc.)
- ✅ Secure card number masking
- ✅ Expiry date validation

### 3. Payment History

- ✅ Complete transaction history
- ✅ Payment status tracking
- ✅ Export functionality
- ✅ Detailed payment information

### 4. Security Features

- ✅ JWT-based authentication
- ✅ Payment signature verification
- ✅ Encrypted data transmission
- ✅ PCI DSS compliance through Razorpay

## Setup Instructions

### 1. Backend Configuration

#### Environment Variables

Add the following to your `application.properties`:

```properties
# Razorpay Configuration
razorpay.key.id=your_razorpay_key_id
razorpay.key.secret=your_razorpay_secret_key
```

#### Database Tables

The following tables are automatically created:

- `payment_methods` - User payment methods
- `orders` - Order and payment information
- `order_items` - Order line items

### 2. Frontend Configuration

#### Environment Variables

Create a `.env` file in the frontend directory:

```env
# API Configuration
VITE_API_URL=http://localhost:8080/api

# Razorpay Configuration
VITE_RAZORPAY_KEY_ID=your_razorpay_key_id_here

# App Configuration
VITE_APP_NAME=BloomKart
VITE_APP_VERSION=1.0.0
```

#### Razorpay Script

The Razorpay script is already included in `index.html`:

```html
<script src="https://checkout.razorpay.com/v1/checkout.js"></script>
```

## API Endpoints

### Payment Methods

- `GET /payment-methods` - Get user payment methods
- `POST /payment-methods` - Add new payment method
- `DELETE /payment-methods/{id}` - Remove payment method
- `PUT /payment-methods/{id}/default` - Set default payment method
- `GET /payment-methods/default` - Get default payment method

### Orders & Payments

- `POST /orders` - Create order and payment
- `POST /orders/verify-payment` - Verify payment signature
- `GET /orders/{id}/payment-status` - Get payment status
- `POST /orders/{id}/refund` - Request refund
- `GET /orders/payment-history` - Get payment history

## Frontend Components

### 1. PaymentService (`src/services/paymentService.js`)

Centralized payment service handling:

- Payment initialization
- Payment verification
- Payment method management
- Amount formatting
- Data validation

### 2. Checkout Component (`src/components/Checkout.jsx`)

Enhanced checkout with:

- Payment validation
- Security notices
- Razorpay integration
- Error handling

### 3. PaymentMethods Component (`src/components/PaymentMethods.jsx`)

Payment method management:

- Add/remove cards
- Set default method
- Card type detection
- Secure display

### 4. PaymentHistory Component (`src/components/PaymentHistory.jsx`)

Transaction history:

- Payment listing
- Status tracking
- Refund requests
- Export functionality

## Payment Flow

### 1. Checkout Process

```
User → Cart → Checkout → Payment Validation → Razorpay → Payment Verification → Order Confirmation
```

### 2. Payment Method Management

```
User → Payment Methods → Add Card → Validation → Save → Set Default (optional)
```

### 3. Payment History

```
User → Payment History → View Transactions → Request Refund (if applicable)
```

## Security Considerations

### 1. Data Protection

- Card numbers are masked in display
- CVV is never stored
- All data transmitted over HTTPS
- JWT tokens for authentication

### 2. Payment Security

- Razorpay handles PCI compliance
- Payment signatures verified
- Server-side validation
- Secure API endpoints

### 3. User Privacy

- User data encrypted
- Payment methods linked to user account
- Audit trail maintained

## Testing

### Test Cards (Razorpay Test Mode)

- **Visa**: 4111 1111 1111 1111
- **Mastercard**: 5555 5555 5555 4444
- **American Express**: 3782 822463 10005

### Test Scenarios

1. **Successful Payment**: Use any test card with valid details
2. **Failed Payment**: Use card number 4000 0000 0000 0002
3. **Network Error**: Use card number 4000 0000 0000 9995

## Error Handling

### Common Errors

- **Payment Failed**: Insufficient funds, card declined
- **Network Error**: Connection issues
- **Validation Error**: Invalid card details
- **Verification Error**: Payment signature mismatch

### Error Recovery

- Automatic retry for network errors
- Clear error messages to users
- Fallback payment options
- Support contact information

## Monitoring & Analytics

### Payment Metrics

- Success rate tracking
- Average transaction value
- Payment method preferences
- Failed payment analysis

### Logging

- Payment attempts logged
- Error tracking
- User activity monitoring
- Security event logging

## Deployment Checklist

### Backend

- [ ] Razorpay keys configured
- [ ] Database tables created
- [ ] CORS settings updated
- [ ] SSL certificate installed
- [ ] Environment variables set

### Frontend

- [ ] Environment variables configured
- [ ] Razorpay script loaded
- [ ] API endpoints updated
- [ ] Build optimized
- [ ] CDN configured

### Production

- [ ] Test payments completed
- [ ] Error handling verified
- [ ] Security audit passed
- [ ] Performance tested
- [ ] Backup procedures in place

## Support & Troubleshooting

### Common Issues

1. **Payment not processing**: Check Razorpay keys
2. **Card not saving**: Verify validation rules
3. **History not loading**: Check API permissions
4. **Refund not working**: Verify order status

### Debug Mode

Enable debug logging in `application.properties`:

```properties
logging.level.com.bloomkart=DEBUG
logging.level.com.razorpay=DEBUG
```

### Contact Information

- **Razorpay Support**: https://razorpay.com/support/
- **Technical Issues**: Check application logs
- **User Issues**: Review payment history

## Future Enhancements

### Planned Features

- [ ] Multiple payment gateways
- [ ] Subscription payments
- [ ] Installment plans
- [ ] Digital wallet integration
- [ ] International payments
- [ ] Advanced analytics

### Performance Optimizations

- [ ] Payment method caching
- [ ] Async payment processing
- [ ] Webhook optimization
- [ ] Database indexing

---

**Note**: This payment integration is production-ready and follows industry best practices for security and user experience.
