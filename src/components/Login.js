import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const history = useHistory();
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const response = await axios.post(`${API_URL}/api/auth/login`, formData);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('userEmail', formData.email);
      history.push('/');
      window.location.reload();
    } catch (error) {
      setErrors({
        general: error.response?.data?.error || 'Login failed. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="px-4 sm:px-6 md:px-10 lg:px-16 py-10 max-w-md mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">Login</h1>
      <div className="bg-white p-6 rounded-md shadow-sm border border-gray-200">
        {errors.general && (
          <p className="text-red-600 text-sm mb-4 text-center">{errors.general}</p>
        )}
        <div className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.email ? 'border-red-300 bg-red-50' : 'border-gray-300'
              }`}
              placeholder="Enter your email"
            />
            {errors.email && <p className="text-red-600 text-xs mt-1">{errors.email}</p>}
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              id="password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.password ? 'border-red-300 bg-red-50' : 'border-gray-300'
              }`}
              placeholder="Enter your password"
            />
            {errors.password && <p className="text-red-600 text-xs mt-1">{errors.password}</p>}
          </div>
          <button
            onClick={handleLogin}
            disabled={isLoading}
            className="w-full bg-blue-600 text-white text-sm font-semibold py-2 rounded-md hover:bg-blue-700 disabled:bg-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <i className="fas fa-spinner fa-spin mr-2"></i>
                Logging in...
              </div>
            ) : (
              'Login'
            )}
          </button>
        </div>
        <p className="text-xs text-gray-600 mt-4 text-center">
          Don’t have an account?{' '}
          <Link to="/signup" className="text-blue-600 hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </section>
  );
};

export default Login;
