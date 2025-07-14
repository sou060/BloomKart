import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import {
  FaCreditCard,
  FaHistory,
  FaCheckCircle,
  FaTimes,
  FaClock,
  FaExclamationTriangle,
  FaDownload,
  FaEye,
  FaUndo,
} from "react-icons/fa";
import paymentService from "../services/paymentService";

const PaymentHistory = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [showRefundModal, setShowRefundModal] = useState(false);
  const [refundData, setRefundData] = useState({
    amount: "",
    reason: "",
  });

  useEffect(() => {
    fetchPaymentHistory();
  }, []);

  const fetchPaymentHistory = async () => {
    try {
      setLoading(true);
      const history = await paymentService.getPaymentHistory();
      setPayments(history);
    } catch (error) {
      console.error("Error fetching payment history:", error);
      toast.error("Failed to load payment history");
    } finally {
      setLoading(false);
    }
  };

  const handleRefundRequest = async (e) => {
    e.preventDefault();

    if (!refundData.amount || !refundData.reason) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      await paymentService.processRefund(
        selectedPayment.orderId,
        parseFloat(refundData.amount),
        refundData.reason
      );
      setShowRefundModal(false);
      setRefundData({ amount: "", reason: "" });
      fetchPaymentHistory(); // Refresh the list
    } catch (error) {
      console.error("Error processing refund:", error);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "COMPLETED":
        return <FaCheckCircle className="text-success" />;
      case "PENDING":
        return <FaClock className="text-warning" />;
      case "FAILED":
        return <FaTimes className="text-danger" />;
      case "REFUNDED":
        return <FaUndo className="text-info" />;
      default:
        return <FaExclamationTriangle className="text-secondary" />;
    }
  };

  const getStatusBadge = (status) => {
    const statusClasses = {
      COMPLETED: "bg-success",
      PENDING: "bg-warning",
      FAILED: "bg-danger",
      REFUNDED: "bg-info",
    };

    return (
      <span className={`badge ${statusClasses[status] || "bg-secondary"}`}>
        {status}
      </span>
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
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
        <div className="col-lg-10 mx-auto">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2>
              <FaHistory className="me-2" />
              Payment History
            </h2>
            <button
              className="btn btn-outline-primary"
              onClick={() => window.print()}
            >
              <FaDownload className="me-2" />
              Export
            </button>
          </div>

          {payments.length === 0 ? (
            <div className="text-center py-5">
              <FaHistory size={64} className="text-muted mb-3" />
              <h5>No Payment History</h5>
              <p className="text-muted">
                Your payment history will appear here after making purchases.
              </p>
            </div>
          ) : (
            <div className="card">
              <div className="card-body">
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Order ID</th>
                        <th>Amount</th>
                        <th>Payment Method</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {payments.map((payment) => (
                        <tr key={payment.id}>
                          <td>
                            <div className="d-flex align-items-center">
                              {getStatusIcon(payment.status)}
                              <span className="ms-2">
                                {formatDate(payment.createdAt)}
                              </span>
                            </div>
                          </td>
                          <td>
                            <code>#{payment.orderId}</code>
                          </td>
                          <td>
                            <strong>
                              {paymentService.formatAmount(payment.amount)}
                            </strong>
                          </td>
                          <td>
                            <div className="d-flex align-items-center">
                              <FaCreditCard className="me-2" />
                              <span>{payment.paymentMethod}</span>
                            </div>
                          </td>
                          <td>{getStatusBadge(payment.status)}</td>
                          <td>
                            <div className="btn-group btn-group-sm">
                              <button
                                className="btn btn-outline-primary"
                                onClick={() => setSelectedPayment(payment)}
                                title="View Details"
                              >
                                <FaEye />
                              </button>
                              {payment.status === "COMPLETED" && (
                                <button
                                  className="btn btn-outline-warning"
                                  onClick={() => {
                                    setSelectedPayment(payment);
                                    setRefundData({
                                      amount: payment.amount.toString(),
                                      reason: "",
                                    });
                                    setShowRefundModal(true);
                                  }}
                                  title="Request Refund"
                                >
                                  <FaUndo />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Payment Details Modal */}
      {selectedPayment && (
        <div
          className="modal fade show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  <FaCreditCard className="me-2" />
                  Payment Details
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setSelectedPayment(null)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="row">
                  <div className="col-md-6">
                    <h6>Payment Information</h6>
                    <dl className="row">
                      <dt className="col-sm-4">Payment ID:</dt>
                      <dd className="col-sm-8">
                        <code>{selectedPayment.paymentId}</code>
                      </dd>

                      <dt className="col-sm-4">Order ID:</dt>
                      <dd className="col-sm-8">
                        <code>#{selectedPayment.orderId}</code>
                      </dd>

                      <dt className="col-sm-4">Amount:</dt>
                      <dd className="col-sm-8">
                        <strong>
                          {paymentService.formatAmount(selectedPayment.amount)}
                        </strong>
                      </dd>

                      <dt className="col-sm-4">Status:</dt>
                      <dd className="col-sm-8">
                        {getStatusBadge(selectedPayment.status)}
                      </dd>
                    </dl>
                  </div>
                  <div className="col-md-6">
                    <h6>Transaction Details</h6>
                    <dl className="row">
                      <dt className="col-sm-4">Date:</dt>
                      <dd className="col-sm-8">
                        {formatDate(selectedPayment.createdAt)}
                      </dd>

                      <dt className="col-sm-4">Method:</dt>
                      <dd className="col-sm-8">
                        {selectedPayment.paymentMethod}
                      </dd>

                      <dt className="col-sm-4">Currency:</dt>
                      <dd className="col-sm-8">INR</dd>

                      {selectedPayment.description && (
                        <>
                          <dt className="col-sm-4">Description:</dt>
                          <dd className="col-sm-8">
                            {selectedPayment.description}
                          </dd>
                        </>
                      )}
                    </dl>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setSelectedPayment(null)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Refund Request Modal */}
      {showRefundModal && (
        <div
          className="modal fade show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  <FaUndo className="me-2" />
                  Request Refund
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowRefundModal(false)}
                ></button>
              </div>
              <form onSubmit={handleRefundRequest}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Refund Amount</label>
                    <input
                      type="number"
                      className="form-control"
                      value={refundData.amount}
                      onChange={(e) =>
                        setRefundData((prev) => ({
                          ...prev,
                          amount: e.target.value,
                        }))
                      }
                      step="0.01"
                      min="0"
                      max={selectedPayment?.amount || 0}
                      required
                    />
                    <div className="form-text">
                      Maximum refund amount:{" "}
                      {paymentService.formatAmount(
                        selectedPayment?.amount || 0
                      )}
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Reason for Refund</label>
                    <textarea
                      className="form-control"
                      rows="3"
                      value={refundData.reason}
                      onChange={(e) =>
                        setRefundData((prev) => ({
                          ...prev,
                          reason: e.target.value,
                        }))
                      }
                      placeholder="Please provide a reason for the refund request..."
                      required
                    ></textarea>
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowRefundModal(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-warning">
                    <FaUndo className="me-2" />
                    Submit Refund Request
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

export default PaymentHistory;
