import React from 'react';
import { useCompare } from '../contexts/CompareContext';
import { motion as m, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaTimes, FaExchangeAlt } from 'react-icons/fa';

const ComparisonBar = () => {
    const { selectedTools, removeFromCompare, clearCompare } = useCompare();

    if (selectedTools.length === 0) return null;

    return (
        <AnimatePresence>
            <m.div 
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 100, opacity: 0 }}
                className="fixed bottom-0 left-0 right-0 z-50 pointer-events-none flex justify-center pb-6 md:pb-8"
            >
                <div className="pointer-events-auto bg-[#0F0F0F] border border-white/10 rounded-2xl shadow-xl shadow-blue-500/5 p-3 md:p-4 flex items-center gap-4 md:gap-6 w-[95%] md:w-auto max-w-2xl backdrop-blur-xl relative overflow-hidden group">
                    {/* Subtle Glow Effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-transparent to-blue-500/5 pointer-events-none" />
                    
                    <div className="flex items-center gap-2 md:gap-3 overflow-x-auto scrollbar-hide py-1 px-1 relative z-10">
                        {selectedTools.map(tool => (
                            <div key={tool.name} className="relative group/item shrink-0">
                                <img 
                                    src={tool.image} 
                                    alt={tool.name} 
                                    className="w-10 h-10 md:w-12 md:h-12 rounded-lg object-cover border border-white/10 shadow-sm"
                                />
                                <button 
                                    onClick={() => removeFromCompare(tool.name)}
                                    className="absolute -top-1.5 -right-1.5 bg-red-500 hover:bg-red-600 rounded-full p-1 text-white shadow-lg opacity-0 group-hover/item:opacity-100 transition-all scale-75 group-hover/item:scale-100"
                                >
                                    <FaTimes size={8} />
                                </button>
                            </div>
                        ))}
                    </div>

                    <div className="h-8 w-px bg-white/10 shrink-0" />

                    <div className="flex items-center gap-3 shrink-0 relative z-10">
                        <div className="hidden md:flex h-6 px-3 rounded-full border border-blue-500/30 bg-blue-500/10 items-center justify-center text-[10px] uppercase font-bold tracking-wider text-blue-400">
                             {selectedTools.length} / 3 Selected
                        </div>
                        
                        <div className="flex gap-2">
                             <button 
                                onClick={clearCompare}
                                className="px-3 py-2 text-xs md:text-sm text-gray-500 hover:text-white transition-colors font-medium"
                            >
                                Clear
                            </button>
                            <Link 
                                to="/compare"
                                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs md:text-sm font-bold transition-all shadow-lg shadow-blue-600/20 hover:shadow-blue-600/40"
                            > 
                                <FaExchangeAlt /> Compare
                            </Link>
                        </div>
                    </div>
                </div>
            </m.div>
        </AnimatePresence>
    );
};

export default ComparisonBar;
