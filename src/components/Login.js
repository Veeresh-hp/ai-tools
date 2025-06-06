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
     const [showResetModal, setShowResetModal] = useState(false);
     const [resetEmail, setResetEmail] = useState('');
     const [resetMessage, setResetMessage] = useState('');
     const [resetError, setResetError] = useState('');
     const history = useHistory();

     const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

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
         newErrors.email = 'Email is invalid';
       }
       if (!formData.password) {
         newErrors.password = 'Password is required';
       } else if (formData.password.length < 6) {
         newErrors.password = 'Password must be at least 6 characters';
       }
       setErrors(newErrors);
       return Object.keys(newErrors).length === 0;
     };

     const handleSubmit = async (e) => {
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

     const handleResetSubmit = async (e) => {
       e.preventDefault();
       if (!resetEmail || !/\S+@\S+\.\S+/.test(resetEmail)) {
         setResetError('Please enter a valid email');
         return;
       }
       setResetError('');
       setResetMessage('');
       try {
         const response = await axios.post(`${API_URL}/api/auth/forgot-password`, { email: resetEmail });
         setResetMessage(response.data.message);
         setResetEmail('');
       } catch (error) {
         setResetError(error.response?.data?.error || 'Failed to send reset email');
       }
     };

     return (
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
             <h2 className="text-2xl font-bold text-gray-900">Welcome Back</h2>
             <p className="text-gray-600 text-sm mt-2">Sign in to access your AI tools</p>
           </div>

           <form onSubmit={handleSubmit} className="space-y-6">
             {errors.general && (
               <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
                 {errors.general}
               </div>
             )}

             <div>
               <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                 Email Address
               </label>
               <input
                 type="email"
                 id="email"
                 name="email"
                 value={formData.email}
                 onChange={handleChange}
                 className={`w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                   errors.email ? 'border-red-300 bg-red-50' : 'border-gray-300'
                 }`}
                 placeholder="Enter your email"
               />
               {errors.email && <p className="text-red-600 text-xs mt-1">{errors.email}</p>}
             </div>

             <div>
               <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                 Password
               </label>
               <input
                 type="password"
                 id="password"
                 name="password"
                 value={formData.password}
                 onChange={handleChange}
                 className={`w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                   errors.password ? 'border-red-300 bg-red-50' : 'border-gray-300'
                 }`}
                 placeholder="Enter your password"
               />
               {errors.password && <p className="text-red-600 text-xs mt-1">{errors.password}</p>}
             </div>

             <div className="flex items-center justify-between">
               <label className="flex items-center">
                 <input
                   type="checkbox"
                   className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                 />
                 <span className="ml-2 text-sm text-gray-600">Remember me</span>
               </label>
               <button
                 type="button"
                 onClick={() => setShowResetModal(true)}
                 className="text-sm text-blue-600 hover:underline"
               >
                 Forgot password? 😅
               </button>
             </div>

             <button
               type="submit"
               disabled={isLoading}
               className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 px-4 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
             >
               {isLoading ? (
                 <div className="flex items-center justify-center">
                   <i className="fas fa-spinner fa-spin mr-2"></i>
                   Signing in...
                 </div>
               ) : (
                 'Sign In'
               )}
             </button>
           </form>

           {/* Reset Password Modal */}
           {showResetModal && (
             <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
               <div className="bg-white rounded-lg p-6 max-w-sm w-full">
                 <div className="flex justify-between items-center mb-4">
                   <h3 className="text-lg font-bold">Reset Password 🚀</h3>
                   <button
                     onClick={() => setShowResetModal(false)}
                     className="text-gray-600 hover:text-gray-900"
                   >
                     <i className="fas fa-times"></i>
                   </button>
                 </div>
                 <form onSubmit={handleResetSubmit} className="space-y-4">
                   {resetMessage && (
                     <p className="text-green-600 text-sm">{resetMessage}</p>
                   )}
                   {resetError && (
                     <p className="text-red-600 text-sm">{resetError}</p>
                   )}
                   <div>
                     <label htmlFor="reset-email" className="block text-sm font-medium text-gray-700">
                       Email
                     </label>
                     <input
                       id="reset-email"
                       type="email"
                       value={resetEmail}
                       onChange={(e) => setResetEmail(e.target.value)}
                       className="w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 border-gray-300"
                       placeholder="Enter your email"
                     />
                   </div>
                   <button
                     type="submit"
                     className="w-full bg-blue-600 text-white text-sm font-semibold py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                   >
                     Send Reset Link 🪄
                   </button>
                 </form>
               </div>
             </div>
           )}

           <div className="mt-6 text-center">
             <p className="text-sm text-gray-600">
               Don't have an account?{' '}
               <Link to="/signup" className="text-blue-600 hover:underline font-semibold">
                 Sign up here
               </Link>
             </p>
           </div>

           <div className="mt-6">
             <div className="relative">
               <div className="absolute inset-0 flex items-center">
                 <div className="w-full border-t border-gray-300"></div>
               </div>
               <div className="relative flex justify-center text-sm">
                 <span className="px-2 bg-white text-gray-500">Or continue with</span>
               </div>
             </div>

             <div className="mt-4 grid grid-cols-2 gap-3">
               <button
                 type="button"
                 className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
               >
                 <i className="fab fa-google text-red-500"></i>
                 <span className="ml-2">Google</span>
               </button>
               <button
                 type="button"
                 className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
               >
                 <i className="fab fa-github text-gray-900"></i>
                 <span className="ml-2">GitHub</span>
               </button>
             </div>
           </div>
         </div>
       </div>
     );
   };

   export default Login;