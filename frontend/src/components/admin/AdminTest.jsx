import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import api from "../../axios";

const AdminTest = () => {
  const { user, accessToken } = useContext(AuthContext);
  const [testResults, setTestResults] = useState({});

  const testAdminAccess = async () => {
    const results = {};

    // Test 1: Check user info
    results.user = user;
    results.accessToken = accessToken ? "Present" : "Missing";

    // Test 2: Decode token
    if (accessToken) {
      try {
        const payload = JSON.parse(atob(accessToken.split(".")[1]));
        results.tokenPayload = payload;
        results.tokenRole = payload.role;
      } catch (error) {
        results.tokenError = error.message;
      }
    }

    // Test 3: Test admin endpoint
    try {
      const response = await api.get("/admin/users?page=0&size=5");
      results.adminEndpoint = "Success";
      results.adminData = response.data;
    } catch (error) {
      results.adminEndpoint = "Failed";
      results.adminError = error.response?.data || error.message;
    }

    // Test 4: Test profile endpoint
    try {
      const response = await api.get("/auth/profile");
      results.profileEndpoint = "Success";
      results.profileData = response.data;
    } catch (error) {
      results.profileEndpoint = "Failed";
      results.profileError = error.response?.data || error.message;
    }

    setTestResults(results);
  };

  useEffect(() => {
    testAdminAccess();
  }, [user, accessToken]);

  return (
    <div className="container py-5">
      <h2>Admin Authentication Test</h2>

      <div className="row">
        <div className="col-md-6">
          <div className="card mb-3">
            <div className="card-header">
              <h5>User Information</h5>
            </div>
            <div className="card-body">
              <pre>{JSON.stringify(testResults.user, null, 2)}</pre>
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card mb-3">
            <div className="card-header">
              <h5>Token Information</h5>
            </div>
            <div className="card-body">
              <p>
                <strong>Token Present:</strong> {testResults.accessToken}
              </p>
              <p>
                <strong>Token Role:</strong> {testResults.tokenRole}
              </p>
              {testResults.tokenPayload && (
                <details>
                  <summary>Token Payload</summary>
                  <pre>{JSON.stringify(testResults.tokenPayload, null, 2)}</pre>
                </details>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-md-6">
          <div className="card mb-3">
            <div className="card-header">
              <h5>Admin Endpoint Test</h5>
            </div>
            <div className="card-body">
              <p>
                <strong>Status:</strong> {testResults.adminEndpoint}
              </p>
              {testResults.adminError && (
                <div className="alert alert-danger">
                  <strong>Error:</strong>{" "}
                  {JSON.stringify(testResults.adminError, null, 2)}
                </div>
              )}
              {testResults.adminData && (
                <details>
                  <summary>Response Data</summary>
                  <pre>{JSON.stringify(testResults.adminData, null, 2)}</pre>
                </details>
              )}
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card mb-3">
            <div className="card-header">
              <h5>Profile Endpoint Test</h5>
            </div>
            <div className="card-body">
              <p>
                <strong>Status:</strong> {testResults.profileEndpoint}
              </p>
              {testResults.profileError && (
                <div className="alert alert-danger">
                  <strong>Error:</strong>{" "}
                  {JSON.stringify(testResults.profileError, null, 2)}
                </div>
              )}
              {testResults.profileData && (
                <details>
                  <summary>Response Data</summary>
                  <pre>{JSON.stringify(testResults.profileData, null, 2)}</pre>
                </details>
              )}
            </div>
          </div>
        </div>
      </div>

      <button className="btn btn-primary" onClick={testAdminAccess}>
        Refresh Test
      </button>
    </div>
  );
};

export default AdminTest;
