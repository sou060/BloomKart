import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import {
  FaCreditCard,
  FaPlus,
  FaTrash,
  FaEdit,
  FaLock,
  FaShieldAlt,
  FaCheckCircle,
  FaTimes,
} from 'react-icons/fa';
import paymentService from '../services/paymentService';

const PaymentMethods = () => {
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    cardNumber: '',
    cardHolderName: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
    isDefault: false,
  });

  useEffect(() => {
    fetchPaymentMethods();
  }, []);

  const fetchPaymentMethods = async () => {
    try {
      setLoading(true);
      const methods = await paymentService.getPaymentMethods();
      setPaymentMethods(methods);
    } catch (error) {
      console.error('Error fetching payment methods:', error);
      toast.error('Failed to load payment methods');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleAddPaymentMethod = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.cardNumber || !formData.cardHolderName || !formData.expiryMonth || !formData.expiryYear || !formData.cvv) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      const newMethod = await paymentService.addPaymentMethod(formData);
      setPaymentMethods(prev => [...prev, newMethod]);
      setShowAddModal(false);
      setFormData({
        cardNumber: '',
        cardHolderName: '',
        expiryMonth: '',
        expiryYear: '',
        cvv: '',
        isDefault: false,
      });
    } catch (error) {
      console.error('Error adding payment method:', error);
    }
  };

  const handleRemovePaymentMethod = async (methodId) => {
    if (window.confirm('Are you sure you want to remove this payment method?')) {
      try {
        await paymentService.removePaymentMethod(methodId);
        setPaymentMethods(prev => prev.filter(method => method.id !== methodId));
      } catch (error) {
        console.error('Error removing payment method:', error);
      }
    }
  };

  const formatCardNumber = (cardNumber) => {
    return cardNumber.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
  };

  const maskCardNumber = (cardNumber) => {
    const cleaned = cardNumber.replace(/\s/g, '');
    const lastFour = cleaned.slice(-4);
    return `**** **** **** ${lastFour}`;
  };

  const getCardType = (cardNumber) => {
    const cleaned = cardNumber.replace(/\s/g, '');
    if (/^4/.test(cleaned)) return 'Visa';
    if (/^5[1-5]/.test(cleaned)) return 'Mastercard';
    if (/^3[47]/.test(cleaned)) return 'American Express';
    if (/^6/.test(cleaned)) return 'Discover';
    return 'Unknown';
  };

  if (loading) {
    return (
      <div className="container py-5">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="row">
        <div className="col-lg-8 mx-auto">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2>
              <FaCreditCard className="me-2" />
              Payment Methods
            </h2>
            <button
              className="btn btn-primary"
              onClick={() => setShowAddModal(true)}
            >
              <FaPlus className="me-2" />
              Add Payment Method
            </button>
          </div>

          {/* Security Notice */}
          <div className="alert alert-info mb-4">
            <FaShieldAlt className="me-2" />
            <strong>Secure Payment Storage:</strong> Your payment information is encrypted and stored securely. 
            We never store your CVV or full card details.
          </div>

          {/* Payment Methods List */}
          {paymentMethods.length === 0 ? (
            <div className="text-center py-5">
              <FaCreditCard size={64} className="text-muted mb-3" />
              <h5>No Payment Methods</h5>
              <p className="text-muted">Add payment methods for faster checkout.</p>
              <button
                className="btn btn-primary"
                onClick={() => setShowAddModal(true)}
              >
                <FaPlus className="me-2" />
                Add Payment Method
              </button>
            </div>
          ) : (
            <div className="row">
              {paymentMethods.map((method) => (
                <div key={method.id} className="col-md-6 mb-3">
                  <div className="card h-100">
                    <div className="card-body">
                      <div className="d-flex justify-content-between align-items-start mb-3">
                        <div>
                          <h6 className="card-title mb-1">
                            {getCardType(method.cardNumber)} •••• {method.cardNumber.slice(-4)}
                          </h6>
                          <p className="card-text text-muted mb-1">
                            {method.cardHolderName}
                          </p>
                          <p className="card-text text-muted small">
                            Expires {method.expiryMonth}/{method.expiryYear}
                          </p>
                        </div>
                        <div className="d-flex gap-2">
                          {method.isDefault && (
                            <span className="badge bg-success">
                              <FaCheckCircle className="me-1" />
                              Default
                            </span>
                          )}
                          <button
                            className="btn btn-outline-danger btn-sm"
                            onClick={() => handleRemovePaymentMethod(method.id)}
                            title="Remove payment method"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </div>
                      
                      <div className="card-number-display mb-3">
                        <code className="text-muted">
                          {maskCardNumber(method.cardNumber)}
                        </code>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Add Payment Method Modal */}
      {showAddModal && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  <FaCreditCard className="me-2" />
                  Add Payment Method
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowAddModal(false)}
                ></button>
              </div>
              <form onSubmit={handleAddPaymentMethod}>
                <div className="modal-body">
                  <div className="row">
                    <div className="col-md-12 mb-3">
                      <label className="form-label">Card Number</label>
                      <input
                        type="text"
                        className="form-control"
                        name="cardNumber"
                        value={formData.cardNumber}
                        onChange={handleInputChange}
                        placeholder="1234 5678 9012 3456"
                        maxLength="19"
                      />
                    </div>
                    <div className="col-md-12 mb-3">
                      <label className="form-label">Cardholder Name</label>
                      <input
                        type="text"
                        className="form-control"
                        name="cardHolderName"
                        value={formData.cardHolderName}
                        onChange={handleInputChange}
                        placeholder="John Doe"
                      />
                    </div>
                    <div className="col-md-4 mb-3">
                      <label className="form-label">Expiry Month</label>
                      <select
                        className="form-select"
                        name="expiryMonth"
                        value={formData.expiryMonth}
                        onChange={handleInputChange}
                      >
                        <option value="">Month</option>
                        {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
                          <option key={month} value={month.toString().padStart(2, '0')}>
                            {month.toString().padStart(2, '0')}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="col-md-4 mb-3">
                      <label className="form-label">Expiry Year</label>
                      <select
                        className="form-select"
                        name="expiryYear"
                        value={formData.expiryYear}
                        onChange={handleInputChange}
                      >
                        <option value="">Year</option>
                        {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() + i).map(year => (
                          <option key={year} value={year}>
                            {year}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="col-md-4 mb-3">
                      <label className="form-label">CVV</label>
                      <input
                        type="password"
                        className="form-control"
                        name="cvv"
                        value={formData.cvv}
                        onChange={handleInputChange}
                        placeholder="123"
                        maxLength="4"
                      />
                    </div>
                  </div>
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      name="isDefault"
                      checked={formData.isDefault}
                      onChange={handleInputChange}
                    />
                    <label className="form-check-label">
                      Set as default payment method
                    </label>
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowAddModal(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    <FaPlus className="me-2" />
                    Add Payment Method
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentMethods; 