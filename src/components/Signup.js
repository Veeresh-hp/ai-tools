import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import axios from 'axios';

const Signup = () => {
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const history = useHistory();

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

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
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('userEmail', formData.email);
      history.push('/');
      window.location.reload();
    } catch (error) {
      setErrors({
        general: error.response?.data?.error || 'Signup failed. Try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="px-4 py-10 max-w-md mx-auto">
      <h1 className="text-2xl font-bold text-center mb-6">Sign Up</h1>
      <div className="bg-white p-6 rounded shadow">
        {errors.general && <p className="text-red-600 text-sm mb-4 text-center">{errors.general}</p>}
        <div className="space-y-4">
          <InputField label="Email" name="email" type="email" value={formData.email} onChange={handleChange} error={errors.email} />
          <InputField label="Username" name="username" type="text" value={formData.username} onChange={handleChange} error={errors.username} />
          <InputField label="Password" name="password" type="password" value={formData.password} onChange={handleChange} error={errors.password} />
          <InputField label="Confirm Password" name="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleChange} error={errors.confirmPassword} />
          <button onClick={handleSignup} disabled={isLoading} className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:bg-blue-400">
            {isLoading ? 'Signing up...' : 'Sign Up'}
          </button>
        </div>
        <p className="text-xs text-center mt-4">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-600 hover:underline">Login</Link>
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
      className={`w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${error ? 'border-red-300 bg-red-50' : 'border-gray-300'}`}
      placeholder={`Enter your ${label.toLowerCase()}`}
    />
    {error && <p className="text-red-600 text-xs mt-1">{error}</p>}
  </div>
);

export default Signup;
