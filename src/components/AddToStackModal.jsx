import React, { useState, useEffect, useCallback } from 'react';
import { motion as m, AnimatePresence } from 'framer-motion';
import { X, Plus, Check, Layers } from 'lucide-react';
import api from '../utils/api';

const AddToStackModal = ({ isOpen, onClose, tool }) => {
    const [stacks, setStacks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [createMode, setCreateMode] = useState(false);
    const [newStackName, setNewStackName] = useState('');
    const [isPublic, setIsPublic] = useState(true);
    const [selectedStacks, setSelectedStacks] = useState(new Set());

    const fetchStacks = useCallback(async () => {
        try {
            setLoading(true);
            const res = await api.get('/api/stacks/my-stacks');
            setStacks(res.data);
            
            // Determine which stacks contain this tool
            const toolId = tool.id || tool.name; // Match logic from backend/StcakDetail
            const initialSelection = new Set();
            
            res.data.forEach(stack => {
                if (stack.tools.includes(toolId)) {
                    initialSelection.add(stack._id);
                }
            });
            setSelectedStacks(initialSelection);
        } catch (err) {
            console.error("Failed to load stacks", err);
        } finally {
            setLoading(false);
        }
    }, [tool.id, tool.name]);

    // Fetch stacks and check if tool is already in them
    useEffect(() => {
        if (isOpen) {
            fetchStacks();
        }
    }, [isOpen, fetchStacks]);

    const handleToggle = async (stackId) => {
        // Optimistic update
        const isSelected = selectedStacks.has(stackId);
        const newSet = new Set(selectedStacks);
        if (isSelected) newSet.delete(stackId);
        else newSet.add(stackId);
        setSelectedStacks(newSet);

        // API Call
        try {
            const stack = stacks.find(s => s._id === stackId);
            let newTools = [...stack.tools];
            const toolId = tool.id || tool.name;

            if (isSelected) {
                // Remove
                newTools = newTools.filter(t => t !== toolId);
            } else {
                // Add
                if (!newTools.includes(toolId)) newTools.push(toolId);
            }

            await api.put(`/api/stacks/${stackId}`, { tools: newTools });
            
            // Update local stack state to reflect tool change for correctness
            setStacks(prev => prev.map(s => s._id === stackId ? { ...s, tools: newTools } : s));

        } catch (err) {
            console.error("Failed to update stack", err);
            // Revert on failure
            setSelectedStacks(selectedStacks);
        }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        if (!newStackName.trim()) return;

        try {
            const res = await api.post('/api/stacks', {
                name: newStackName,
                isPublic: isPublic,
                tools: [tool.id || tool.name] // Immediately add current tool
            });
            
            const newStack = res.data;
            setStacks([newStack, ...stacks]);
            setSelectedStacks(prev => new Set(prev).add(newStack._id));
            setCreateMode(false);
            setNewStackName('');
        } catch (err) {
            alert('Failed to create stack');
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <m.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            >
                <m.div 
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.95, opacity: 0 }}
                    onClick={e => e.stopPropagation()}
                    className="w-full max-w-md bg-[#12121A] border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
                >
                    {/* Header */}
                    <div className="flex items-center justify-between p-4 border-b border-white/5 bg-[#181822]">
                        <h3 className="text-lg font-bold text-white flex items-center gap-2">
                            <Layers className="text-[#FF6B00]" size={18} /> 
                            Save to Stack
                        </h3>
                        <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                            <X size={20} />
                        </button>
                    </div>

                    {/* Tool Preview */}
                    <div className="p-4 bg-white/5 border-b border-white/5 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-black/40 overflow-hidden border border-white/10">
                             <img src={tool.image} alt={tool.name} className="w-full h-full object-cover" />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-white">{tool.name}</p>
                            <p className="text-xs text-gray-400 truncate max-w-[200px]">{tool.shortDescription || 'Select stacks below'}</p>
                        </div>
                    </div>

                    {/* List */}
                    <div className="max-h-[300px] overflow-y-auto p-2 scrollbar-thin scrollbar-thumb-white/10">
                        {loading ? (
                            <div className="flex justify-center py-8">
                                <div className="w-6 h-6 border-2 border-white/20 border-t-blue-500 rounded-full animate-spin" />
                            </div>
                        ) : stacks.length === 0 && !createMode ? (
                            <div className="text-center py-8">
                                <p className="text-gray-500 text-sm mb-3">No stacks found.</p>
                                <button onClick={() => setCreateMode(true)} className="text-blue-400 text-sm font-bold hover:underline">Create your first stack</button>
                            </div>
                        ) : (
                            <div className="space-y-1">
                                {stacks.map(stack => {
                                    const isSelected = selectedStacks.has(stack._id);
                                    return (
                                        <div 
                                            key={stack._id}
                                            onClick={() => handleToggle(stack._id)}
                                            className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all ${isSelected ? 'bg-blue-600/20 border border-blue-500/30' : 'hover:bg-white/5 border border-transparent'}`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className={`w-5 h-5 rounded flex items-center justify-center border transition-colors ${isSelected ? 'bg-blue-500 border-blue-500' : 'border-gray-600'}`}>
                                                    {isSelected && <Check size={12} className="text-white" />}
                                                </div>
                                                <span className={`text-sm font-medium ${isSelected ? 'text-white' : 'text-gray-300'}`}>{stack.name}</span>
                                            </div>
                                            {stack.isPublic && <span className="text-[10px] bg-white/10 px-1.5 py-0.5 rounded text-gray-400">Public</span>}
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {/* Footer / Create */}
                    <div className="p-4 border-t border-white/5 bg-[#181822]">
                        {createMode ? (
                            <form onSubmit={handleCreate} className="space-y-4">
                                <div className="flex gap-2">
                                <input 
                                    autoFocus
                                    type="text" 
                                    value={newStackName} 
                                    onChange={e => setNewStackName(e.target.value)}
                                    placeholder="New Stack Name..." 
                                    className="flex-1 bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-blue-500 outline-none"
                                />
                                 </div>
                                 <div className="flex justify-between items-center">
                                    <label className="flex items-center gap-2 text-gray-400 text-xs cursor-pointer">
                                        <input 
                                            type="checkbox" 
                                            checked={isPublic} 
                                            onChange={e => setIsPublic(e.target.checked)} 
                                            className="accent-blue-500" 
                                        />
                                        Make Public
                                    </label>

                                    <div className="flex gap-2">
                                        <button type="button" onClick={() => setCreateMode(false)} className="px-3 py-2 text-gray-400 hover:text-white">
                                            Cancel
                                        </button>
                                        <button type="submit" disabled={!newStackName.trim()} className="px-3 py-2 bg-blue-600 rounded-lg text-white text-sm font-bold disabled:opacity-50">Create</button>
                                    </div>
                                 </div>
                            </form>
                        ) : (
                            <button 
                                onClick={() => setCreateMode(true)}
                                className="w-full py-2.5 flex items-center justify-center gap-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition-all text-sm font-bold border border-white/5 hover:border-white/10"
                            >
                                <Plus size={16} /> Create New Stack
                            </button>
                        )}
                    </div>
                </m.div>
            </m.div>
        </AnimatePresence>
    );
};

export default AddToStackModal;
