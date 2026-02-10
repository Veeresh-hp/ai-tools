import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaStar, FaArrowRight } from 'react-icons/fa';
import { useLanguage } from '../context/LanguageContext';
import GradientBorder from './ui/GradientBorder';


import toolsData from '../data/toolsData';

const ToolOfTheDay = () => {
    const [tool, setTool] = useState(null);
    const { t } = useLanguage();
    const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

    useEffect(() => {
        fetch(`${API_URL}/api/tools/tool-of-the-day`)
            .then(res => res.json())
            .then(data => {
                if (data.tool) {
                    setTool(data.tool);
                } else {
                    // Fallback to static data
                    pickStaticTool();
                }
            })
            .catch(err => {
                console.error(err);
                pickStaticTool();
            });
    }, [API_URL]);

    const pickStaticTool = () => {
        // Flatten toolsData
        const allTools = toolsData.flatMap(cat => cat.tools);
        if (allTools.length > 0) {
            // Seeded random based on date
            const today = new Date().toISOString().slice(0, 10);
            let hash = 0;
            for (let i = 0; i < today.length; i++) {
                hash = today.charCodeAt(i) + ((hash << 5) - hash);
            }
            const index = Math.abs(hash) % allTools.length;
            setTool({...allTools[index], category: allTools[index].category || 'Featured'}); 
        }
    };

    if (!tool) return null;

    const toSlug = (val) => {
        return String(val || '')
          .trim()
          .toLowerCase()
          .replace(/[^a-z0-9\s-]/g, '')
          .replace(/\s+/g, '-')
          .replace(/-+/g, '-');
    };

    const getImageSrc = (item) => {
        if (item.image) return item.image;
        if (item.logo) return item.logo;
        // Try constructing path from public folder if it follows naming convention
        // This assumes images are at /Images/<name>.jpg or similar
        // For now, return null to trigger fallback if explicit image prop missing
        return null;
    };

    const imageSrc = getImageSrc(tool) || (tool.name ? `/Images/${tool.name.replace(/\s+/g, '')}.jpg` : null) || (tool.name ? `/Images/${tool.name.replace(/\s+/g, '')}.png` : null);

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-4 relative mt-4 md:mt-0 pt-2 md:pt-0">
             {/* Section Label - Clean & Minimal */}
             <div className="hidden md:flex items-center gap-3 mb-8">
                <div className="w-1.5 h-1.5 bg-violet-500 rounded-full shadow-[0_0_10px_rgba(139,92,246,0.5)]" />
                <h2 className="text-sm font-bold text-gray-400 uppercase tracking-[0.2em]">
                    {t('tool_of_the_day') || 'Spotlight'}
                </h2>
             </div>

            <GradientBorder borderRadius="32px" className="shadow-2xl">
                <div className="group relative p-6 md:p-10 overflow-hidden">
                {/* Background Aesthetics */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-violet-600/10 blur-[120px] rounded-full pointer-events-none -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-blue-600/10 blur-[100px] rounded-full pointer-events-none translate-y-1/2 -translate-x-1/2" />
                
                <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
                     {/* Image Section - Large & Premium */}
                    <Link to={`/tools/${toSlug(tool.category || 'all')}/${toSlug(tool.name)}`} className="block w-full relative group/image">
                        <div className="aspect-[16/10] w-full rounded-2xl overflow-hidden border border-white/10 bg-[#12121A] shadow-2xl relative z-10">
                             <img 
                                src={imageSrc} 
                                alt={tool.name} 
                                className="w-full h-full object-cover transition-transform duration-700 group-hover/image:scale-105"
                                onError={(e) => {
                                    e.target.style.display = 'none';
                                    e.target.nextSibling.style.display = 'flex';
                                }}
                             />
                             {/* Fallback */}
                             <div className="hidden absolute inset-0 items-center justify-center bg-[#1A1A24]">
                                <span className="text-6xl">✨</span>
                             </div>

                             {/* Mobile Label inside the image div */}
                             <div className="absolute top-3 left-3 z-20 md:hidden bg-violet-600/90 backdrop-blur-md border border-white/10 text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-lg uppercase tracking-wider">
                                {t('tool_of_the_day') || 'Tool of the Day'}
                             </div>
                             
                             {/* Inner Highlight Frame */}
                             <div className="absolute inset-0 border border-white/5 pointer-events-none rounded-2xl" />
                        </div>
                        {/* Soft Glow behind image */}
                        <div className="absolute -inset-4 bg-violet-500/20 blur-2xl opacity-0 group-hover/image:opacity-100 transition-opacity duration-500 -z-10" />
                    </Link>

                    {/* Content Section */}
                    <div className="flex flex-col items-start text-left">
                        {/* Badges Row */}
                        <div className="hidden md:flex flex-wrap items-center gap-3 mb-6">
                            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300 text-[11px] font-bold uppercase tracking-wider shadow-[0_0_10px_rgba(139,92,246,0.1)]">
                                <FaStar size={10} className="mb-0.5" /> Featured Choice
                            </div>
                            <div className="inline-flex items-center px-3 py-1 rounded-full bg-white/5 border border-white/5 text-gray-400 text-[11px] font-bold uppercase tracking-wider hover:bg-white/10 transition-colors">
                                {tool.category.replace(/-/g, ' ')}
                            </div>
                        </div>
                        
                        <h3 className="text-2xl md:text-5xl font-bold text-white mb-4 leading-tight tracking-tight">
                            {tool.name}
                        </h3>
                        
                        <p className="hidden md:block text-lg text-gray-400 mb-8 leading-relaxed line-clamp-3">
                            {tool.shortDescription || tool.description}
                        </p>

                        {/* Tags - Consistent */}
                         <div className="flex flex-wrap gap-2 mb-6 md:mb-8">
                            {(tool.tags || tool.hashtags || []).slice(0, 3).map((tag, i) => (
                                <div key={i} className="flex items-center px-3 py-1.5 rounded-lg bg-white/5 border border-white/5 text-xs font-medium text-gray-300 transition-colors hover:bg-white/10 hover:border-white/10">
                                    #{tag.replace(/#/g, '')}
                                </div>
                            ))}
                        </div>
                        
                        <div className="flex items-center gap-5 mt-auto">
                            <Link 
                                to={`/tools/${toSlug(tool.category || 'all')}/${toSlug(tool.name)}`}
                                className="group relative px-6 py-3 md:px-8 md:py-3.5 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white rounded-xl font-bold text-sm transition-all shadow-lg shadow-violet-900/20 hover:shadow-violet-800/40 flex items-center gap-2 overflow-hidden"
                            >
                                <span className="relative z-10 flex items-center gap-2">
                                    {t('tool_visit') || 'View Tool'} <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                                </span>
                            </Link>
                        </div>
                    </div>
                </div>
                </div>
            </GradientBorder>
        </div>
    );
};

export default ToolOfTheDay;
