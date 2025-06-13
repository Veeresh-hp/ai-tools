import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import axios from 'axios';
import PageWrapper from './PageWrapper';

const Signup = () => {
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const history = useHistory();
  const API_URL = process.env.REACT_APP_API_URL || 'https://ai-tools-hub-backend-u2v6.onrender.com';

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email';
    if (!formData.username) newErrors.username = 'Username is required';
    else if (formData.username.length < 3) newErrors.username = 'Min 3 characters';
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 6) newErrors.password = 'Min 6 characters';
    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = 'Passwords do not match';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsLoading(true);
    try {
      const response = await axios.post(`${API_URL}/api/auth/signup`, formData);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('username', response.data.username);
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('userEmail', formData.email);
      history.push('/');
      window.location.reload();
    } catch (error) {
      setErrors({
        general: error.response?.data?.error || 'Signup failed. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageWrapper>
      <div className="min-h-screen bg-gradient-to-br from-[#f7f6fb] to-[#f0eff7] flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <span className="font-black text-2xl text-gray-900">AI</span>
              <div className="w-6 h-6 bg-red-600 rounded-full flex items-center justify-center">
                <i className="fas fa-brain text-white text-sm"></i>
              </div>
              <span className="font-black text-2xl text-gray-900">TOOLS</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Create your account</h2>
            <p className="text-gray-600 text-sm mt-2">Sign up to access amazing AI tools 🚀</p>
          </div>

          {errors.general && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm mb-4">
              {errors.general}
            </div>
          )}

          <form onSubmit={handleSignup} className="space-y-6">
            <InputField
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
            />
            <InputField
              label="Username"
              name="username"
              type="text"
              value={formData.username}
              onChange={handleChange}
              error={errors.username}
            />
            <PasswordField
              label="Password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              show={showPassword}
              toggle={() => setShowPassword(!showPassword)}
            />
            <PasswordField
              label="Confirm Password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              error={errors.confirmPassword}
              show={showConfirmPassword}
              toggle={() => setShowConfirmPassword(!showConfirmPassword)}
            />
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 px-4 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <i className="fas fa-spinner fa-spin mr-2"></i>
                  Signing up...
                </div>
              ) : (
                'Sign Up'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="text-blue-600 hover:underline font-semibold">
                Login here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

// Reusable input field
const InputField = ({ label, name, type, value, onChange, error }) => (
  <div>
    <label htmlFor={name} className="block text-sm font-semibold text-gray-700 mb-2">
      {label}
    </label>
    <input
      id={name}
      name={name}
      type={type}
      value={value}
      onChange={onChange}
      className={`w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
        error ? 'border-red-300 bg-red-50' : 'border-gray-300'
      }`}
      placeholder={`Enter your ${label.toLowerCase()}`}
    />
    {error && <p className="text-red-600 text-xs mt-1">{error}</p>}
  </div>
);

// Reusable password input field with show/hide
const PasswordField = ({ label, name, value, onChange, error, show, toggle }) => (
  <div>
    <label htmlFor={name} className="block text-sm font-semibold text-gray-700 mb-2">
      {label}
    </label>
    <div className="relative">
      <input
        id={name}
        name={name}
        type={show ? 'text' : 'password'}
        value={value}
        onChange={onChange}
        className={`w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
          error ? 'border-red-300 bg-red-50' : 'border-gray-300'
        }`}
        placeholder={`Enter your ${label.toLowerCase()}`}
      />
      <button
        type="button"
        onClick={toggle}
        className="absolute inset-y-0 right-0 px-3 flex items-center text-sm text-gray-600 hover:text-gray-900 focus:outline-none"
      >
        {show ? 'Hide' : 'Show'}
      </button>
    </div>
    {error && <p className="text-red-600 text-xs mt-1">{error}</p>}
  </div>
);

export default Signup;
