import React from 'react';
import { FaExchangeAlt } from 'react-icons/fa';

const ComparisonGuide = () => {
    return (
        <div className="w-full max-w-4xl mx-auto p-4">
            <div className="text-center mb-6">
                <h3 className="text-white font-medium text-lg">Follow these simple steps to view features side-by-side.</h3>
            </div>

            <div className="flex md:grid md:grid-cols-3 gap-4 md:gap-6 overflow-x-auto md:overflow-visible snap-x snap-mandatory scrollbar-hide pb-2 md:pb-0 -mx-4 px-4 md:mx-0 md:px-0">
                {/* Connecting Lines (Desktop Only) */}
                <div className="hidden md:block absolute top-1/2 left-1/3 w-1/6 h-[2px] bg-gradient-to-r from-blue-500/20 to-blue-500/50 -translate-y-1/2 transform -translate-x-1/2" />
                <div className="hidden md:block absolute top-1/2 left-2/3 w-1/6 h-[2px] bg-gradient-to-r from-blue-500/50 to-purple-500/50 -translate-y-1/2 transform -translate-x-1/2" />

                {/* Step 1: Select Tools */}
                <div className="min-w-[85%] md:min-w-0 snap-center flex flex-col items-center gap-4 relative group">
                    <div className="text-xs font-bold text-blue-400 tracking-wider">STEP 1: SELECT TOOLS</div>
                    
                    {/* Visual Mockup */}
                    <div className="relative w-full aspect-[4/3] bg-[#0F0F0F] rounded-xl border border-white/10 p-3 overflow-hidden shadow-lg group-hover:border-blue-500/30 transition-colors">
                        {/* Mock Tool Card */}
                        <div className="flex gap-3 mb-2">
                            <div className="w-10 h-10 rounded-lg bg-yellow-400/20 shrink-0" />
                            <div className="space-y-1.5 w-full">
                                <div className="h-2 w-2/3 bg-white/10 rounded" />
                                <div className="h-2 w-1/2 bg-white/10 rounded" />
                            </div>
                        </div>
                        <div className="flex gap-2 mb-4">
                             <div className="h-4 w-12 bg-purple-500/20 rounded text-[8px] flex items-center justify-center text-purple-400">NEW</div>
                            <div className="h-4 w-12 bg-gray-500/20 rounded text-[8px] flex items-center justify-center text-gray-400">Freemium</div>
                        </div>

                        {/* Highlighted Action */}
                        <div className="absolute top-2 right-2">
                             <div className="relative">
                                <div className="absolute inset-0 bg-purple-500/40 blur-md rounded-full animate-pulse" />
                                <div className="relative w-7 h-7 rounded-full bg-white/5 border border-purple-500/50 flex items-center justify-center text-purple-400">
                                    <FaExchangeAlt size={10} />
                                </div>
                             </div>
                        </div>
                        
                        {/* Pointer Arrow - Step 1 */}
                         <div className="absolute top-12 right-5 text-purple-400/80 animate-bounce">
                            <svg className="transform rotate-45" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                            </svg>
                        </div>
                    </div>
                    
                    <p className="text-gray-400 text-xs text-center">Click the 'Compare' icon on tool cards.</p>
                </div>

                {/* Step 2: Review Selection */}
                <div className="min-w-[85%] md:min-w-0 snap-center flex flex-col items-center gap-4 relative group">
                    <div className="text-xs font-bold text-blue-400 tracking-wider">STEP 2: REVIEW</div>

                    {/* Visual Mockup */}
                    <div className="relative w-full aspect-[4/3] bg-[#0F0F0F] rounded-xl border border-white/10 p-3 flex flex-col justify-end overflow-hidden shadow-lg group-hover:border-blue-500/30 transition-colors">
                        
                        {/* Floating Selection Bar Mockup */}
                        <div className="w-full bg-[#1A1A1A] rounded-lg border border-white/10 p-2 flex items-center justify-between gap-2 shadow-2xl skew-y-1 transform origin-bottom-left">
                            <div className="flex -space-x-2">
                                <div className="w-6 h-6 rounded-full bg-yellow-400/20 border border-[#1A1A1A]" />
                                <div className="w-6 h-6 rounded-full bg-green-400/20 border border-[#1A1A1A]" />
                            </div>
                              <div className="h-5 px-2 rounded-full border border-blue-500/30 bg-blue-500/10 flex items-center justify-center text-[8px] text-blue-400">
                                2 / 3
                            </div>
                            <div className="w-6 h-6 rounded bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-600/20">
                                <FaExchangeAlt size={10} />
                            </div>
                        </div>

                          {/* Pointer Arrow - Step 2 */}
                          <div className="absolute bottom-20 right-6 text-blue-400/80 animate-bounce delay-75">
                            <svg className="transform rotate-180" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                            </svg>
                        </div>

                    </div>

                    <p className="text-gray-400 text-xs text-center">Confirm choices and click 'Compare'.</p>
                </div>

                {/* Step 3: View Comparison */}
                <div className="min-w-[85%] md:min-w-0 snap-center flex flex-col items-center gap-4 relative group">
                    <div className="text-xs font-bold text-blue-400 tracking-wider">STEP 3: ANALYZE</div>

                    {/* Visual Mockup */}
                    <div className="relative w-full aspect-[4/3] bg-[#0F0F0F] rounded-xl border border-white/10 overflow-hidden shadow-lg group-hover:border-blue-500/30 transition-colors flex">
                        {/* Col 1 */}
                        <div className="w-1/2 border-r border-white/5 p-2 space-y-2">
                             <div className="w-8 h-8 rounded bg-yellow-400/20 mx-auto" />
                             <div className="h-1.5 w-16 bg-white/10 rounded mx-auto" />
                             <div className="space-y-1 mt-2">
                                <div className="h-1 w-full bg-white/5 rounded" />
                                <div className="h-1 w-full bg-white/5 rounded" />
                                <div className="h-1 w-2/3 bg-white/5 rounded" />
                             </div>
                        </div>
                        {/* Col 2 */}
                        <div className="w-1/2 p-2 space-y-2 bg-white/[0.02]">
                             <div className="w-8 h-8 rounded bg-green-400/20 mx-auto" />
                             <div className="h-1.5 w-16 bg-white/10 rounded mx-auto" />
                             <div className="space-y-1 mt-2">
                                <div className="h-1 w-full bg-white/5 rounded" />
                                <div className="h-1 w-full bg-white/5 rounded" />
                                <div className="h-1 w-2/3 bg-white/5 rounded" />
                             </div>
                        </div>
                        
                         {/* Scan Line Effect */}
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-500/5 to-transparent h-full w-full animate-scan" />
                    </div>

                    <p className="text-gray-400 text-xs text-center">Analyze features side-by-side.</p>
                </div>
            </div>
        </div>
    );
};

export default ComparisonGuide;
