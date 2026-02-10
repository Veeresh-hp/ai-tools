import React, { useEffect, useState } from 'react';
import { useCompare } from '../contexts/CompareContext';
import { useHistory } from 'react-router-dom';
import DashboardBackground from './DashboardBackground';
import { FaTimes, FaExternalLinkAlt } from 'react-icons/fa';
import { addRefToUrl } from '../utils/linkUtils';
import compareBg from '../assets/compare_bg.png';
import toolsData from '../data/toolsData';
import { FaStar } from 'react-icons/fa';
import api from '../utils/api';

const ComparePage = () => {
    const { selectedTools, removeFromCompare } = useCompare();
    const history = useHistory();
    const [dynamicTools, setDynamicTools] = useState([]);

    useEffect(() => {
        const fetchDynamicTools = async () => {
            try {
                // Fetch all approved tools from backend to ensure we have fresh data for DB-only tools
                const response = await api.get('/api/tools/approved');
                if (response.data && response.data.tools) {
                    setDynamicTools(response.data.tools);
                }
            } catch (error) {
                console.error("Failed to fetch dynamic tools for comparison:", error);
            }
        };
        fetchDynamicTools();
    }, []);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    useEffect(() => {
        if (selectedTools.length === 0) {
            history.push('/');
        }
    }, [selectedTools, history]);

    if (selectedTools.length === 0) return null;

    const attributes = [
        { label: 'Name', key: 'name', type: 'text' },
        { label: 'Pricing', key: 'pricing', type: 'badge' },
        { label: 'Category', key: 'category', type: 'text' },
        { label: 'Rating', key: 'rating', type: 'rating' }, // Assuming rating exists or fallback
        { label: 'Features', key: 'description', type: 'long-text' },
        { label: 'Launch Date', key: 'dateAdded', type: 'date' },
    ];

    // Helper to find fresh tool data
    const getFreshTool = (tool) => {
        // 1. Try to find in dynamic tools (Database/Backend) - prioritize this as it has latest ratings
        const dynamicMatch = dynamicTools.find(t => t.name === tool.name || t._id === tool._id);
        if (dynamicMatch) return dynamicMatch;

        // 2. Try to find in static tools (toolsData.js)
        const flatTools = toolsData.flatMap(cat => cat.tools);
        return flatTools.find(t => t.name === tool.name) || tool;
    };

    return (
        <div className="min-h-screen bg-[#050505] text-white pt-24 pb-20 px-4 md:px-8 relative overflow-hidden">
             <DashboardBackground />
             
             {/* Themed Background Image */}
             <div className="fixed inset-0 z-0 pointer-events-none">
                <img 
                    src={compareBg} 
                    alt="" 
                    className="w-full h-full object-cover opacity-20 mix-blend-screen" 
                />
                <div className="absolute inset-0 bg-gradient-to-b from-[#050505]/80 via-transparent to-[#050505]" />
             </div>
             
             <div className="relative z-10 max-w-7xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 mb-4">
                        Compare Tools
                    </h1>
                    <p className="text-gray-400">Side-by-side comparison of your selected AI tools.</p>
                </div>

                <div className="overflow-x-auto pb-4">
                    <div className="min-w-[800px] bg-[#0F0F0F] rounded-3xl border border-white/5 overflow-hidden shadow-2xl">
                        {/* Table Header - Images & Actions */}
                        <div className="grid grid-cols-[200px_repeat(3,1fr)] bg-white/5 border-b border-white/5">
                            <div className="p-6 flex items-center text-gray-400 font-bold uppercase tracking-wider text-sm">
                                Tool Info
                            </div>
                            {selectedTools.map(staleTool => {
                                const tool = getFreshTool(staleTool);
                                return (
                                <div key={tool._id || tool.name} className="p-6 relative border-l border-white/5 flex flex-col items-center text-center gap-4">
                                     <button 
                                        onClick={() => removeFromCompare(tool.name)}
                                        className="absolute top-4 right-4 text-gray-500 hover:text-red-500 transition-colors"
                                    >
                                        <FaTimes />
                                    </button>
                                    
                                    <div className="w-20 h-20 rounded-2xl overflow-hidden border border-white/10 shadow-lg">
                                        <img src={tool.image || tool.snapshotUrl} alt={tool.name} className="w-full h-full object-cover" />
                                    </div>
                                    
                                    <h3 className="text-xl font-bold">{tool.name}</h3>
                                    
                                    <a 
                                        href={addRefToUrl(tool.url)}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="px-4 py-2 text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors flex items-center gap-2"
                                    >
                                        Visit Site <FaExternalLinkAlt size={10} />
                                    </a>
                                </div>
                            )})}
                            {/* Fill empty columns if less than 3 */}
                            {[...Array(3 - selectedTools.length)].map((_, i) => (
                                <div key={`empty-${i}`} className="p-6 border-l border-white/5 flex items-center justify-center text-gray-600 bg-black/20">
                                    <span className="text-sm">Select more tools to compare</span>
                                </div>
                            ))}
                        </div>

                        {/* Comparison Rows */}
                        <div className="divide-y divide-white/5">
                            {attributes.map((attr) => (
                                <div key={attr.key} className="grid grid-cols-[200px_repeat(3,1fr)] hover:bg-white/[0.02] transition-colors">
                                    <div className="p-6 text-gray-400 font-medium flex items-center border-r border-white/5 bg-white/[0.02]">
                                        {attr.label}
                                    </div>
                                    {selectedTools.map(staleTool => {
                                        const tool = getFreshTool(staleTool);
                                        return (
                                        <div key={tool._id || tool.name} className="p-6 border-l border-white/5 flex items-center justify-center text-center">
                                            {attr.type === 'badge' ? (
                                                 <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                                                    tool.pricing === 'Free' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                                                    tool.pricing === 'Paid' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                                                    'bg-blue-500/10 text-blue-400 border-blue-500/20'
                                                }`}>
                                                    {tool.pricing || 'N/A'}
                                                </span>
                                            ) : attr.type === 'date' ? (
                                                <span className="text-gray-400 text-sm">
                                                    {tool.dateAdded ? new Date(tool.dateAdded).toLocaleDateString() : 'Unknown'}
                                                </span>
                                            ) : attr.type === 'rating' ? (
                                                <div className="flex items-center justify-center gap-1.5 font-bold text-amber-400">
                                                    <FaStar size={14} />
                                                    <span>{tool.rating || '-'}</span>
                                                    {tool.reviewCount && <span className="text-gray-500 text-xs font-normal">({tool.reviewCount})</span>}
                                                </div>
                                            ) : attr.type === 'long-text' ? (
                                                <p className="text-sm text-gray-300 leading-relaxed max-w-sm">
                                                    {tool[attr.key] || 'No description available.'}
                                                </p>
                                            ) : (
                                                <span className="text-gray-200 font-medium">{tool[attr.key] || '-'}</span>
                                            )}
                                        </div>
                                    )})}
                                    {[...Array(3 - selectedTools.length)].map((_, i) => (
                                        <div key={`empty-row-${i}`} className="p-6 border-l border-white/5 bg-black/20" />
                                    ))}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
             </div>
        </div>
    );
};

export default ComparePage;
