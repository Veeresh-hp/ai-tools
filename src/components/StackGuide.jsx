import React from 'react';
// Fixed unused import
import { FaPlus, FaLayerGroup, FaGlobe, FaArrowRight } from 'react-icons/fa';
import { motion } from 'framer-motion';

const StackGuide = () => {
    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2
            }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 50, damping: 15 } }
    };

    return (
        <div className="w-full mb-12">
            <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-center mb-8"
            >
                <div className="inline-flex items-center justify-center p-3 bg-gradient-to-r from-orange-500/10 via-red-500/10 to-purple-500/10 rounded-2xl border border-white/5 backdrop-blur-sm mb-2 shadow-[0_0_30px_rgba(0,0,0,0.5)]">
                    <h3 className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-red-400 to-purple-400 font-bold text-xl uppercase tracking-wider">
                        🚀 Power Up with Stacks
                    </h3>
                </div>
                <p className="text-gray-400 text-sm">Curate your personal toolkit in 3 simple steps.</p>
            </motion.div>

            <motion.div 
                variants={container}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 md:grid-cols-3 gap-6 relative"
            >
                 {/* Connection Lines (Desktop) */}
                 <div className="hidden md:block absolute top-[40px] left-[16%] right-[16%] h-[2px] bg-gradient-to-r from-orange-500/20 via-red-500/20 to-purple-500/20 z-0 border-t border-dashed border-white/10"></div>

                {/* Step 1: Create */}
                <motion.div variants={item} className="relative z-10 group cursor-default">
                        <div className="bg-[#0F0F0F] border border-white/10 rounded-2xl p-6 h-full relative overflow-hidden group-hover:border-orange-500/30 transition-all duration-500 shadow-md hover:shadow-xl">
                        <div className="absolute top-0 right-0 p-3 opacity-10 font-black text-6xl text-white/5 select-none">01</div>
                        
                        <div className="w-14 h-14 rounded-xl bg-orange-500/10 flex items-center justify-center mb-5 text-orange-400 border border-orange-500/20 group-hover:bg-orange-500/20 transition-colors duration-300">
                            <FaPlus size={24} />
                        </div>
                        
                        <h4 className="font-bold text-white text-lg mb-2">Create New Stack</h4>
                        <p className="text-sm text-gray-400 mb-4 leading-relaxed">Click <span className="text-orange-400 font-bold">Create New Stack</span> above. Give it a name like "My Workflow" or "Design Kit".</p>
                        
                        <div className="w-full bg-black/40 rounded-lg border border-white/10 p-3 flex items-center justify-between">
                                <span className="text-xs text-gray-500 font-bold">My Workflow</span>
                                <div className="px-2 py-1 bg-blue-600 rounded text-[8px] text-white">Create</div>
                        </div>
                        </div>
                        <div className="hidden md:block absolute top-[50px] -right-5 text-gray-800 bg-[#0A0A0A] z-20 rounded-full p-1 border border-white/5">
                            <FaArrowRight size={10} />
                        </div>
                </motion.div>

                {/* Step 2: Add Tools */}
                <motion.div variants={item} className="relative z-10 group cursor-default">
                        <div className="bg-[#0F0F0F] border border-white/10 rounded-2xl p-6 h-full relative overflow-hidden group-hover:border-red-500/30 transition-all duration-500 shadow-md hover:shadow-xl">
                            <div className="absolute top-0 right-0 p-3 opacity-10 font-black text-6xl text-white/5 select-none">02</div>
                        
                        <div className="w-14 h-14 rounded-xl bg-red-500/10 flex items-center justify-center mb-5 text-red-400 border border-red-500/20 group-hover:bg-red-500/20 transition-colors duration-300">
                            <FaLayerGroup size={24} />
                        </div>

                        <h4 className="font-bold text-white text-lg mb-2">Add Tools</h4>
                        <p className="text-sm text-gray-400 mb-4 leading-relaxed">Browse any tool. Click the <span className="text-red-400 font-bold">Stack Icon</span> (3 layers) in the top right to save it.</p>
                        
                        <div className="flex justify-center">
                            <div className="relative w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                                <FaLayerGroup className="text-gray-400" size={14} />
                                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border border-black"></div>
                            </div>
                        </div>
                        </div>
                        <div className="hidden md:block absolute top-[50px] -right-5 text-gray-800 bg-[#0A0A0A] z-20 rounded-full p-1 border border-white/5">
                            <FaArrowRight size={10} />
                        </div>
                </motion.div>

                {/* Step 3: Share */}
                <motion.div variants={item} className="relative z-10 group cursor-default">
                        <div className="bg-[#0F0F0F] border border-white/10 rounded-2xl p-6 h-full relative overflow-hidden group-hover:border-purple-500/30 transition-all duration-500 shadow-md hover:shadow-xl">
                            <div className="absolute top-0 right-0 p-3 opacity-10 font-black text-6xl text-white/5 select-none">03</div>
                        
                        <div className="w-14 h-14 rounded-xl bg-purple-500/10 flex items-center justify-center mb-5 text-purple-400 border border-purple-500/20 group-hover:bg-purple-500/20 transition-colors duration-300">
                            <FaGlobe size={24} />
                        </div>

                        <h4 className="font-bold text-white text-lg mb-2">Share & Discover</h4>
                        <p className="text-sm text-gray-400 mb-4 leading-relaxed">Make it <span className="text-purple-400 font-bold">Public</span> to share with the world, or explore stacks made by others.</p>
                            
                            <div className="w-full flex justify-center gap-2">
                            <div className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-[10px] font-bold border border-green-500/30">Public</div>
                            <div className="px-3 py-1 bg-white/10 text-gray-400 rounded-full text-[10px] font-bold border border-white/10">Private</div>
                            </div>
                        </div>
                </motion.div>

            </motion.div>
        </div>
    );
};

export default StackGuide;
