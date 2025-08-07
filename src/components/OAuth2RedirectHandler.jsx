import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const OAuth2RedirectHandler = () => {
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Function to get URL parameters
    const getUrlParameter = (name) => {
      name = name.replace(/[[]/, '\\[').replace(/[\]]/, '\\]');
      const regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
      const results = regex.exec(location.search);
      return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
    };

    const token = getUrlParameter('token');
    const refreshToken = getUrlParameter('refresh_token');
    const error = getUrlParameter('error');

    if (token) {
      // Get user info from token (you might need to decode JWT or make an API call)
      localStorage.setItem('accessToken', token);
      localStorage.setItem('refreshToken', refreshToken);
      
      // Redirect to home page
      navigate('/');
    } else {
      setError(error || 'Authentication failed');
      // Redirect to login page after a delay
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    }
  }, [location, navigate]);

  if (error) {
    return (
      <div className="auth-container">
        <div className="auth-form-container">
          <div className="alert alert-danger">
            {error}
          </div>
          <p className="text-center">Redirecting to login page...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <div className="auth-form-container">
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Processing authentication, please wait...</p>
        </div>
      </div>
    </div>
  );
};

export default OAuth2RedirectHandler;