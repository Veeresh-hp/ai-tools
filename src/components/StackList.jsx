import React, { useState, useEffect } from 'react';
import { motion as m, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Globe, Lock, ArrowRight, Layers } from 'lucide-react';
import { FaQuestionCircle } from 'react-icons/fa';
import api from '../utils/api';
import { Link } from 'react-router-dom';
import StackGuide from './StackGuide';

const StackList = () => {
    const [activeTab, setActiveTab] = useState('my-stacks');
    const [stacks, setStacks] = useState([]);
    const [exploreStacks, setExploreStacks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [createMode, setCreateMode] = useState(false);
    const [newStackName, setNewStackName] = useState('');
    const [isPublic, setIsPublic] = useState(true);
    const [createLoading, setCreateLoading] = useState(false);
    const [showGuide, setShowGuide] = useState(false);

    useEffect(() => {
        if (activeTab === 'my-stacks') {
            fetchStacks();
        } else {
            fetchExploreStacks();
        }
    }, [activeTab]);

    const fetchStacks = async () => {
        setLoading(true);
        try {
            const res = await api.get('/api/stacks/my-stacks');
            setStacks(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const fetchExploreStacks = async () => {
        setLoading(true);
        try {
            const res = await api.get('/api/stacks/explore');
            setExploreStacks(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        if (!newStackName.trim()) return;

        setCreateLoading(true);
        try {
            const res = await api.post('/api/stacks', {
                name: newStackName,
                isPublic
            });
            setStacks([res.data, ...stacks]);
            setCreateMode(false);
            setNewStackName('');
            setActiveTab('my-stacks'); // Switch to my stacks to see new creation
        } catch (err) {
            alert(err.response?.data?.error || 'Failed to create stack');
        } finally {
            setCreateLoading(false);
        }
    };

    const handleDelete = async (id, e) => {
        e.preventDefault(); // Prevent link click
        e.stopPropagation();
        if (!window.confirm('Are you sure you want to delete this stack?')) return;

        try {
            await api.delete(`/api/stacks/${id}`);
            setStacks(stacks.filter(s => s._id !== id));
        } catch (err) {
            console.error(err);
        }
    };

    const displayedStacks = activeTab === 'my-stacks' ? stacks : exploreStacks;

    return (
        <div className="min-h-screen pt-8 pb-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-6">
                    <div>
                        <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
                            <Layers className="text-[#FF6B00]" /> Stacks
                        </h1>
                        <p className="text-gray-400">Curate, share, and discover collections of AI tools.</p>
                    </div>
                    <div className="flex gap-3">
                         <button 
                            onClick={() => setShowGuide(!showGuide)}
                            className={`px-4 py-3 rounded-xl font-bold transition-all border flex items-center gap-2 ${showGuide ? 'bg-white/10 text-white border-white/20' : 'bg-white/5 text-gray-200 border-white/20 hover:bg-white/10 hover:border-white/30 hover:text-white'}`}
                        >
                            <FaQuestionCircle size={20} /> <span className="hidden sm:inline">{showGuide ? 'Hide Guide' : 'How it Works'}</span>
                        </button>
                        <button 
                            onClick={() => setCreateMode(true)}
                            className="px-6 py-3 bg-white text-black font-bold rounded-xl hover:bg-gray-200 transition-colors flex items-center gap-2 shadow-[0_0_20px_rgba(255,255,255,0.2)]"
                        >
                            <Plus size={20} /> Create New Stack
                        </button>
                    </div>
                </div>

                {/* Collapsible Guide */}
                <AnimatePresence>
                    {showGuide && (
                        <m.div 
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                        >
                            <StackGuide />
                        </m.div>
                    )}
                </AnimatePresence>

                {/* Tabs */}
                <div className="flex gap-4 mb-8 border-b border-white/10 pb-4">
                    <button 
                        onClick={() => setActiveTab('my-stacks')}
                        className={`pb-2 text-lg font-bold transition-colors relative ${activeTab === 'my-stacks' ? 'text-white' : 'text-gray-500 hover:text-gray-300'}`}
                    >
                        My Stacks
                        {activeTab === 'my-stacks' && <m.div layoutId="activeTab" className="absolute bottom-[-17px] left-0 right-0 h-1 bg-[#FF6B00] rounded-t-full" />}
                    </button>
                    <button 
                        onClick={() => setActiveTab('community')}
                        className={`pb-2 text-lg font-bold transition-colors relative ${activeTab === 'community' ? 'text-white' : 'text-gray-500 hover:text-gray-300'}`}
                    >
                        Community Explore
                        {activeTab === 'community' && <m.div layoutId="activeTab" className="absolute bottom-[-17px] left-0 right-0 h-1 bg-[#FF6B00] rounded-t-full" />}
                    </button>
                </div>

                {/* Create Modal / Inline Form */}
                <AnimatePresence>
                    {createMode && (
                        <m.div 
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mb-12 overflow-hidden"
                        >
                            <form onSubmit={handleCreate} className="bg-[#1A1A1A] border border-white/10 rounded-2xl p-6 max-w-2xl mx-auto shadow-2xl">
                                <h3 className="text-xl font-bold text-white mb-4">Name your new stack</h3>
                                <div className="space-y-4">
                                    <input 
                                        type="text" 
                                        value={newStackName}
                                        onChange={(e) => setNewStackName(e.target.value)}
                                        placeholder="e.g., 'My Coding Workflow' or 'Video Marketing Kit'"
                                        className="w-full bg-black/50 border border-white/10 rounded-xl p-4 text-white focus:border-blue-500 focus:outline-none transition-colors"
                                        autoFocus
                                    />
                                    <div className="flex items-center gap-6">
                                        <label className="flex items-center gap-2 text-gray-300 cursor-pointer">
                                            <input 
                                                type="radio" 
                                                checked={isPublic} 
                                                onChange={() => setIsPublic(true)}
                                                className="accent-blue-500"
                                            />
                                            <Globe size={16} /> Public
                                        </label>
                                        <label className="flex items-center gap-2 text-gray-300 cursor-pointer">
                                            <input 
                                                type="radio" 
                                                checked={!isPublic} 
                                                onChange={() => setIsPublic(false)}
                                                className="accent-blue-500"
                                            />
                                            <Lock size={16} /> Private
                                        </label>
                                    </div>
                                    <div className="flex gap-3 pt-2">
                                        <button 
                                            type="button" 
                                            onClick={() => setCreateMode(false)}
                                            className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
                                        >
                                            Cancel
                                        </button>
                                        <button 
                                            type="submit" 
                                            disabled={createLoading || !newStackName.trim()}
                                            className="px-6 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-500 transition-colors disabled:opacity-50 flex-1"
                                        >
                                            {createLoading ? 'Creating...' : 'Create Stack'}
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </m.div>
                    )}
                </AnimatePresence>

                {/* List Stacks */}
                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="w-8 h-8 border-2 border-white/20 border-t-blue-500 rounded-full animate-spin" />
                    </div>
                ) : displayedStacks.length === 0 ? (
                    <div className="text-center py-20 bg-white/5 rounded-3xl border border-white/5">
                        <Layers size={48} className="mx-auto text-gray-600 mb-4" />
                        <h3 className="text-xl font-bold text-white mb-2">No stacks found</h3>
                        <p className="text-gray-400 mb-6">{activeTab === 'my-stacks' ? "Create your first collection to start organizing tools." : "Be the first to share a public stack!"}</p>
                        {activeTab === 'my-stacks' && (
                            <button 
                                onClick={() => setCreateMode(true)}
                                className="px-6 py-2 bg-blue-600/20 text-blue-400 font-bold rounded-xl border border-blue-500/30 hover:bg-blue-600 hover:text-white transition-all"
                            >
                                Create Stack
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {displayedStacks.map(stack => (
                            <Link 
                                to={`/stack/${stack.slug}`} 
                                key={stack._id}
                                className="group block bg-[#0A0A0A] border border-white/10 rounded-2xl p-6 hover:border-[#FF6B00]/50 transition-all hover:-translate-y-1 hover:shadow-2xl relative overflow-hidden"
                            >
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                                
                                <div className="flex justify-between items-start mb-4">
                                    <div className={`px-2 py-1 rounded text-xs font-bold uppercase tracking-wider ${stack.isPublic ? 'bg-green-500/10 text-green-400' : 'bg-gray-700/30 text-gray-400'}`}>
                                        {stack.isPublic ? 'Public' : 'Private'}
                                    </div>
                                    {activeTab === 'my-stacks' ? (
                                        <button 
                                            onClick={(e) => handleDelete(stack._id, e)}
                                            className="text-gray-600 hover:text-red-500 transition-colors p-2 -mr-2 -mt-2 opacity-0 group-hover:opacity-100"
                                            title="Delete Stack"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    ) : (
                                        <div className="flex items-center gap-2 text-xs text-gray-500">
                                            <div className="w-5 h-5 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-[10px] text-white font-bold">
                                                {stack.user?.username?.[0] || 'U'}
                                            </div>
                                            <span className="truncate max-w-[80px]">{stack.user?.username || 'User'}</span>
                                        </div>
                                    )}
                                </div>

                                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors truncate">{stack.name}</h3>
                                <p className="text-gray-400 text-sm line-clamp-2 mb-6 h-10">
                                    {stack.description || 'No description provided.'}
                                </p>

                                <div className="flex items-center justify-between text-xs text-gray-500 border-t border-white/5 pt-4">
                                    <span>{stack.tools.length} Tools</span>
                                    <span className="flex items-center gap-1 group-hover:text-white transition-colors">
                                        View Stack <ArrowRight size={12} />
                                    </span>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default StackList;
