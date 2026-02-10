import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSync, FaExclamationTriangle, FaCheck, FaTimes, FaSpinner, FaStar, FaEdit, FaPaperPlane, FaNewspaper } from 'react-icons/fa';
import api from '../utils/api';
import adminBg from '../assets/admin_bg_person.png'; // New generated background

import { addRefToUrl, getVideoId } from '../utils/linkUtils';

const AdminDashboard = () => {

  /* Admin 2.0 State */
  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'content', 'users', 'blog', 'newsletter'
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [userSearch, setUserSearch] = useState('');
  const [userPage, setUserPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  /* Manage All Content State */
  const [contentMode, setContentMode] = useState('pending'); // 'pending' or 'all'
  const [allTools, setAllTools] = useState([]);
  const [toolSearch, setToolSearch] = useState('');
  const [toolStatusFilter, setToolStatusFilter] = useState('All');
  const [toolPage, setToolPage] = useState(1);
  const [totalToolPages, setTotalToolPages] = useState(1);

  /* Blog & Newsletter State */
  const [articles, setArticles] = useState([]);
  const [subscriberCount, setSubscriberCount] = useState(0);
  const [articleForm, setArticleForm] = useState({ title: '', content: '', summary: '', tags: '' });

  /* Reports State */
  const [reports, setReports] = useState([]);



  // Existing Stata
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); 
  const [pendingTools, setPendingTools] = useState([]);
  const [pendingCategories, setPendingCategories] = useState([]);
  const [editingTool, setEditingTool] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [editSnapshot, setEditSnapshot] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [viewingImage, setViewingImage] = useState(null);
  const [editingCategory, setEditingCategory] = useState(null); 
  const [editPreviewUrl, setEditPreviewUrl] = useState(null);

  const token = localStorage.getItem('token');

  // --- Admin 2.0 Fetchers ---
  const fetchStats = useCallback(async () => {
    try {
        const res = await api.get('/api/admin/stats');
        setStats(res.data);
    } catch(err) {
        console.error("Failed to fetch stats", err);
    }
  }, []);

  // Always fetch stats on mount for sidebar/tab badges
  useEffect(() => {
      fetchStats();
  }, [fetchStats]);

  const fetchUsers = useCallback(async () => {
    try {
        const res = await api.get(`/api/admin/users?page=${userPage}&search=${userSearch}`);
        setUsers(res.data.users);
        setTotalPages(res.data.totalPages);
    } catch(err) {
        console.error("Failed to fetch users", err);
    }
  }, [userPage, userSearch]);

  const fetchAllTools = useCallback(async () => {
      try {
          const res = await api.get(`/api/admin/tools?page=${toolPage}&search=${toolSearch}&status=${toolStatusFilter}`);
          setAllTools(res.data.tools);
          setTotalToolPages(res.data.totalPages);
      } catch(err) {
          console.error("Failed to fetch all tools", err);
      }
  }, [toolPage, toolSearch, toolStatusFilter]);

  const fetchArticles = useCallback(async () => {
      try {
          const res = await api.get('/api/articles?limit=50');
          setArticles(res.data.articles);
      } catch(err) {
          console.error("Failed to fetch articles", err);
      }
  }, []);

  const fetchSubscriberCount = useCallback(async () => {
      try {
          const res = await api.get('/api/newsletter/count');
          setSubscriberCount(res.data.count);
      } catch(err) {
          console.error("Failed to fetch subscriber count", err);
      }
  }, []);

  const fetchReports = useCallback(async () => {
    try {
        const res = await api.get('/api/reports');
        setReports(res.data);
    } catch(err) {
        console.error("Failed to fetch reports", err);
    }
  }, []);

  const handleUpdateReportStatus = async (reportId, status) => {
    try {
        await api.patch(`/api/reports/${reportId}/status`, { status });
        setReports(reports.map(r => r._id === reportId ? { ...r, status } : r));
        setMessage(`Report marked as ${status}`);
        setMessageType('success');
    } catch(err) {
        console.error(err);
        setMessage('Failed to update report status');
        setMessageType('error');
    }
  };

  const handleDeleteReport = async (reportId) => {
    if(!window.confirm("Delete this report?")) return;
    try {
        await api.delete(`/api/reports/${reportId}`);
        setReports(reports.filter(r => r._id !== reportId));
        setMessage('Report deleted');
        setMessageType('success');
    } catch(err) {
        console.error(err);
        setMessage('Failed to delete report');
        setMessageType('error');
    }
  };

  // --- Actions ---
  const handleBanUser = async (userId) => {
    if(!window.confirm("Ban/Unban this user?")) return;
    try {
        await api.put(`/api/admin/users/${userId}/ban`);
        fetchUsers(); // Refresh
        setMessage('User status updated');
        setMessageType('success');
    } catch(err) {
        alert("Failed to update ban status");
    }
  };

  const handleRoleToggle = async (userId) => {
      if(!window.confirm("Change user admin privileges?")) return;
      try {
          await api.put(`/api/admin/users/${userId}/role`);
          fetchUsers();
          setMessage('User role updated');
          setMessageType('success');
      } catch(err) {
          alert(err.response?.data?.error || "Failed to update role");
      }
  };

  const handleTriggerDigest = async (type) => {
      if(!window.confirm(`Trigger ${type} digest email to all subscribers?`)) return;
      try {
          setIsLoading(true);
          const res = await api.post('/api/admin/trigger-digest', { type });
          setMessage(res.data.message || 'Digest triggered');
          setMessageType('success');
      } catch(err) {
          console.error(err);
          setMessage(err.response?.data?.error || "Failed to trigger digest");
          setMessageType('error');
      } finally {
          setIsLoading(false);
      }
  };

  const handleCreateArticle = async (e) => {
    e.preventDefault();
    if (!articleForm.title || !articleForm.content) return;
    
    try {
        setIsLoading(true);
        await api.post('/api/articles', {
            ...articleForm,
            tags: articleForm.tags.split(',').map(t => t.trim())
        });
        setMessage('Article published successfully');
        setMessageType('success');
        setArticleForm({ title: '', content: '', summary: '', tags: '' });
        fetchArticles();
    } catch(err) {
        console.error(err);
        setMessage('Failed to publish article');
        setMessageType('error');
    } finally {
        setIsLoading(false);
    }
  };

  // --- Existing Fetchers ---
  const fetchPending = useCallback(async () => {
    try {
      setIsLoading(true);
      setMessage('');

      if (!token) {
        setMessage('Not authenticated');
        setMessageType('error');
        return;
      }

      const res = await api.get('/api/tools/pending');
      const json = res.data;

      setPendingTools(json.tools || []);
      // setMessage(json.tools.length > 0 ? `Loaded ${json.tools.length} pending tool(s)` : 'No pending tools');
      // setMessageType('success'); // Cleaner to not show toast on load
    } catch (err) {
      console.error(err);
      setMessage('Network error');
      setMessageType('error');
    } finally {
      setIsLoading(false);
    }
  }, [token]);


  const fetchPendingCategories = useCallback(async () => {
    try {
      const res = await api.get('/api/categories/pending');
      setPendingCategories(res.data);
    } catch (err) {
      console.error('Failed to fetch pending categories', err);
    }
  }, []);

  const fetchCategories = useCallback(async () => {
    try {
      const res = await api.get('/api/categories');
      setCategories(res.data);
    } catch (err) {
      console.error('Failed to fetch categories', err);
    }
  }, []);

  useEffect(() => {
      // Load data based on active tab
      if (activeTab === 'overview') fetchStats();
      if (activeTab === 'users') fetchUsers();
      if (activeTab === 'blog') fetchArticles();
      if (activeTab === 'newsletter') fetchSubscriberCount();
      if (activeTab === 'reports') fetchReports();
      if (activeTab === 'content') {
          if (contentMode === 'pending') {
            fetchPending();
            fetchPendingCategories();
          } else {
            fetchAllTools();
          }
           fetchCategories(); // Always fetch cats for edit dropdowns/management
      }
  }, [activeTab, contentMode, fetchStats, fetchUsers, fetchPending, fetchPendingCategories, fetchCategories, fetchAllTools, fetchArticles, fetchSubscriberCount, fetchReports]);

  // Auto-dismiss success messages after 1.5 seconds
  useEffect(() => {
    if (message && messageType === 'success') {
      const timer = setTimeout(() => {
        setMessage('');
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [message, messageType]);


  const handleApproveCategory = async (id) => {
    try {
      await api.post(`/api/categories/${id}/approve`);
      setPendingCategories(pendingCategories.filter(c => c._id !== id));
      setMessage('Category approved');
      setMessageType('success');
    } catch (err) {
      console.error(err);
      setMessage('Failed to approve category');
      setMessageType('error');
    }
  };

  const handleRejectCategory = async (id) => {
    try {
      await api.post(`/api/categories/${id}/reject`);
      setPendingCategories(pendingCategories.filter(c => c._id !== id));
      setMessage('Category rejected');
      setMessageType('success');
    } catch (err) {
      console.error(err);
      setMessage('Failed to reject category');
      setMessageType('error');
    }
  };

  const handleUpdateCategory = async (e) => {
    e.preventDefault();
    if (!editingCategory) return;

    try {
        setIsLoading(true);
        const res = await api.put(`/api/categories/${editingCategory._id}`, { name: editingCategory.name });
        
        // Update local state
        setPendingCategories(pendingCategories.map(c => c._id === editingCategory._id ? res.data.category : c));
        setMessage('Category updated');
        setMessageType('success');
        setEditingCategory(null);
    } catch (err) {
        console.error(err);
        setMessage(err.response?.data?.error || 'Failed to update category');
        setMessageType('error');
    } finally {
        setIsLoading(false);
    }
  };

  const handleEditClick = (tool) => {
    setEditingTool(tool);
    setEditForm({
      name: tool.name,
      shortDescription: tool.shortDescription,
      description: tool.description,
      url: tool.url,
      videoUrl: tool.videoUrl,
      category: tool.category,
      pricing: tool.pricing,
      hashtags: Array.isArray(tool.hashtags) ? tool.hashtags.join(', ') : tool.hashtags,
      isAiToolsChoice: tool.isAiToolsChoice
    });

    setEditSnapshot(null);
    setEditPreviewUrl(null);
  };

  // Preview Effect for Edit Snapshot
  useEffect(() => {
    if (!editSnapshot) {
      setEditPreviewUrl(null);
      return;
    }
    const objectUrl = URL.createObjectURL(editSnapshot);
    setEditPreviewUrl(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [editSnapshot]);

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleEditFile = (e) => {
    setEditSnapshot(e.target.files[0]);
  };

  const handleUpdateTool = async (e) => {
    e.preventDefault();
    if (!editingTool) return;

    try {
      setIsLoading(true);
      let snapshotUrl = editingTool.snapshotUrl;

      if (editSnapshot) {
        const formData = new FormData();
        formData.append('snapshot', editSnapshot);
        const uploadRes = await api.post('/api/tools/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        snapshotUrl = uploadRes.data.url;
      }

      const updatedData = { ...editForm, snapshotUrl };
      await api.put(`/api/tools/${editingTool._id}/edit`, updatedData);

      setPendingTools(
        pendingTools.map((t) =>
          t._id === editingTool._id ? { ...t, ...updatedData } : t
        )
      );
      setEditingTool(null);
      setMessage('Tool updated successfully');
      setMessageType('success');
    } catch (err) {
      console.error(err);
      setMessage('Failed to update tool');
      setMessageType('error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleApproveTool = async (tool) => {
    if (!window.confirm(`Are you sure you want to approve ${tool.name}?`)) return;
    try {
      setIsLoading(true);
      await api.post(`/api/tools/${tool._id}/approve`);
      setPendingTools(pendingTools.filter((t) => t._id !== tool._id));
      setMessage(`Approved ${tool.name}`);
      setMessageType('success');
    } catch (err) {
      console.error(err);
      setMessage('Failed to approve tool');
      setMessageType('error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleChoice = async (tool) => {
    try {
      setIsLoading(true);
      const res = await api.put(`/api/tools/${tool._id}/toggle-choice`);
      const updatedTool = res.data.tool;

      setPendingTools(
        pendingTools.map((t) =>
          t._id === tool._id ? { ...t, isAiToolsChoice: updatedTool.isAiToolsChoice } : t
        )
      );
      setMessage(`Choice status updated for ${tool.name}`);
      setMessageType('success');
    } catch (err) {
      console.error(err);
      setMessage('Failed to toggle choice status');
      setMessageType('error');
    } finally {
      setIsLoading(false);
    }
  };

  // --- Dark Minimal Theme Styles ---
  // Background: Rich Black (#050505)
  // Accent: Orange (#FF4D00)
  // Framing: Corner Squares + Lines
  // Decoration: Side Image (Person)

  return (
    <div className="min-h-screen bg-[#050505] text-white relative overflow-hidden font-sans selection:bg-[#FF4D00] selection:text-white">
        
        {/* Background Elements */}
        <div className="fixed inset-0 z-0 pointer-events-none">
            {/* Gradient Overlay for atmosphere */}
            <div className="absolute inset-0 bg-radial-gradient(circle at 50% 50%, #1a1a1a 0%, #050505 100%) opacity-50"></div>
            
            {/* The Person Image - Positioned "Beside" / Bottom Right like the rock in reference */}
            <motion.div 
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="hidden md:block absolute bottom-0 right-0 w-[500px] h-[600px] z-0 mix-blend-screen opacity-90"
            >
                 <motion.img 
                    src={adminBg} 
                    alt="Atmospheric Figure" 
                    className="w-full h-full object-contain object-bottom grayscale brightness-125 contrast-125"
                    animate={{ 
                        filter: ["brightness(1.2) contrast(1.2)", "brightness(1.4) contrast(1.1)", "brightness(1.2) contrast(1.2)"]
                    }}
                    transition={{ 
                        duration: 8, 
                        repeat: Infinity, 
                        repeatType: "mirror",
                        ease: "easeInOut" 
                    }}
                />
                {/* Fade the image into the background at the bottom/left */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-[#050505]/20"></div>
            </motion.div>
        </div>

      {/* Main Content Container with "Framing" effect */}
      <div className="relative z-10 max-w-7xl mx-auto p-8 lg:p-12 min-h-screen flex flex-col">
        
        {/* Top Navigation / Header Area */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-16 relative">
             {/* Text "Simplicity Never Looked This Rich" vibe */}
             <div className="absolute -top-6 left-0 text-[10px] text-gray-500 tracking-[0.3em] uppercase hidden md:block">
                Simplicity Never Looked This Rich
             </div>

            <div className="z-10">
                <h1 className="text-7xl md:text-8xl font-black text-white tracking-tighter leading-[0.8]">
                ADMIN
                <span className="text-[#FF4D00]">.</span>
                </h1>
                <p className="text-gray-500 font-bold tracking-widest uppercase text-xs mt-2 ml-1">Management Dashboard</p>
            </div>

            <div className="flex flex-wrap md:flex-nowrap gap-4 mt-8 md:mt-0 z-10 w-full md:w-auto">
                <div className="flex gap-2 w-full md:w-auto md:mr-4 md:border-r border-white/10 md:pr-4">
                    <button
                        onClick={() => handleTriggerDigest('daily')}
                        disabled={isLoading}
                        className="px-4 py-2 bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white text-[10px] font-bold uppercase tracking-widest border border-white/10 transition-all flex items-center gap-2"
                    >
                       <FaPaperPlane size={10} /> Daily Digest
                    </button>
                    <button
                        onClick={() => handleTriggerDigest('weekly')}
                        disabled={isLoading}
                        className="px-4 py-2 bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white text-[10px] font-bold uppercase tracking-widest border border-white/10 transition-all flex items-center gap-2"
                    >
                       <FaPaperPlane size={10} /> Weekly
                    </button>
                </div>

                <button
                onClick={() => {
                   if (activeTab === 'overview') fetchStats();
                   if (activeTab === 'users') fetchUsers();
                   if (activeTab === 'blog') fetchArticles();
                   if (activeTab === 'newsletter') fetchSubscriberCount();
                   if (activeTab === 'reports') fetchReports();
                   if (activeTab === 'content') {
                       if (contentMode === 'pending') {
                           fetchPending();
                           fetchPendingCategories();
                       } else {
                           fetchAllTools();
                       }
                       fetchCategories();
                   }
                   setMessage('Dashboard data refreshed');
                   setMessageType('success');
                }}
                className="px-8 py-4 bg-[#FF4D00] hover:bg-white hover:text-black text-white font-bold uppercase tracking-widest text-xs transition-all duration-300 flex items-center gap-3 relative overflow-hidden group"
                >
                <span className="relative z-10 flex items-center gap-2">
                    <FaSync className={`group-hover:rotate-180 transition-transform duration-500 ${isLoading ? 'animate-spin' : ''}`} />
                    Refresh Data
                </span>
                </button>
            </div>
        </div>

        {/* Message Alert */}
        <AnimatePresence>
        {message && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className={`mb-12 p-4 border-l-2 font-bold uppercase tracking-wider text-xs flex items-center gap-4 bg-[#0A0A0A] max-w-md ${messageType === 'error'
              ? 'border-red-500 text-red-500'
              : 'border-[#FF4D00] text-[#FF4D00]'
              }`}
          >
            {messageType === 'error' ? <FaExclamationTriangle /> : <FaCheck />}
            <span className="text-gray-300">{message}</span>
          </motion.div>
        )}
        </AnimatePresence>

        {/* Tab Navigation (Admin 2.0) */}
        <div className="flex gap-8 mb-8 border-b border-white/10 pb-4 overflow-x-auto hide-scrollbar flex-nowrap min-w-0">
            {['overview', 'content', 'users', 'blog', 'newsletter', 'reports'].map(tab => (
                <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`text-sm font-bold uppercase tracking-widest transition-colors relative pb-4 -mb-4 flex items-center gap-1 ${
                        activeTab === tab ? 'text-[#FF4D00]' : 'text-gray-500 hover:text-white'
                    }`}
                >
                    {tab}
                    {/* Notification Badges */}
                    {tab === 'content' && stats?.pending && (stats.pending.tools + stats.pending.categories > 0) && (
                        <span className="ml-1 bg-[#FF4D00] text-white text-[9px] font-bold px-1.5 h-4 min-w-[16px] rounded-full flex items-center justify-center animate-pulse">
                            {stats.pending.tools + stats.pending.categories}
                        </span>
                    )}
                    {tab === 'reports' && stats?.pending?.reports > 0 && (
                        <span className="ml-1 bg-[#FF4D00] text-white text-[9px] font-bold px-1.5 h-4 min-w-[16px] rounded-full flex items-center justify-center animate-pulse">
                            {stats.pending.reports}
                        </span>
                    )}
                    
                    {activeTab === tab && (
                        <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 w-full h-[2px] bg-[#FF4D00]" />
                    )}
                </button>
            ))}
        </div>

        {/* Content Tab */}
        {activeTab === 'content' && (
        <div className="relative border-l border-t border-white/10 p-8 md:p-12 flex-1">
             {/* Toggle Content Mode */}
             <div className="flex gap-4 mb-8">
                <button 
                    onClick={() => setContentMode('pending')}
                    className={`px-4 py-2 text-xs font-bold uppercase tracking-widest border transition-colors ${contentMode === 'pending' ? 'bg-[#FF4D00] text-white border-[#FF4D00]' : 'text-gray-500 border-white/10 hover:text-white'}`}
                >
                    Pending Approvals
                </button>
                <button 
                    onClick={() => setContentMode('all')}
                    className={`px-4 py-2 text-xs font-bold uppercase tracking-widest border transition-colors ${contentMode === 'all' ? 'bg-[#FF4D00] text-white border-[#FF4D00]' : 'text-gray-500 border-white/10 hover:text-white'}`}
                >
                    Manage All Content
                </button>
             </div>

             {contentMode === 'all' && (
                /* Manage All Content View */
                <div className="relative z-10">
                    <div className="flex flex-col md:flex-row justify-between mb-8 gap-4">
                        <div className="flex gap-4">
                            <input 
                                placeholder="Search tools..." 
                                value={toolSearch}
                                onChange={(e) => setToolSearch(e.target.value)}
                                className="bg-black border border-white/20 px-4 py-2 text-white outline-none focus:border-[#FF4D00]"
                            />
                            <select 
                                value={toolStatusFilter}
                                onChange={(e) => setToolStatusFilter(e.target.value)}
                                className="bg-black border border-white/20 px-4 py-2 text-white outline-none focus:border-[#FF4D00] appearance-none"
                            >
                                <option value="All">All Status</option>
                                <option value="approved">Approved</option>
                                <option value="pending">Pending</option>
                                <option value="rejected">Rejected</option>
                            </select>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[800px] text-left border-collapse mb-8">
                            <thead>
                                <tr className="border-b border-white/10 text-gray-500 text-xs uppercase tracking-widest">
                                    <th className="p-4">Tool</th>
                                    <th className="p-4">Category</th>
                                    <th className="p-4">Status</th>
                                    <th className="p-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {allTools.map(tool => (
                                    <tr key={tool._id} className="hover:bg-white/5 transition-colors">
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                {tool.snapshotUrl ? (
                                                    <img src={tool.snapshotUrl} className="w-10 h-6 object-cover bg-gray-800" alt="" />
                                                ) : <div className="w-10 h-6 bg-gray-800" />}
                                                <span className="font-bold text-white">{tool.name}</span>
                                            </div>
                                        </td>
                                        <td className="p-4 text-gray-400 text-sm">{tool.category}</td>
                                        <td className="p-4">
                                            <span className={`px-2 py-1 text-[10px] uppercase font-bold tracking-widest border ${
                                                tool.status === 'approved' ? 'border-green-500 text-green-500' :
                                                tool.status === 'pending' ? 'border-yellow-500 text-yellow-500' :
                                                'border-red-500 text-red-500'
                                            }`}>
                                                {tool.status}
                                            </span>
                                        </td>
                                        <td className="p-4 text-right space-x-2">
                                            <button 
                                                onClick={() => handleEditClick(tool)}
                                                className="text-white hover:text-[#FF4D00] transition-colors"
                                            >
                                                <FaEdit />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination for All Tools */}
                    <div className="flex justify-between items-center pt-4 border-t border-white/5">
                        <button 
                            disabled={toolPage === 1}
                            onClick={() => setToolPage(p => Math.max(1, p - 1))}
                            className="text-xs font-bold uppercase tracking-widest text-gray-500 hover:text-white disabled:opacity-30"
                        >
                            Previous
                        </button>
                        <span className="text-xs text-gray-500">Page {toolPage} of {totalToolPages}</span>
                        <button 
                            disabled={toolPage === totalToolPages}
                            onClick={() => setToolPage(p => Math.min(totalToolPages, p + 1))}
                            className="text-xs font-bold uppercase tracking-widest text-gray-500 hover:text-white disabled:opacity-30"
                        >
                            Next
                        </button>
                    </div>

                    {/* Categories Management (All) */}
                    <div className="mt-12 pt-12 border-t border-white/10">
                        <h3 className="text-xl font-bold text-white mb-6">Manage Categories</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {categories.map(cat => (
                                <div key={cat._id} className="bg-[#0A0A0A] border border-white/5 p-4 flex justify-between items-center group hover:border-white/20 transition-colors">
                                    <span className="text-white font-bold">{cat.name}</span>
                                    <button 
                                        onClick={() => setEditingCategory(cat)}
                                        className="text-gray-500 hover:text-white"
                                    >
                                        <FaEdit />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
             )}

             {contentMode === 'pending' && (
                <>
                {/* Decoration: Corner Squares (The Reference Look) */}
                {/* Top Left - handled by border connection, adding square */}
                <div className="absolute -top-1.5 -left-1.5 w-3 h-3 bg-[#FF4D00]"></div>
                
                {/* Top Right */}
                <div className="absolute top-0 right-0 w-full h-[1px] bg-white/10"></div>
                <div className="absolute -top-1.5 right-0 w-3 h-3 bg-[#FF4D00]"></div>

                {/* Bottom Left */}
                <div className="absolute bottom-0 left-0 w-[1px] h-full bg-white/10"></div>
                <div className="absolute bottom-0 -left-1.5 w-3 h-3 bg-[#FF4D00]"></div>

                {/* Bottom Right (Open or closed? Reference usually creates a box. Let's make it a box) */}
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-[#FF4D00]"></div>
                <div className="absolute bottom-0 left-0 w-full h-[1px] bg-white/10"></div>
                <div className="absolute top-0 right-0 w-[1px] h-full bg-white/10"></div>

                <div className="mb-20 relative z-10">
                <div className="flex items-end gap-4 mb-8">
                <h2 className="text-4xl font-bold text-white tracking-tighter leading-none">
                CATEGORIES
                </h2>
                <span className="text-sm font-bold text-[#FF4D00] mb-1">
                ({pendingCategories.length})
                </span>
            </div>

            {pendingCategories.length === 0 ? (
                <div className="bg-[#080808] p-12 border border-white/5 text-center max-w-lg">
                <p className="text-gray-600 uppercase tracking-widest text-xs font-bold">No Pending Items</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <AnimatePresence>
                    {pendingCategories.map((cat) => (
                    <motion.div
                        key={cat._id}
                        layout
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="bg-[#0A0A0A] border border-white/5 p-6 group hover:bg-[#0f0f0f] transition-colors relative"
                    >
                        <div className="absolute top-0 right-0 w-0 h-0 border-t-[6px] border-r-[6px] border-transparent group-hover:border-[#FF4D00] transition-all duration-300"></div>

                        <div className="flex justify-between items-start mb-8">
                        <div>
                            <h3 className="text-xl font-bold text-white mb-1">
                            {cat.name}
                            </h3>
                            <p className="text-[10px] text-gray-500 font-mono uppercase tracking-widest">slug: {cat.slug}</p>
                        </div>
                        </div>

                        <div className="flex gap-4">
                        <button
                            onClick={() => handleApproveCategory(cat._id)}
                            className="text-[10px] font-bold uppercase tracking-widest text-white hover:text-[#FF4D00] transition-colors"
                        >
                            Approve
                        </button>
                        <span className="text-gray-700">|</span>
                        <button
                            onClick={() => setEditingCategory(cat)}
                            className="text-[10px] font-bold uppercase tracking-widest text-gray-500 hover:text-white transition-colors"
                        >
                            Edit
                        </button>
                        <span className="text-gray-700">|</span>
                        <button
                            onClick={() => handleRejectCategory(cat._id)}
                            className="text-[10px] font-bold uppercase tracking-widest text-gray-500 hover:text-red-500 transition-colors"
                        >
                            Reject
                        </button>
                        </div>
                    </motion.div>
                    ))}
                </AnimatePresence>
                </div>
            )}
            </div>

            {/* Pending Tools Section */}
            <div className="relative z-10">
            <div className="flex items-end gap-4 mb-8">
                <h2 className="text-4xl font-bold text-white tracking-tighter leading-none">
                TOOLS
                </h2>
                 <span className="text-sm font-bold text-[#FF4D00] mb-1">
                ({pendingTools.length})
                </span>
            </div>

            {isLoading && pendingTools.length === 0 ? (
                <div className="py-20 flex">
                 <FaSpinner className="animate-spin text-[#FF4D00] text-2xl" />
                </div>
            ) : pendingTools.length === 0 ? (
                 <div className="bg-[#080808] p-12 border border-white/5 text-center max-w-lg">
                <p className="text-gray-600 uppercase tracking-widest text-xs font-bold">No Pending Tools</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4 max-w-4xl">
                <AnimatePresence>
                    {pendingTools.map((tool) => (
                    <motion.div
                        key={tool._id}
                        layout
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="bg-[#0A0A0A] border border-white/5 p-8 relative group hover:border-white/10 transition-colors"
                    >
                         <div className="absolute top-0 left-0 w-[2px] h-0 bg-[#FF4D00] group-hover:h-full transition-all duration-500"></div>

                        <div className="flex flex-col md:flex-row gap-8 items-stretch">
                        {/* Snapshot */}
                        <div 
                            className="w-full md:w-80 h-auto min-h-[200px] bg-black relative grayscale hover:grayscale-0 transition-all duration-500 cursor-zoom-in overflow-hidden border border-white/10 rounded-lg flex-shrink-0"
                            onClick={() => tool.snapshotUrl && setViewingImage(tool.snapshotUrl)}
                        >
                            {tool.snapshotUrl ? (
                            <img
                                src={tool.snapshotUrl}
                                alt={tool.name}
                                className="w-full h-full object-cover"
                            />
                            ) : (
                            <div className="w-full h-full flex items-center justify-center border border-white/10">
                                <div className="w-2 h-2 bg-white/20"></div>
                            </div>
                            )}
                        </div>

                        {/* Content */}
                        <div className="flex-1 flex flex-col justify-between">
                            <div>
                            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
                                <div>
                                    <h3 className="text-2xl font-bold text-white tracking-tight uppercase">
                                    {tool.name}
                                    </h3>
                                    <a
                                    href={addRefToUrl(tool.url)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-[#FF4D00] text-xs font-mono mt-1 block hover:underline truncate max-w-md"
                                    >
                                    {tool.url}
                                    </a>
                                </div>
                                 <button
                                    onClick={() => handleToggleChoice(tool)}
                                    className={`text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 ${tool.isAiToolsChoice
                                    ? 'text-yellow-500'
                                    : 'text-gray-600 hover:text-white'
                                    }`}
                                >
                                    <FaStar className={tool.isAiToolsChoice ? 'fill-current' : ''} /> 
                                    {tool.isAiToolsChoice ? 'Editor\'s Choice' : 'Mark as Choice'}
                                </button>
                            </div>

                            {tool.videoUrl && (
                                <div className="mb-6 rounded-lg overflow-hidden border border-white/10 bg-black max-w-sm">
                                    {getVideoId(tool.videoUrl) ? (
                                        <div className="relative pt-[56.25%]">
                                            <iframe
                                                className="absolute top-0 left-0 w-full h-full"
                                                src={`https://www.youtube.com/embed/${getVideoId(tool.videoUrl)}`}
                                                title="YouTube video player"
                                                frameBorder="0"
                                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                allowFullScreen
                                            ></iframe>
                                        </div>
                                    ) : (
                                        <a
                                            href={tool.videoUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="p-4 block text-center text-sm text-gray-400 hover:text-white"
                                        >
                                            View External Video <FaNewspaper className="inline ml-2"/>
                                        </a>
                                    )}
                                </div>
                            )}
                            {tool.videoUrl && getVideoId(tool.videoUrl) && (
                                    <a 
                                        href={tool.videoUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-gray-600 hover:text-[#FF4D00] text-[10px] font-mono mb-6 block truncate max-w-sm transition-colors"
                                    >
                                        <span className="mr-1">🔗</span> {tool.videoUrl}
                                    </a>
                                )}

                            <p className="text-gray-400 mb-6 text-sm leading-relaxed max-w-2xl border-l border-white/10 pl-4 py-1">
                                {tool.shortDescription || tool.description}
                            </p>
                            </div>

                            <div className="flex flex-wrap gap-8 items-center border-t border-white/5 pt-6 mt-2">
                            <button
                                onClick={() => handleApproveTool(tool)}
                                className="text-xs font-bold uppercase tracking-widest text-white hover:text-[#FF4D00] transition-colors flex items-center gap-2"
                            >
                                <span className="w-2 h-2 bg-[#FF4D00] rounded-sm"></span> Approve
                            </button>

                            <button
                                onClick={() => handleEditClick(tool)}
                                className="text-xs font-bold uppercase tracking-widest text-gray-500 hover:text-white transition-colors flex items-center gap-2"
                            >
                                Edit
                            </button>

                            <button
                                onClick={async () => {
                                if (
                                    !window.confirm(
                                    `Are you sure you want to reject ${tool.name}?`
                                    )
                                )
                                    return;
                                try {
                                    setIsLoading(true);
                                    await api.post(
                                    `/api/tools/${tool._id}/reject`
                                    );
                                    setPendingTools(
                                    pendingTools.filter((t) => t._id !== tool._id)
                                    );
                                    setMessage(`Rejected ${tool.name}`);
                                    setMessageType('success');
                                } catch (err) {
                                    console.error(err);
                                    setMessage('Failed to reject');
                                    setMessageType('error');
                                } finally {
                                    setIsLoading(false);
                                }
                                }}
                                className="text-xs font-bold uppercase tracking-widest text-gray-600 hover:text-red-500 transition-all flex items-center gap-2 ml-auto"
                            >
                                Reject
                            </button>
                            </div>
                        </div>
                        </div>
                    </motion.div>
                    ))}
                </AnimatePresence>
                </div>
            )}
            </div>
             </>
         )}
        </div>
        )} {/* End Content Tab */}

        {/* Overview Tab */}
        {activeTab === 'overview' && stats && (
            <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                        { label: 'Total Users', value: stats.overview.users, color: 'border-blue-500', text: 'text-blue-500' },
                        { label: 'Total Tools', value: stats.overview.tools, color: 'border-green-500', text: 'text-green-500' },
                        { label: 'Total Stacks', value: stats.overview.stacks, color: 'border-purple-500', text: 'text-purple-500' },
                        { label: 'Categories', value: stats.overview.categories, color: 'border-orange-500', text: 'text-orange-500' },
                    ].map((item, idx) => (
                        <motion.div 
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className={`bg-[#0A0A0A] border-t-4 ${item.color} p-6 border-x border-b border-white/5 relative group`}
                        >
                            <h3 className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-2">{item.label}</h3>
                            <p className={`text-4xl font-black ${item.text}`}>{item.value}</p>
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                <FaStar size={40} />
                            </div>
                        </motion.div>
                    ))}
                </div>

                <div className="bg-[#0A0A0A] border border-white/10 p-8 relative overflow-hidden">
                    <div className="flex items-center gap-4 mb-6">
                         <div className="p-3 bg-white/5 rounded-full">
                             <FaSync className="text-[#FF4D00]" />
                         </div>
                         <div>
                             <h3 className="text-xl font-bold text-white">Platform Growth</h3>
                             <p className="text-gray-500 text-sm">New users across the platform</p>
                         </div>
                    </div>
                    <div className="flex items-end gap-2 h-40">
                         <div className="flex-1 bg-white/5 h-full rounded-lg flex flex-col items-center justify-center border border-white/5">
                             <span className="text-4xl font-bold text-white mb-2">{stats.growth.newUsersLast7Days}</span>
                             <span className="text-xs text-gray-500 uppercase tracking-widest">Last 7 Days</span>
                         </div>
                    </div>
                </div>
            </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
            <div className="bg-[#0A0A0A] border border-white/10 p-8 min-h-[500px]">
                <div className="flex flex-col md:flex-row justify-between mb-8 gap-4">
                    <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                        <span className="w-2 h-8 bg-[#FF4D00]"></span> USER MANAGEMENT
                    </h2>
                    <input 
                        placeholder="Search users..." 
                        value={userSearch}
                        onChange={(e) => setUserSearch(e.target.value)}
                        className="bg-black border border-white/20 px-4 py-2 text-white outline-none focus:border-[#FF4D00] w-full md:w-64"
                    />
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-white/10 text-gray-500 text-xs uppercase tracking-widest">
                                <th className="p-4">User</th>
                                <th className="p-4">Role</th>
                                <th className="p-4">Status</th>
                                <th className="p-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {users.map(user => (
                                <tr key={user._id} className="hover:bg-white/5 transition-colors">
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center font-bold text-xs">
                                                {user.username[0].toUpperCase()}
                                            </div>
                                            <div>
                                                <div className="font-bold text-white">{user.username}</div>
                                                <div className="text-xs text-gray-500">{user.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 text-[10px] uppercase font-bold tracking-widest border ${user.role === 'admin' ? 'border-purple-500 text-purple-400' : 'border-gray-700 text-gray-500'}`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        {user.isBanned ? (
                                            <span className="text-red-500 text-xs font-bold uppercase flex items-center gap-2"><div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" /> Banned</span>
                                        ) : (
                                            <span className="text-green-500 text-xs font-bold uppercase flex items-center gap-2"><div className="w-2 h-2 bg-green-500 rounded-full" /> Active</span>
                                        )}
                                    </td>
                                    <td className="p-4 text-right space-x-2">
                                        <button 
                                            onClick={() => handleRoleToggle(user._id)}
                                            className="text-xs text-gray-400 hover:text-white underline decoration-dotted"
                                        >
                                            {user.role === 'admin' ? 'Demote' : 'Make Admin'}
                                        </button>
                                        <button 
                                            onClick={() => handleBanUser(user._id)}
                                            className={`text-xs font-bold px-3 py-1 border ${user.isBanned ? 'border-green-600 text-green-500 hover:bg-green-600 hover:text-white' : 'border-red-600 text-red-500 hover:bg-red-600 hover:text-white'} transition-colors`}
                                        >
                                            {user.isBanned ? 'UNBAN' : 'BAN'}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="flex justify-between items-center mt-8 pt-8 border-t border-white/5">
                    <button 
                        disabled={userPage === 1}
                        onClick={() => setUserPage(p => Math.max(1, p - 1))}
                        className="text-xs font-bold uppercase tracking-widest text-gray-500 hover:text-white disabled:opacity-30"
                    >
                        Previous
                    </button>
                    <span className="text-xs text-gray-500">Page {userPage} of {totalPages}</span>
                    <button 
                        disabled={userPage === totalPages}
                        onClick={() => setUserPage(p => Math.min(totalPages, p + 1))}
                        className="text-xs font-bold uppercase tracking-widest text-gray-500 hover:text-white disabled:opacity-30"
                    >
                        Next
                    </button>
                </div>
            </div>
        )}

        {/* Blog Tab */}
        {activeTab === 'blog' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Create Article Form */}
                <div className="lg:col-span-1 border-r border-white/10 pr-12">
                    <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                        <FaEdit className="text-[#FF4D00]" /> New Article
                    </h3>
                    <form onSubmit={handleCreateArticle} className="space-y-4">
                        <div>
                            <label className="text-xs font-bold uppercase tracking-widest text-gray-500 block mb-2">Title</label>
                            <input 
                                className="w-full bg-black border border-white/20 p-3 text-white focus:border-[#FF4D00] outline-none"
                                value={articleForm.title}
                                onChange={e => setArticleForm({...articleForm, title: e.target.value})}
                                required
                            />
                        </div>
                        <div>
                            <label className="text-xs font-bold uppercase tracking-widest text-gray-500 block mb-2">Slug (optional)</label>
                            <input 
                                className="w-full bg-black border border-white/20 p-3 text-white focus:border-[#FF4D00] outline-none"
                                value={articleForm.slug || ''}
                                onChange={e => setArticleForm({...articleForm, slug: e.target.value})}
                            />
                        </div>
                         <div>
                            <label className="text-xs font-bold uppercase tracking-widest text-gray-500 block mb-2">Summary</label>
                            <textarea 
                                className="w-full bg-black border border-white/20 p-3 text-white focus:border-[#FF4D00] outline-none h-24"
                                value={articleForm.summary}
                                onChange={e => setArticleForm({...articleForm, summary: e.target.value})}
                            />
                        </div>
                        <div>
                            <label className="text-xs font-bold uppercase tracking-widest text-gray-500 block mb-2">Content (Markdown)</label>
                            <textarea 
                                className="w-full bg-black border border-white/20 p-3 text-white focus:border-[#FF4D00] outline-none h-64 font-mono text-sm"
                                value={articleForm.content}
                                onChange={e => setArticleForm({...articleForm, content: e.target.value})}
                                required
                            />
                        </div>
                        <div>
                            <label className="text-xs font-bold uppercase tracking-widest text-gray-500 block mb-2">Image URL</label>
                            <input 
                                className="w-full bg-black border border-white/20 p-3 text-white focus:border-[#FF4D00] outline-none"
                                value={articleForm.image || ''}
                                onChange={e => setArticleForm({...articleForm, image: e.target.value})}
                            />
                        </div>
                        <div>
                            <label className="text-xs font-bold uppercase tracking-widest text-gray-500 block mb-2">Tags (comma separated)</label>
                            <input 
                                className="w-full bg-black border border-white/20 p-3 text-white focus:border-[#FF4D00] outline-none"
                                value={articleForm.tags}
                                onChange={e => setArticleForm({...articleForm, tags: e.target.value})}
                            />
                        </div>
                        <button 
                            type="submit" 
                            disabled={isLoading}
                            className="w-full py-3 bg-[#FF4D00] hover:bg-white hover:text-black text-white font-bold uppercase tracking-widest text-xs transition-all mt-4"
                        >
                            {isLoading ? 'Publishing...' : 'Publish Article'}
                        </button>
                    </form>
                </div>

                {/* Article List */}
                <div className="lg:col-span-2">
                    <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                        <FaNewspaper className="text-[#FF4D00]" /> Published Articles
                    </h3>
                    <div className="space-y-4">
                        {articles.length === 0 ? (
                            <p className="text-gray-500">No articles found.</p>
                        ) : (
                            articles.map(article => (
                                <div key={article._id} className="bg-[#0A0A0A] border border-white/5 p-6 flex gap-6 hover:border-white/20 transition-colors">
                                    {article.image && (
                                        <img src={article.image} alt="" className="w-24 h-24 object-cover bg-gray-800" />
                                    )}
                                    <div>
                                        <h4 className="text-lg font-bold text-white mb-1">{article.title}</h4>
                                        <p className="text-[10px] text-[#FF4D00] font-mono mb-2">/{article.slug}</p>
                                        <p className="text-gray-400 text-sm line-clamp-2">{article.summary}</p>
                                        <div className="flex gap-2 mt-3">
                                            {article.tags.map(tag => (
                                                <span key={tag} className="text-[10px] bg-white/5 px-2 py-1 rounded text-gray-300">{tag}</span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        )}

        {/* Newsletter Tab */}
        {activeTab === 'newsletter' && (
            <div className="max-w-2xl mx-auto text-center py-12">
                <div className="mb-12">
                    <h2 className="text-6xl font-black text-white mb-4">{subscriberCount}</h2>
                    <p className="text-gray-500 font-bold uppercase tracking-widest">Active Subscribers</p>
                </div>
                
                <div className="bg-[#0A0A0A] border border-white/5 p-8 text-left">
                    <h3 className="text-xl font-bold text-white mb-6 border-b border-white/10 pb-4">Send Custom Update</h3>
                    <p className="text-gray-400 text-sm mb-6">
                        Send a manual email update to all {subscriberCount} subscribers. 
                        Use this carefully as it goes to everyone.
                    </p>
                    
                    <form onSubmit={async (e) => {
                        e.preventDefault();
                        const subject = e.target.subject.value;
                        const content = e.target.content.value;
                        if(!subject || !content) return;
                        
                        if(!window.confirm(`Send this email to ${subscriberCount} people?`)) return;

                        try {
                            setIsLoading(true);
                            await api.post('/api/newsletter/send-update', { subject, content });
                            setMessage('Newsletter sent successfully');
                            setMessageType('success');
                            e.target.reset();
                        } catch(err) {
                            console.error(err);
                            setMessage('Failed to send newsletter');
                            setMessageType('error');
                        } finally {
                            setIsLoading(false);
                        }
                    }} className="space-y-4">
                        <div>
                            <label className="text-xs font-bold uppercase tracking-widest text-gray-500 block mb-2">Subject Line</label>
                            <input 
                                name="subject"
                                className="w-full bg-black border border-white/20 p-3 text-white focus:border-[#FF4D00] outline-none"
                                required
                            />
                        </div>
                        <div>
                            <label className="text-xs font-bold uppercase tracking-widest text-gray-500 block mb-2">Email Content (HTML allowed)</label>
                            <textarea 
                                name="content"
                                className="w-full bg-black border border-white/20 p-3 text-white focus:border-[#FF4D00] outline-none h-48"
                                required
                            />
                        </div>
                         <button 
                            type="submit"
                            disabled={isLoading || subscriberCount === 0}
                            className="w-full py-4 bg-[#FF4D00] hover:bg-white hover:text-black text-white font-bold uppercase tracking-widest text-xs transition-all mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? 'Sending...' : 'Send Blast'}
                        </button>
                    </form>
                </div>
            </div>
        )}

        {/* Reports Tab */}
        {activeTab === 'reports' && (
            <div className="bg-[#0A0A0A] border border-white/10 p-8">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                    <span className="w-1.5 h-8 bg-[#FF4D00]"></span> Reports ({reports.length})
                </h2>
                
                {reports.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                        <FaCheck className="mx-auto text-4xl mb-4 text-green-500/20" />
                        <p className="font-bold uppercase tracking-widest text-xs">No pending reports</p>
                    </div>
                ) : (
                    <div className="grid gap-4">
                        {reports.map(report => (
                            <div key={report._id} className="bg-black/40 border border-white/5 p-6 flex flex-col md:flex-row gap-6">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className={`px-2 py-0.5 text-[10px] uppercase font-bold tracking-widest border rounded ${
                                            report.status === 'pending' ? 'border-red-500 text-red-500' : 
                                            report.status === 'resolved' ? 'border-green-500 text-green-500' : 'border-gray-500 text-gray-500'
                                        }`}>
                                            {report.status}
                                        </span>
                                        <span className="text-gray-500 text-xs">{new Date(report.reportedAt).toLocaleDateString()}</span>
                                    </div>
                                    <h3 className="text-lg font-bold text-white mb-1">
                                        {report.toolName} 
                                        <span className="text-gray-500 font-normal text-sm ml-2">({report.reason})</span>
                                    </h3>
                                    {report.description && (
                                        <p className="text-gray-400 text-sm mt-2 border-l-2 border-white/10 pl-3">
                                            "{report.description}"
                                        </p>
                                    )}
                                </div>
                                <div className="flex items-center gap-3">
                                    {report.status === 'pending' && (
                                        <button 
                                            onClick={() => handleUpdateReportStatus(report._id, 'resolved')}
                                            className="px-4 py-2 bg-white/5 hover:bg-green-500/20 text-green-500 border border-current text-xs font-bold uppercase tracking-widest"
                                        >
                                            Resolve
                                        </button>
                                    )}
                                    <button 
                                        onClick={() => handleDeleteReport(report._id)}
                                        className="p-2 text-gray-500 hover:text-red-500 transition-colors"
                                        title="Delete Report"
                                    >
                                        <FaTimes />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        )}

      </div >

      {/* Edit Modal - Minimalist */}
      < AnimatePresence >
        {editingTool && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#050505] border border-white/10 w-full max-w-2xl shadow-2xl relative"
            >
              <div className="p-8 border-b border-white/10 flex justify-between items-center bg-[#050505]">
                <h3 className="text-2xl font-bold text-white tracking-tight flex items-center gap-3">
                   <span className="w-1.5 h-6 bg-[#FF4D00]"></span> EDIT TOOL
                </h3>
                <button
                  onClick={() => setEditingTool(null)}
                  className="text-gray-500 hover:text-white transition-colors"
                >
                  <FaTimes size={20} />
                </button>
              </div>

              <form onSubmit={handleUpdateTool} className="p-8 space-y-6 max-h-[80vh] overflow-y-auto custom-scrollbar bg-[#050505]">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Name</label>
                        <input
                            name="name"
                            value={editForm.name || ''}
                            onChange={handleEditChange}
                            className="w-full bg-[#111] border border-white/10 focus:border-[#FF4D00] rounded-none px-4 py-3 text-white outline-none transition-colors placeholder-gray-700"
                            placeholder="Tool Name"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Short Description</label>
                        <input
                            name="shortDescription"
                            value={editForm.shortDescription || ''}
                            onChange={handleEditChange}
                            className="w-full bg-[#111] border border-white/10 focus:border-[#FF4D00] rounded-none px-4 py-3 text-white outline-none transition-colors placeholder-gray-700"
                            placeholder="Brief summary"
                        />
                    </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Description</label>
                  <textarea
                    name="description"
                    value={editForm.description || ''}
                    onChange={handleEditChange}
                    rows={6}
                    className="w-full bg-[#111] border border-white/10 focus:border-[#FF4D00] rounded-none px-4 py-3 text-white outline-none transition-colors placeholder-gray-700 resize-none"
                    placeholder="Full description..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">URL</label>
                    <input
                      name="url"
                      value={editForm.url || ''}
                      onChange={handleEditChange}
                      className="w-full bg-[#111] border border-white/10 focus:border-[#FF4D00] rounded-none px-4 py-3 text-white outline-none transition-colors placeholder-gray-700"
                      placeholder="https://..."
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Video URL</label>
                    <input
                      name="videoUrl"
                      value={editForm.videoUrl || ''}
                      onChange={handleEditChange}
                      className="w-full bg-[#111] border border-white/10 focus:border-[#FF4D00] rounded-none px-4 py-3 text-white outline-none transition-colors placeholder-gray-700"
                      placeholder="https://youtube.com/..."
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Category</label>
                    <div className="relative">
                        <select
                        name="category"
                        value={editForm.category || ''}
                        onChange={handleEditChange}
                        className="w-full bg-[#111] border border-white/10 focus:border-[#FF4D00] rounded-none px-4 py-3 text-white outline-none transition-colors appearance-none cursor-pointer"
                        >
                        <option value="">Select Category</option>
                        {categories.map((cat) => (
                            <option key={cat._id} value={cat.slug} className="bg-[#111]">
                            {cat.name}
                            </option>
                        ))}
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">▼</div>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Hashtags</label>
                  <input
                    name="hashtags"
                    value={editForm.hashtags || ''}
                    onChange={handleEditChange}
                    placeholder="e.g. ai, video, generator"
                    className="w-full bg-[#111] border border-white/10 focus:border-[#FF4D00] rounded-none px-4 py-3 text-white outline-none transition-colors placeholder-gray-700"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Pricing</label>
                        <div className="relative">
                            <select
                                name="pricing"
                                value={editForm.pricing || 'Freemium'}
                                onChange={handleEditChange}
                                className="w-full bg-[#111] border border-white/10 focus:border-[#FF4D00] rounded-none px-4 py-3 text-white outline-none transition-colors appearance-none cursor-pointer"
                            >
                                <option value="Free" className="bg-[#111]">Free</option>
                                <option value="Freemium" className="bg-[#111]">Freemium</option>
                                <option value="Paid" className="bg-[#111]">Paid</option>
                                <option value="Open Source" className="bg-[#111]">Open Source</option>
                                <option value="Free Trial" className="bg-[#111]">Free Trial</option>
                                <option value="Contact" className="bg-[#111]">Contact</option>
                            </select>
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">▼</div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Update Snapshot</label>
                        
                        {/* Image Preview */}
                        <div 
                            className="w-full aspect-video bg-black/50 border border-white/10 mb-2 flex items-center justify-center overflow-hidden relative cursor-zoom-in hover:border-[#FF4D00]/50 transition-colors"
                            onClick={() => {
                                if (editPreviewUrl) {
                                    setViewingImage(editPreviewUrl);
                                } else if (editingTool.snapshotUrl) {
                                    setViewingImage(editingTool.snapshotUrl);
                                }
                            }}
                        >
                            {editSnapshot && editPreviewUrl ? (
                                <div className="relative w-full h-full group">
                                     <img 
                                        src={editPreviewUrl} 
                                        alt="New Snapshot" 
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <p className="text-xs text-[#FF4D00] font-bold uppercase tracking-widest">New Image Selected</p>
                                    </div>
                                </div>
                            ) : editingTool.snapshotUrl ? (
                                <img 
                                    src={editingTool.snapshotUrl} 
                                    alt="Current Snapshot" 
                                    className="w-full h-full object-cover opacity-80"
                                />
                            ) : (
                                <p className="text-xs text-gray-600 font-bold uppercase tracking-widest">No Image</p>
                            )}
                        </div>

                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleEditFile}
                            className="w-full text-xs text-gray-400 file:mr-4 file:py-3 file:px-6 file:rounded-none file:border-0 file:text-xs file:font-bold file:uppercase file:tracking-widest file:bg-white/5 file:text-gray-300 hover:file:bg-[#FF4D00] hover:file:text-white cursor-pointer border border-white/10 bg-[#111]"
                        />
                    </div>
                </div>

                <div className="flex gap-4 pt-8 mt-4 border-t border-white/5">
                  <button
                    type="button"
                    onClick={() => setEditingTool(null)}
                    className="flex-1 px-6 py-4 bg-transparent hover:bg-white/5 text-gray-400 border border-white/10 hover:border-white/20 text-xs font-bold uppercase tracking-widest transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 px-6 py-4 bg-[#FF4D00] hover:bg-white hover:text-black text-white text-xs font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2"
                  >
                    {isLoading ? <FaSpinner className="animate-spin" /> : <FaCheck />}
                    Save Changes
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence >

      {/* Full Screen Image Viewer */}
      <AnimatePresence>
        {viewingImage && (
            <div 
                className="fixed inset-0 z-[150] bg-black/95 flex items-center justify-center p-4 cursor-zoom-out"
                onClick={() => setViewingImage(null)}
            >
                <motion.img
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    src={viewingImage}
                    alt="Full View"
                    className="max-w-full max-h-full object-contain"
                />
                <button 
                    className="absolute top-8 right-8 text-white/50 hover:text-white"
                    onClick={() => setViewingImage(null)}
                >
                    <FaTimes size={32} />
                </button>
            </div>
        )}
      </AnimatePresence>



      {/* Edit Category Modal */}
      <AnimatePresence>
        {editingCategory && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-[#050505] border border-white/10 w-full max-w-md shadow-2xl relative p-8"
                >
                    <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                        <FaEdit className="text-[#FF4D00]" /> Edit Category
                    </h3>
                    
                    <form onSubmit={handleUpdateCategory} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Category Name</label>
                            <input
                                value={editingCategory.name}
                                onChange={(e) => setEditingCategory({...editingCategory, name: e.target.value})}
                                className="w-full bg-[#111] border border-white/10 focus:border-[#FF4D00] px-4 py-3 text-white outline-none"
                                autoFocus
                            />
                        </div>

                        <div className="flex gap-4">
                            <button
                                type="button"
                                onClick={() => setEditingCategory(null)}
                                className="flex-1 py-3 border border-white/10 hover:bg-white/5 text-gray-400 text-xs font-bold uppercase"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isLoading || !editingCategory.name.trim()}
                                className="flex-1 py-3 bg-[#FF4D00] hover:bg-white hover:text-black text-white text-xs font-bold uppercase transition-colors"
                            >
                                {isLoading ? 'Saving...' : 'Save Update'}
                            </button>
                        </div>
                    </form>
                </motion.div>
            </div>
        )}
      </AnimatePresence>

    </div >
  );
};
export default AdminDashboard;
