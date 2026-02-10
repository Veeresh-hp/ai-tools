import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { FaArrowRight, FaTimes } from 'react-icons/fa';
import { AnimatePresence, motion } from 'framer-motion';
import ComparisonGuide from './ComparisonGuide';

const AnnouncementBanner = () => {
    const [showModal, setShowModal] = useState(false);
    const [isVisible, setIsVisible] = useState(true);
    const location = useLocation();
    
    // Only apply top margin on Home page (where fixed nav exists)
    const isHome = location.pathname === '/';

    if (!isVisible) return null;

    return (
        <>
            {/* The Blue Smart Bar */}
            <div 
                onClick={() => setShowModal(true)}
                className={`${isHome ? 'mt-16 md:mt-0' : ''} bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 cursor-pointer text-white text-xs md:text-sm font-semibold py-2.5 px-4 flex items-center justify-center text-center relative z-[60] hover:brightness-110 transition-all shadow-lg shadow-blue-500/20`}
            >
                <div className="flex items-center gap-3">
                    <span className="opacity-95">
                        New Feature: Compare AI Tools Side-by-Side
                    </span>
                    <span className="hidden sm:flex items-center font-bold hover:underline whitespace-nowrap">
                        Check it out <FaArrowRight className="ml-1.5 text-[10px]" />
                    </span>
                </div>

                {/* Close Button */}
                <button 
                    onClick={(e) => {
                        e.stopPropagation();
                        setIsVisible(false);
                    }}
                    className="absolute right-2 md:right-4 p-1.5 hover:bg-white/20 rounded-full transition-colors"
                >
                    <FaTimes size={12} />
                </button>
            </div>

            {/* The Modal / Popup */}
            <AnimatePresence>
                {showModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
                        onClick={() => setShowModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="bg-[#0F0F0F] border border-white/10 rounded-2xl w-full max-w-5xl overflow-hidden relative shadow-2xl"
                            onClick={e => e.stopPropagation()}
                        >
                            {/* Close Button */}
                            <button 
                                onClick={() => setShowModal(false)}
                                className="absolute top-4 right-4 text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 p-2 rounded-full transition-colors z-10"
                            >
                                <FaTimes />
                            </button>

                            {/* Content */}
                            <div className="p-5 md:p-12 overflow-y-auto max-h-[90vh] scrollbar-hide">
                                <div className="hidden md:block text-center mb-10">
                                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                                        New Feature Spotlight
                                    </h2>
                                    <p className="text-gray-400 max-w-2xl mx-auto">
                                        We've updated our dashboard with a powerful new reporting system and enhanced analytics.
                                    </p>
                                </div>
                                
                                <ComparisonGuide />
                                
                                <div className="mt-8 text-center">
                                    <button 
                                        onClick={() => setShowModal(false)}
                                        className="px-8 py-3 bg-[#3b82f6] hover:bg-blue-500 text-white font-bold rounded-xl transition-colors"
                                    >
                                        Got it, thanks!
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default AnnouncementBanner;