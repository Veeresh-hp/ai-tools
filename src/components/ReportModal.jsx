import React, { useState } from 'react';
import { motion as m, AnimatePresence } from 'framer-motion';
import { FaTimes, FaFlag, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';

/**
 * ReportModal Component
 * 
 * @param {boolean} isOpen - Whether the modal is visible
 * @param {function} onClose - Function to close the modal
 * @param {object} tool - The tool object being reported { _id, name }
 */
const ReportModal = ({ isOpen, onClose, tool }) => {
  const [reason, setReason] = useState('Broken Link');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState('idle'); // idle, success, error

  // Backend URL handling
  const getApiUrl = () => {
      const envUrl = process.env.REACT_APP_API_URL && process.env.REACT_APP_API_URL.trim();
      if (envUrl) return envUrl;
      try {
        const host = typeof window !== 'undefined' ? window.location.hostname : '';
        const isVercel = /vercel\.app$/.test(host);
        if (isVercel) return 'https://ai-tools-hub-backend-u2v6.onrender.com';
      } catch { }
      return 'http://localhost:5000';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus('idle');

    try {
      const API_URL = getApiUrl();
      const res = await fetch(`${API_URL}/api/reports/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Include auth token if available, but optional
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
        },
        body: JSON.stringify({
          toolId: tool._id,
          toolName: tool.name,
          reason,
          description
        })
      });

      if (res.ok) {
        setStatus('success');
        setTimeout(() => {
          onClose();
          setStatus('idle');
          setReason('Broken Link');
          setDescription('');
        }, 2000);
      } else {
        setStatus('error');
      }
    } catch (err) {
      console.error('Report submission failed:', err);
      setStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
        {/* Backdrop */}
        <m.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        />

        {/* Modal */}
        <m.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-md bg-[#12121A] border border-white/10 rounded-2xl p-6 shadow-2xl overflow-hidden"
        >
          {/* Decorative Glow */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

          {/* Header */}
          <div className="flex justify-between items-start mb-6 relative z-10">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <FaFlag className="text-red-500" /> Report Issue
              </h2>
              <p className="text-gray-400 text-sm mt-1">
                Help us improve <strong>{tool?.name}</strong>
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-white transition-colors p-1"
            >
              <FaTimes />
            </button>
          </div>

          {status === 'success' ? (
            <div className="text-center py-8">
              <FaCheckCircle className="text-green-500 text-5xl mx-auto mb-4" />
              <h3 className="text-white font-bold text-lg mb-2">Report Submitted</h3>
              <p className="text-gray-400 text-sm">Thank you for your feedback! We'll review it shortly.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
              {/* Reason Select */}
              <div className="space-y-2">
                <label className="text-sm font-mark font-medium text-gray-300">Issue Type</label>
                <div className="relative">
                  <select
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white appearance-none focus:outline-none focus:border-red-500/50 transition-colors"
                  >
                    <option value="Broken Link" className="bg-[#12121A] text-white">Broken Link</option>
                    <option value="Outdated Information" className="bg-[#12121A] text-white">Outdated Information</option>
                    <option value="Duplicate" className="bg-[#12121A] text-white">Duplicate Tool</option>
                    <option value="Inappropriate Content" className="bg-[#12121A] text-white">Inappropriate Content</option>
                    <option value="Other" className="bg-[#12121A] text-white">Other</option>
                  </select>
                  {/* Custom Arrow */}
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none text-xs">▼</div>
                </div>
              </div>

              {/* Description Textarea */}
              <div className="space-y-2">
                <label className="text-sm font-mark font-medium text-gray-300">Details (Optional)</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Please provide more details..."
                  rows={4}
                  className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-red-500/50 transition-colors resize-none"
                />
              </div>

              {/* Error Message */}
              {status === 'error' && (
                <div className="flex items-center gap-2 text-red-400 text-sm bg-red-500/10 p-3 rounded-lg border border-red-500/10">
                  <FaExclamationTriangle />
                  <span>Failed to submit report. Please try again.</span>
                </div>
              )}

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-lg text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2 rounded-lg text-sm font-bold bg-white text-black hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isSubmitting ? 'Sending...' : 'Submit Report'}
                </button>
              </div>
            </form>
          )}
        </m.div>
      </div>
    </AnimatePresence>
  );
};

export default ReportModal;
