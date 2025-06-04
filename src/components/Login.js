import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  const [formData, setFormData] = useState({
    identifier: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const history = useHistory();

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.identifier) newErrors.identifier = 'Email or Username is required';
    if (!formData.password) newErrors.password = 'Password is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const response = await axios.post(`${API_URL}/api/auth/login`, formData);

      // Store auth data in localStorage
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('username', response.data.username); // This should come from backend
      localStorage.setItem('isLoggedIn', 'true');

      // Redirect to homepage
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
    <section className="px-4 py-10 max-w-md mx-auto">
      <h1 className="text-2xl font-bold text-center mb-6">Login</h1>
      <div className="bg-white p-6 rounded shadow">
        {errors.general && (
          <p className="text-red-600 text-sm mb-4 text-center">{errors.general}</p>
        )}
        <form onSubmit={handleLogin} className="space-y-4">
          <InputField
            label="Email or Username"
            name="identifier"
            type="text"
            value={formData.identifier}
            onChange={handleChange}
            error={errors.identifier}
          />
          <InputField
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
          />
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:bg-blue-400"
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <p className="text-xs text-center mt-4">
          Don't have an account?{' '}
          <Link to="/signup" className="text-blue-600 hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </section>
  );
};

const InputField = ({ label, name, type, value, onChange, error }) => (
  <div>
    <label className="block text-sm font-medium">{label}</label>
    <input
      name={name}
      type={type}
      value={value}
      onChange={onChange}
      className={`w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
        error ? 'border-red-300 bg-red-50' : 'border-gray-300'
      }`}
      placeholder={`Enter your ${label.toLowerCase()}`}
    />
    {error && <p className="text-red-600 text-xs mt-1">{error}</p>}
  </div>
);

export default Login;
