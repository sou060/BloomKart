import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";
import api from "../axios";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaStar,
  FaStarOfLife,
  FaMapMarkerAlt,
  FaUser,
  FaPhone,
  FaHome,
  FaBriefcase,
  FaEllipsisH,
  FaCheck,
  FaTimes,
  FaAddressBook,
} from "react-icons/fa";

const Addresses = () => {
  const { user } = useContext(AuthContext);
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [formData, setFormData] = useState({
    addressType: "HOME",
    fullName: "",
    phoneNumber: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "India",
    isDefault: false,
  });

  const addressTypes = [
    { value: "HOME", label: "Home", icon: FaHome },
    { value: "WORK", label: "Work", icon: FaBriefcase },
    { value: "OTHER", label: "Other", icon: FaMapMarkerAlt },
  ];

  const countries = [
    "India",
    "United States",
    "United Kingdom",
    "Canada",
    "Australia",
    "Germany",
    "France",
    "Japan",
    "China",
    "Brazil",
  ];

  const states = [
    "Andhra Pradesh",
    "Arunachal Pradesh",
    "Assam",
    "Bihar",
    "Chhattisgarh",
    "Goa",
    "Gujarat",
    "Haryana",
    "Himachal Pradesh",
    "Jharkhand",
    "Karnataka",
    "Kerala",
    "Madhya Pradesh",
    "Maharashtra",
    "Manipur",
    "Meghalaya",
    "Mizoram",
    "Nagaland",
    "Odisha",
    "Punjab",
    "Rajasthan",
    "Sikkim",
    "Tamil Nadu",
    "Telangana",
    "Tripura",
    "Uttar Pradesh",
    "Uttarakhand",
    "West Bengal",
  ];

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      setLoading(true);
      const response = await api.get("/addresses");
      setAddresses(response.data);
    } catch (error) {
      console.error("Error fetching addresses:", error);
      toast.error("Failed to load addresses");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const resetForm = () => {
    setFormData({
      addressType: "HOME",
      fullName: "",
      phoneNumber: "",
      addressLine1: "",
      addressLine2: "",
      city: "",
      state: "",
      postalCode: "",
      country: "India",
      isDefault: false,
    });
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("/addresses", formData);
      setAddresses((prev) => [...prev, response.data]);
      setShowAddModal(false);
      resetForm();
      toast.success("Address added successfully!");
    } catch (error) {
      console.error("Error adding address:", error);
      toast.error(error.response?.data?.message || "Failed to add address");
    }
  };

  const handleEditAddress = async (e) => {
    e.preventDefault();
    try {
      const response = await api.put(
        `/addresses/${editingAddress.id}`,
        formData
      );
      setAddresses((prev) =>
        prev.map((addr) =>
          addr.id === editingAddress.id ? response.data : addr
        )
      );
      setShowEditModal(false);
      setEditingAddress(null);
      resetForm();
      toast.success("Address updated successfully!");
    } catch (error) {
      console.error("Error updating address:", error);
      toast.error(error.response?.data?.message || "Failed to update address");
    }
  };

  const handleDeleteAddress = async (addressId) => {
    if (window.confirm("Are you sure you want to delete this address?")) {
      try {
        await api.delete(`/addresses/${addressId}`);
        setAddresses((prev) => prev.filter((addr) => addr.id !== addressId));
        toast.success("Address deleted successfully!");
      } catch (error) {
        console.error("Error deleting address:", error);
        toast.error(
          error.response?.data?.message || "Failed to delete address"
        );
      }
    }
  };

  const handleSetDefault = async (addressId) => {
    try {
      const response = await api.put(`/addresses/${addressId}/default`);
      setAddresses((prev) =>
        prev.map((addr) => ({
          ...addr,
          isDefault: addr.id === addressId,
        }))
      );
      toast.success("Default address updated!");
    } catch (error) {
      console.error("Error setting default address:", error);
      toast.error("Failed to set default address");
    }
  };

  const openEditModal = (address) => {
    setEditingAddress(address);
    setFormData({
      addressType: address.addressType,
      fullName: address.fullName,
      phoneNumber: address.phoneNumber,
      addressLine1: address.addressLine1,
      addressLine2: address.addressLine2 || "",
      city: address.city,
      state: address.state,
      postalCode: address.postalCode,
      country: address.country,
      isDefault: address.isDefault,
    });
    setShowEditModal(true);
  };

  const openAddModal = () => {
    resetForm();
    setShowAddModal(true);
  };

  const AddressModal = ({ isOpen, onClose, onSubmit, title, submitText }) => {
    if (!isOpen) return null;

    return (
      <div
        className="modal fade show"
        style={{ display: "block" }}
        tabIndex="-1"
      >
        <div className="modal-dialog modal-lg modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">
                <FaAddressBook className="me-2" />
                {title}
              </h5>
              <button type="button" className="btn-close" onClick={onClose}>
                <FaTimes />
              </button>
            </div>
            <form onSubmit={onSubmit}>
              <div className="modal-body">
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">
                      <FaMapMarkerAlt className="me-1" />
                      Address Type{" "}
                      <FaStarOfLife className="text-danger" size={8} />
                    </label>
                    <select
                      className="form-select"
                      name="addressType"
                      value={formData.addressType}
                      onChange={handleInputChange}
                      required
                    >
                      {addressTypes.map((type) => {
                        const Icon = type.icon;
                        return (
                          <option key={type.value} value={type.value}>
                            <Icon className="me-1" />
                            {type.label}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">
                      <FaUser className="me-1" />
                      Full Name{" "}
                      <FaStarOfLife className="text-danger" size={8} />
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">
                      <FaPhone className="me-1" />
                      Phone Number{" "}
                      <FaStarOfLife className="text-danger" size={8} />
                    </label>
                    <input
                      type="tel"
                      className="form-control"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">
                      <FaMapMarkerAlt className="me-1" />
                      Address Line 1{" "}
                      <FaStarOfLife className="text-danger" size={8} />
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      name="addressLine1"
                      value={formData.addressLine1}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="col-12 mb-3">
                    <label className="form-label">
                      <FaMapMarkerAlt className="me-1" />
                      Address Line 2
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      name="addressLine2"
                      value={formData.addressLine2}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="col-md-4 mb-3">
                    <label className="form-label">
                      <FaMapMarkerAlt className="me-1" />
                      City <FaStarOfLife className="text-danger" size={8} />
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="col-md-4 mb-3">
                    <label className="form-label">
                      <FaMapMarkerAlt className="me-1" />
                      State <FaStarOfLife className="text-danger" size={8} />
                    </label>
                    <select
                      className="form-select"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Select State</option>
                      {states.map((state) => (
                        <option key={state} value={state}>
                          {state}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-4 mb-3">
                    <label className="form-label">
                      <FaMapMarkerAlt className="me-1" />
                      Postal Code{" "}
                      <FaStarOfLife className="text-danger" size={8} />
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      name="postalCode"
                      value={formData.postalCode}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">
                      <FaMapMarkerAlt className="me-1" />
                      Country <FaStarOfLife className="text-danger" size={8} />
                    </label>
                    <select
                      className="form-select"
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      required
                    >
                      {countries.map((country) => (
                        <option key={country} value={country}>
                          {country}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-6 mb-3 d-flex align-items-end">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        name="isDefault"
                        id="isDefault"
                        checked={formData.isDefault}
                        onChange={handleInputChange}
                      />
                      <label className="form-check-label" htmlFor="isDefault">
                        <FaStar className="me-1" />
                        Set as default address
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={onClose}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  <FaCheck className="me-1" />
                  {submitText}
                </button>
              </div>
            </form>
          </div>
        </div>
        <div className="modal-backdrop fade show"></div>
      </div>
    );
  };

  const AddressCard = ({ address }) => {
    const addressTypeConfig = addressTypes.find(
      (type) => type.value === address.addressType
    );
    const Icon = addressTypeConfig?.icon || FaMapMarkerAlt;

    return (
      <div className="card h-100">
        <div className="card-header d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center">
            <Icon className="me-2" />
            <span className="fw-bold">
              {addressTypeConfig?.label || address.addressType}
            </span>
            {address.isDefault && (
              <span className="badge bg-primary ms-2">
                <FaStar className="me-1" />
                Default
              </span>
            )}
          </div>
          <div className="dropdown">
            <button
              className="btn btn-sm btn-outline-secondary"
              type="button"
              data-bs-toggle="dropdown"
            >
              <FaEllipsisH />
            </button>
            <ul className="dropdown-menu">
              <li>
                <button
                  className="dropdown-item"
                  onClick={() => openEditModal(address)}
                >
                  <FaEdit className="me-2" />
                  Edit
                </button>
              </li>
              {!address.isDefault && (
                <li>
                  <button
                    className="dropdown-item"
                    onClick={() => handleSetDefault(address.id)}
                  >
                    <FaStar className="me-2" />
                    Set as Default
                  </button>
                </li>
              )}
              {!address.isDefault && (
                <li>
                  <hr className="dropdown-divider" />
                </li>
              )}
              {!address.isDefault && (
                <li>
                  <button
                    className="dropdown-item text-danger"
                    onClick={() => handleDeleteAddress(address.id)}
                  >
                    <FaTrash className="me-2" />
                    Delete
                  </button>
                </li>
              )}
            </ul>
          </div>
        </div>
        <div className="card-body">
          <h6 className="card-title">{address.fullName}</h6>
          <p className="card-text text-muted mb-2">
            <FaPhone className="me-1" />
            {address.phoneNumber}
          </p>
          <div className="card-text">
            <div>{address.addressLine1}</div>
            {address.addressLine2 && <div>{address.addressLine2}</div>}
            <div>
              {address.city}, {address.state} {address.postalCode}
            </div>
            <div>{address.country}</div>
          </div>
        </div>
        <div className="card-footer text-muted">
          <small>
            Created: {new Date(address.createdAt).toLocaleDateString()}
          </small>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="container mt-4">
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Loading addresses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2>
            <FaAddressBook className="me-2" />
            My Addresses
          </h2>
          <p className="text-muted">Manage your delivery addresses</p>
        </div>
        <button className="btn btn-primary" onClick={openAddModal}>
          <FaPlus className="me-1" />
          Add New Address
        </button>
      </div>

      {addresses.length === 0 ? (
        <div className="text-center py-5">
          <FaAddressBook size={64} className="text-muted mb-3" />
          <h5>No Saved Addresses</h5>
          <p className="text-muted">Add addresses for faster checkout.</p>
          <button className="btn btn-primary" onClick={openAddModal}>
            <FaPlus className="me-1" />
            Add Your First Address
          </button>
        </div>
      ) : (
        <div className="row">
          {addresses.map((address) => (
            <div key={address.id} className="col-md-6 col-lg-4 mb-4">
              <AddressCard address={address} />
            </div>
          ))}
        </div>
      )}

      {/* Add Address Modal */}
      <AddressModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={handleAddAddress}
        title="Add New Address"
        submitText="Add Address"
      />

      {/* Edit Address Modal */}
      <AddressModal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setEditingAddress(null);
        }}
        onSubmit={handleEditAddress}
        title="Edit Address"
        submitText="Update Address"
      />
    </div>
  );
};

export default Addresses;
