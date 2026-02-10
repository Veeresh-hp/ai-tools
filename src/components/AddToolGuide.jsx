import React from 'react';
import { FaRobot, FaCopy, FaBolt, FaCheckCircle, FaArrowRight } from 'react-icons/fa';
import { SiOpenai, SiGoogle } from 'react-icons/si';
import { motion } from 'framer-motion';

const AddToolGuide = () => {
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

    const lineVariant = {
        hidden: { width: 0, opacity: 0 },
        show: { width: '80%', opacity: 1, transition: { duration: 1.5, delay: 0.5, ease: "easeInOut" } }
    };

    return (
        <div className="w-full mb-8">
            <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-center mb-6"
            >
                <div className="inline-flex items-center justify-center p-3 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-yellow-500/10 rounded-2xl border border-white/5 backdrop-blur-sm mb-2 shadow-[0_0_30px_rgba(0,0,0,0.5)]">
                    <h3 className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-yellow-400 font-bold text-xl uppercase tracking-wider">
                        💡 Master the Workflow
                    </h3>
                </div>
                <p className="text-gray-400 text-sm">Follow these 4 simple steps to submit tools in seconds.</p>
            </motion.div>

            <motion.div 
                variants={container}
                initial="hidden"
                animate="show"
                className="relative"
            >
                {/* Connecting Line (Desktop) - Animated */}
                <motion.div 
                    variants={lineVariant}
                    className="hidden md:block absolute top-[40px] left-[10%] h-[2px] bg-gradient-to-r from-blue-500/40 via-purple-500/40 to-green-500/40 z-0 shadow-[0_0_10px_rgba(255,255,255,0.2)]" 
                />

                <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-4 md:grid md:grid-cols-4 md:gap-6 md:overflow-visible px-4 -mx-4 md:mx-0 md:px-0 scrollbar-hide">
                    
                    {/* Step 1: Input & Copy Prompt */}
                    <motion.div variants={item} className="min-w-[85%] md:min-w-0 snap-center relative z-10 group cursor-default">
                         <div className="bg-[#0F0F0F] border border-white/10 rounded-2xl p-5 h-full relative overflow-hidden group-hover:border-blue-500/30 transition-all duration-500 shadow-md hover:shadow-xl">
                            <div className="absolute top-0 right-0 p-3 opacity-10 font-black text-6xl text-white/5 select-none">01</div>
                            
                            <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center mb-4 text-blue-400 border border-blue-500/20 group-hover:bg-blue-500/20 transition-colors duration-300">
                                <FaRobot size={22} />
                            </div>
                            
                            <h4 className="font-bold text-white text-lg mb-2">Input & Copy</h4>
                            <p className="text-xs text-gray-400 mb-3 leading-relaxed">Enter <span className="text-blue-400 font-semibold">Tool Name & URL</span>. In the <span className="text-blue-400 font-semibold">AI Helper</span> panel (right), click the <strong>Copy Icon</strong>.</p>
                            
                            <div className="flex flex-col gap-1">
                                <span className="text-[8px] uppercase tracking-wider text-gray-500 font-bold ml-1">AI Helper Panel</span>
                                <div className="bg-black/40 rounded-lg border border-white/10 p-2 flex items-center justify-between gap-2 border-l-2 border-l-blue-500/50">
                                     <span className="text-[10px] text-gray-500 font-mono">Analyze this tool...</span>
                                     <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} className="text-blue-400 hover:text-white transition-colors bg-blue-500/10 p-1.5 rounded-md">
                                        <FaCopy size={10} />
                                     </motion.button>
                                </div>
                            </div>
                         </div>
                         <div className="hidden md:block absolute top-[45px] -right-4 text-gray-800 bg-[#0F0F0F] z-20 rounded-full p-1 border border-white/5">
                            <FaArrowRight size={8} />
                         </div>
                    </motion.div>

                    {/* Step 2: Generate JSON */}
                    <motion.div variants={item} className="min-w-[85%] md:min-w-0 snap-center relative z-10 group cursor-default">
                         <div className="bg-[#0F0F0F] border border-white/10 rounded-2xl p-5 h-full relative overflow-hidden group-hover:border-purple-500/30 transition-all duration-500 shadow-md hover:shadow-xl">
                             <div className="absolute top-0 right-0 p-3 opacity-10 font-black text-6xl text-white/5 select-none">02</div>
                            
                            <div className="flex gap-2 mb-4">
                                <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400 border border-purple-500/20 group-hover:bg-purple-500/20 transition-colors duration-300">
                                    <span className="font-mono font-bold text-lg">{`{}`}</span>
                                </div>
                                {/* AI Logos */}
                                <div className="flex flex-col gap-1 justify-center">
                                    <div className="flex items-center gap-1 bg-white/5 px-2 py-1 rounded text-[10px] text-gray-300 border border-white/5">
                                        <SiOpenai /> ChatGPT
                                    </div>
                                    <div className="flex items-center gap-1 bg-white/5 px-2 py-1 rounded text-[10px] text-gray-300 border border-white/5">
                                        <SiGoogle /> Gemini
                                    </div>
                                </div>
                            </div>

                            <h4 className="font-bold text-white text-lg mb-2">Generate & Copy</h4>
                            <p className="text-xs text-gray-400 mb-3 leading-relaxed">Paste in <span className="text-purple-400 font-semibold">AI Chat</span>. Copy the raw <span className="text-purple-400 font-semibold">JSON code</span> output.</p>
                            
                            <div className="bg-black/40 rounded-lg border border-white/10 p-2 opacity-50 flex flex-col gap-1.5">
                                 <div className="h-1.5 w-3/4 bg-purple-500/40 rounded-full"></div>
                                 <div className="h-1.5 w-full bg-gray-700/50 rounded-full"></div>
                            </div>
                         </div>
                         <div className="hidden md:block absolute top-[45px] -right-4 text-gray-800 bg-[#0F0F0F] z-20 rounded-full p-1 border border-white/5">
                            <FaArrowRight size={8} />
                         </div>
                    </motion.div>

                    {/* Step 3: Quick Fill */}
                    <motion.div variants={item} className="min-w-[85%] md:min-w-0 snap-center relative z-10 group cursor-default">
                         <div className="bg-[#0F0F0F] border border-white/10 rounded-2xl p-5 h-full relative overflow-hidden group-hover:border-yellow-500/30 transition-all duration-500 shadow-md hover:shadow-xl">
                             <div className="absolute top-0 right-0 p-3 opacity-10 font-black text-6xl text-white/5 select-none">03</div>
                            
                            <div className="w-12 h-12 rounded-xl bg-yellow-500/10 flex items-center justify-center mb-4 text-yellow-400 border border-yellow-500/20 group-hover:bg-yellow-500/20 transition-colors duration-300">
                                <FaBolt size={22} />
                            </div>

                            <h4 className="font-bold text-white text-lg mb-2">Auto-Fill</h4>
                            <p className="text-xs text-gray-400 mb-3 leading-relaxed">Click <span className="font-mono text-yellow-500 bg-yellow-500/10 px-1.5 py-0.5 rounded text-[10px]">Alt+Q</span>, paste JSON, and watch it <span className="text-yellow-400 font-semibold">Populate</span> instantly.</p>
                            
                            <div className="w-full py-1.5 bg-yellow-600/10 border border-yellow-600/20 rounded flex items-center justify-center">
                                <span className="text-[10px] text-yellow-500 font-bold">Magic Filling...</span>
                            </div>
                         </div>
                         <div className="hidden md:block absolute top-[45px] -right-4 text-gray-800 bg-[#0F0F0F] z-20 rounded-full p-1 border border-white/5">
                            <FaArrowRight size={8} />
                         </div>
                    </motion.div>

                    {/* Step 4: Submit */}
                    <motion.div variants={item} className="min-w-[85%] md:min-w-0 snap-center relative z-10 group cursor-default">
                         <div className="bg-[#0F0F0F] border border-white/10 rounded-2xl p-5 h-full relative overflow-hidden group-hover:border-green-500/30 transition-all duration-500 shadow-md hover:shadow-xl">
                             <div className="absolute top-0 right-0 p-3 opacity-10 font-black text-6xl text-white/5 select-none">04</div>
                            
                            <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center mb-4 text-green-400 border border-green-500/20 group-hover:bg-green-500/20 transition-colors duration-300">
                                <FaCheckCircle size={22} />
                            </div>

                            <h4 className="font-bold text-white text-lg mb-2">Submit Tool</h4>
                            <p className="text-xs text-gray-400 mb-3 leading-relaxed">Upload <span className="text-green-400 font-semibold">Screenshot</span>, click Submit, and wait for <span className="text-green-400 font-semibold">Approval</span>.</p>
                             
                             <div className="w-full flex justify-center">
                                <div className="w-10 h-6 border-2 border-dashed border-green-500/30 rounded-md flex items-center justify-center bg-green-500/5">
                                    <div className="w-3 h-3 bg-green-500/50 rounded-full"></div>
                                </div>
                             </div>
                         </div>
                    </motion.div>

                </div>
            </motion.div>
        </div>
    );
};

export default AddToolGuide;
