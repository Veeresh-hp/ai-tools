import React, { useState, useEffect } from 'react';
import { m } from 'framer-motion';
import { FaExternalLinkAlt, FaBookmark, FaRegBookmark, FaChevronRight } from 'react-icons/fa';
import { addRefToUrl } from '../utils/linkUtils';
import { addToHistory } from '../utils/historyUtils';

const HorizontalToolCard = ({ tool, onClick }) => {
  const [imageError, setImageError] = useState(false);
  const [saved, setSaved] = useState(false);

  // Helper to build a favicon URL when no image is available
  const getFaviconUrl = (url) => {
    try {
      if (!url) return null;
      const { hostname } = new URL(url);
      return `https://www.google.com/s2/favicons?domain=${hostname}&sz=128`;
    } catch {
      return null;
    }
  };

  const getToolKey = React.useCallback(() => tool.url || tool.name || tool.id, [tool.url, tool.name, tool.id]);

  useEffect(() => {
    try {
      const key = getToolKey();
      const raw = localStorage.getItem('ai_bookmarks');
      const arr = raw ? JSON.parse(raw) : [];
      setSaved(arr.includes(key));
    } catch {
      // ignore
    }
  }, [getToolKey]);

  const toggleBookmark = (e) => {
    e.stopPropagation();
    try {
      const key = getToolKey();
      const raw = localStorage.getItem('ai_bookmarks');
      let arr = raw ? JSON.parse(raw) : [];
      if (arr.includes(key)) {
        arr = arr.filter(x => x !== key);
        setSaved(false);
      } else {
        arr.push(key);
        setSaved(true);
      }
      localStorage.setItem('ai_bookmarks', JSON.stringify(arr));
    } catch (err) {
      console.error('bookmark error', err);
    }
  };

  const handleVisit = (e) => {
    e.stopPropagation();
    if (tool.url) {
        addToHistory(tool);
        window.open(addRefToUrl(tool.url), '_blank', 'noopener,noreferrer');
    }
  };

  const primaryImage = tool.image;
  const fallbackImage = getFaviconUrl(tool.url);
  const displayImage = !imageError ? (primaryImage || fallbackImage) : fallbackImage;

  return (
    <m.article
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -2 }}
      onClick={onClick}
      className="group relative flex flex-col sm:flex-row items-stretch gap-0 sm:gap-6 p-0 sm:p-5 rounded-2xl sm:rounded-3xl bg-[#12121A] border border-white/5 hover:border-purple-500/30 hover:bg-[#1A1A24] transition-all duration-300 cursor-pointer overflow-hidden shadow-lg hover:shadow-purple-500/10"
    >
        {/* Glow Effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/0 via-purple-500/5 to-purple-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

      {/* Image Section */}
      <div className="relative w-full sm:w-48 h-48 sm:h-auto flex-shrink-0 bg-black/40 overflow-hidden sm:rounded-2xl">
        {displayImage ? (
          <img 
            src={displayImage} 
            alt={tool.name} 
            className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-110"
            onError={() => setImageError(true)}
          />
        ) : (
             <div className={`w-full h-full flex items-center justify-center text-4xl bg-gradient-to-br ${
                tool.pricing === 'Free' ? 'from-green-900/40 to-black' : 
                tool.pricing === 'Paid' ? 'from-red-900/40 to-black' : 
                'from-indigo-900/40 to-black'
             }`}>
                🚀
             </div>
        )}
        {/* Mobile Badge Overlay */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-2 sm:hidden">
            {tool.pricing && (
                <span className={`px-2 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md backdrop-blur-md border ${
                  tool.pricing === 'Free' ? 'bg-emerald-500/20 border-emerald-500/30 text-emerald-300' :
                  'bg-blue-500/20 border-blue-500/30 text-blue-300'
                }`}>
                  {tool.pricing}
                </span>
            )}
        </div>
      </div>

      {/* Content Section */}
      <div className="flex-1 min-w-0 flex flex-col justify-between p-5 sm:p-1">
        <div>
          <div className="flex items-start justify-between gap-4">
            <div>
                 <h3 className="text-xl font-bold text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:to-purple-400 transition-all duration-300">
                  {tool.name}
                </h3>
                {tool.dateAdded && (
                    <p className="text-xs text-gray-500 mt-1">
                        Added {new Date(tool.dateAdded).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>
                )}
            </div>
            
            {/* Desktop Actions */}
            <div className="hidden sm:flex items-center gap-2">
                 <button
                    onClick={toggleBookmark}
                    className={`w-9 h-9 flex items-center justify-center rounded-full border transition-all duration-200 ${
                        saved 
                        ? 'bg-yellow-500/20 border-yellow-500/50 text-yellow-400' 
                        : 'bg-white/5 border-white/10 text-gray-400 hover:text-white hover:bg-white/10'
                    }`}
                    title={saved ? 'Remove from favorites' : 'Add to favorites'}
                >
                    {saved ? <FaBookmark size={14} /> : <FaRegBookmark size={14} />}
                </button>
                {tool.url && (
                    <button
                        onClick={handleVisit}
                        className="w-9 h-9 flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all"
                        title="Visit Website"
                    >
                        <FaExternalLinkAlt size={12} />
                    </button>
                )}
            </div>
          </div>

          <p className="mt-3 text-sm text-gray-400 leading-relaxed line-clamp-2 group-hover:text-gray-300 transition-colors">
            {tool.description}
          </p>
        </div>

        <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-2 flex-wrap">
             {/* Desktop Pricing Badge */}
             <div className="hidden sm:block">
                 {tool.pricing && (
                    <span className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-lg border ${
                      tool.pricing === 'Free' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' :
                      'bg-blue-500/10 border-blue-500/20 text-blue-400'
                    }`}>
                      {tool.pricing}
                    </span>
                 )}
             </div>
             {tool.category && (
                 <span className="px-2.5 py-1 text-[10px] font-medium text-purple-300 bg-purple-500/10 border border-purple-500/20 rounded-lg capitalize">
                    {tool.category.replace(/-/g, ' ')}
                 </span>
             )}
              {tool.isNew && (
                  <span className="px-2.5 py-1 text-[10px] font-bold text-amber-300 bg-amber-500/10 border border-amber-500/20 rounded-lg uppercase tracking-wider animate-pulse">
                      New
                  </span>
              )}
          </div>

          {/* Mobile Actions / Text */}
           <div className="sm:hidden flex items-center gap-3">
                <button
                    onClick={toggleBookmark}
                    className={`p-2 rounded-full transition-colors ${saved ? 'text-yellow-400' : 'text-gray-400'}`}
                >
                    {saved ? <FaBookmark /> : <FaRegBookmark />}
                </button>
           </div>
           
           <div className="hidden sm:flex items-center text-xs font-semibold text-gray-500 group-hover:text-white transition-colors">
              View Details <FaChevronRight className="ml-1 text-[10px]" />
           </div>
        </div>
      </div>
    </m.article>
  );
};

export default HorizontalToolCard;
