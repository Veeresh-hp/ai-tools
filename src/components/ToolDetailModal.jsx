import React, { useEffect, useState, useCallback } from 'react';
import ReactDOM from 'react-dom';
import { 
  FaExternalLinkAlt, FaBookmark, FaRegBookmark, FaTimes, FaStar, 
  FaDollarSign, FaUsers, FaCopy, FaCheck, FaInfoCircle, FaCalendarAlt 
} from 'react-icons/fa';
import { addRefToUrl, getVideoId } from '../utils/linkUtils';

import { motion as m, AnimatePresence } from 'framer-motion';

const ToolDetailModal = ({ tool, onClose }) => {
  const getToolKey = useCallback(() => (tool && (tool.url || tool.name || tool.id)) || null, [tool]);
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!tool) return;
    try {
      const raw = localStorage.getItem('ai_bookmarks');
      const arr = raw ? JSON.parse(raw) : [];
      const key = getToolKey();
      setSaved(arr.includes(key));
    } catch (err) {
      // ignore
    }
  }, [tool, getToolKey]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose && onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (tool) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [tool]);

  // Reset scroll position when tool changes
  const modalRef = React.useRef(null);
  useEffect(() => {
    if (tool && modalRef.current) {
      modalRef.current.scrollTop = 0;
    }
  }, [tool]);

  const toggleBookmark = (e) => {
    e && e.stopPropagation();
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

  const copyToClipboard = () => {
    if (tool.url || tool.link) {
      navigator.clipboard.writeText(tool.url || tool.link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  console.log('🎯 ToolDetailModal rendering, tool:', tool);

  if (!tool) {
    console.log('⚠️ Tool is null, not rendering modal');
    return null;
  }

  console.log('✅ Rendering modal for tool:', tool.name);

  // Extract or generate metadata
  const pricing = tool.pricing || 'Free';
  const categoryLabel = typeof tool.category === 'string' 
    ? tool.category.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
    : tool.category?.name || 'General';
    
  // prioritize submitted hashtags
  const tags = tool.hashtags || tool.tags || []; 
  const shortDesc = tool.shortDescription || tool.short_description || ''; 
  
  // Only show strict data from the tool object, no defaults
  const rating = tool.rating;
  const users = tool.users;
  const relatedTools = tool.relatedTools || []; // Only real related tools

  return ReactDOM.createPortal(
    <AnimatePresence>
      <m.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 flex items-center justify-center px-4 bg-black/90 backdrop-blur-md overflow-y-auto py-8 scrollbar-hide"
        style={{ zIndex: 99999 }}
        onClick={onClose}
      >
        <div className="relative max-w-5xl w-full">
          {/* Glow effect - Orange/Red for theme match */}
          <div className="absolute -inset-1 bg-gradient-to-r from-orange-600/30 via-red-600/30 to-yellow-600/30 rounded-3xl blur-xl opacity-30" />

          {/* Modal content */}
          <m.div
            ref={modalRef}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
            className="relative bg-[#050505] rounded-3xl shadow-2xl border border-white/10 overflow-hidden max-h-[90vh] overflow-y-auto scrollbar-hide flex flex-col"
            role="dialog"
            aria-modal="true"
          >
           
          {/* --- HERO SECTION --- */}
          <div className="relative w-full bg-[#0a0a0a] border-b border-white/5 p-8 lg:p-12 overflow-hidden shrink-0">
             {/* Dynamic Background Gradient */}
             <div className="absolute inset-0 bg-gradient-to-br from-purple-900/10 via-black to-black z-0" />
             <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none z-0" />

             {/* Close Button & Bookmark - Top Positioned */}
             <div className="absolute top-6 right-6 z-20 flex items-center gap-3">
                 <button
                   onClick={toggleBookmark}
                   className={`p-3 rounded-full backdrop-blur-md transition-all border border-white/10 ${saved
                       ? 'bg-yellow-500 text-black shadow-lg shadow-yellow-500/20'
                       : 'bg-white/5 text-white hover:bg-white/10'
                     }`}
                 >
                   {saved ? <FaBookmark size={16} /> : <FaRegBookmark size={16} />}
                 </button>
                 <button
                   onClick={onClose}
                   className="p-3 rounded-full bg-white/5 hover:bg-white/10 text-white border border-white/10 transition-colors"
                 >
                   <FaTimes size={16} />
                 </button>
             </div>

             <div className="relative z-10 flex flex-col lg:flex-row items-center lg:items-end justify-between gap-8">
                {/* Left: Branding & Title */}
                <div className="flex-1 space-y-4">
                   <div className="text-xs font-bold tracking-[0.2em] text-gray-500 uppercase">
                      {categoryLabel}
                   </div>
                   
                   <h2 className="text-5xl lg:text-6xl font-black text-white leading-tight tracking-tight">
                      {tool.name}
                   </h2>

                   {shortDesc && (
                   <p className="text-xl text-gray-400 font-medium max-w-xl leading-relaxed">
                      {shortDesc}
                   </p>
                   )}

                   <div className="flex flex-wrap gap-2 pt-2">
                      {tool.badge && (
                          <span className="px-3 py-1 bg-white/10 border border-white/10 rounded-lg text-white text-xs font-bold uppercase tracking-wider">
                              {tool.badge}
                          </span>
                      )}
                      {tool.pricing && (
                         <span className="px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-lg text-green-400 text-xs font-bold uppercase tracking-wider">
                            {tool.pricing}
                         </span>
                      )}
                   </div>
                   
                   {/* Primary CTA in Hero */}
                    <div className="pt-6 flex flex-wrap gap-4">
                        <a
                           href={addRefToUrl(tool.url || tool.link)}
                           target="_blank"
                           rel="noopener noreferrer"
                           className="px-8 py-3 bg-white text-black font-bold rounded-full hover:bg-gray-200 transition-colors flex items-center gap-2"
                        >
                            Open Tool <FaExternalLinkAlt size={12} />
                        </a>
                        <button 
                            onClick={copyToClipboard}
                            className="px-6 py-3 bg-white/5 border border-white/10 hover:bg-white/10 text-white font-semibold rounded-full transition-colors flex items-center gap-2"
                        >
                            {copied ? <FaCheck className="text-green-400"/> : <FaCopy />}
                            {copied ? 'Copied' : 'Copy URL'}
                        </button>
                    </div>
                </div>

                {/* Right: Visual Preview */}
                <div className="w-full lg:w-[450px] aspect-video rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-[#050505] relative group">
                    {tool.image || tool.snapshotUrl ? (
                      <img
                        src={tool.image || tool.snapshotUrl}
                        alt={tool.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.parentElement.innerHTML = `<div class="w-full h-full flex items-center justify-center bg-white/5"><span class="text-6xl">🚀</span></div>`;
                        }}
                      />
                    ) : (
                       <div className="w-full h-full flex items-center justify-center bg-white/5">
                           <span className="text-6xl">🚀</span>
                       </div>
                    )}
                    {/* Play button overlay hint if it looks like video */}

                </div>
             </div>
          </div>

          {/* --- CONTENT GRID --- */}
          <div className="flex-1 bg-[#050505] p-6 lg:p-10">
             <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-full">
                
                {/* LEFT COL: About & Details */}
                <div className="lg:col-span-2 space-y-10">
                    {tool.videoUrl && getVideoId(tool.videoUrl) && (
                        <div className="rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-black mb-10">
                            <div className="relative w-full aspect-video">
                                <iframe 
                                    src={`https://www.youtube.com/embed/${getVideoId(tool.videoUrl)}`}
                                    title={`${tool.name} Video Demo`}
                                    className="absolute inset-0 w-full h-full"
                                    frameBorder="0" 
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                    allowFullScreen
                                ></iframe>
                            </div>
                        </div>
                    )}

                    <div className="space-y-4">
                        <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                           <span className="w-1.5 h-8 bg-blue-500 rounded-full"/> 
                           About {tool.name}
                        </h3>
                        {tool.description && (
                        <div className="text-gray-300 leading-8 text-lg font-light">
                            {tool.description}
                        </div>
                        )}
                        {!tool.description && !shortDesc && (
                            <div className="text-gray-500 italic">No description provided.</div>
                        )}
                    </div>

                    {/* Features Grid */}
                    {tool.features && tool.features.length > 0 && (
                        <div>
                             <h4 className="text-lg font-bold text-white mb-6">Key Capabilities</h4>
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {tool.features.map((feature, idx) => (
                                    <div key={idx} className="p-4 rounded-xl bg-white/5 border border-white/5 flex items-start gap-3">
                                        <div className="mt-1 w-5 h-5 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400 shrink-0">
                                            <FaCheck size={10} />
                                        </div>
                                        <span className="text-gray-300 text-sm leading-relaxed">{feature}</span>
                                    </div>
                                ))}
                             </div>
                        </div>
                    )}
                    
                    {/* Tags */}
                    {tags && tags.length > 0 && (
                        <div>
                             <h4 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-4">Tags</h4>
                             <div className="flex flex-wrap gap-2">
                                {tags.map((tag, i) => (
                                  <span key={i} className="px-4 py-1.5 rounded-full border border-white/10 text-gray-400 text-sm hover:text-white hover:border-white/20 transition-colors cursor-default">
                                    #{tag.toString().replace(/^#/, '')}
                                  </span>
                                ))}
                             </div>
                        </div>
                    )}
                </div>

                {/* RIGHT COL: Sidebar */}
                <div className="space-y-6">
                    
                    {/* Quick Info Card */}
                    <div className="rounded-2xl bg-[#0a0a0a] border border-white/10 p-6 space-y-6">
                        <h4 className="text-lg font-bold text-white">Quick Info</h4>
                        
                        <div className="space-y-5">
                            <div className="flex items-center justify-between">
                                <span className="flex items-center gap-2 text-gray-400 text-sm font-medium">
                                    <FaDollarSign size={14} className="text-gray-500" /> Pricing
                                </span>
                                <span className={`px-2.5 py-1 rounded-lg text-xs font-bold uppercase ${
                                    pricing.toLowerCase().includes('free') ? 'bg-green-500/10 text-green-400' : 'bg-blue-500/10 text-blue-400'
                                }`}>
                                    {pricing}
                                </span>
                            </div>

                            {tool.status && (
                                <div className="flex items-center justify-between">
                                    <span className="flex items-center gap-2 text-gray-400 text-sm font-medium">
                                        <FaInfoCircle size={14} className="text-gray-500" /> Status
                                    </span>
                                    <span className={`px-2.5 py-1 rounded-lg text-xs font-bold uppercase ${
                                        tool.status === 'approved' ? 'bg-green-500/10 text-green-400' :
                                        tool.status === 'rejected' ? 'bg-red-500/10 text-red-400' :
                                        'bg-yellow-500/10 text-yellow-400'
                                    }`}>
                                        {tool.status}
                                    </span>
                                </div>
                            )}

                            {tool.createdAt && (
                                <div className="flex items-center justify-between">
                                    <span className="flex items-center gap-2 text-gray-400 text-sm font-medium">
                                        <FaCalendarAlt size={14} className="text-gray-500" /> Submitted
                                    </span>
                                    <div className="text-right">
                                        <div className="text-white text-sm font-bold">
                                            {new Date(tool.createdAt).toLocaleDateString()}
                                        </div>
                                        <div className="text-gray-500 text-xs">
                                            {new Date(tool.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {tool.approvedAt && tool.status === 'approved' && (
                                <div className="flex items-center justify-between">
                                    <span className="flex items-center gap-2 text-gray-400 text-sm font-medium">
                                        <FaCheck size={14} className="text-gray-500" /> Approved
                                    </span>
                                    <div className="text-right">
                                        <div className="text-white text-sm font-bold">
                                            {new Date(tool.approvedAt).toLocaleDateString()}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {rating && (
                                <div className="flex items-center justify-between">
                                    <span className="flex items-center gap-2 text-gray-400 text-sm font-medium">
                                        <FaStar size={14} className="text-gray-500" /> Rating
                                    </span>
                                    <span className="text-yellow-500 text-sm font-bold flex items-center gap-1">
                                        {rating} <FaStar size={12}/>
                                    </span>
                                </div>
                            )}

                            {users && (
                                <div className="flex items-center justify-between">
                                    <span className="flex items-center gap-2 text-gray-400 text-sm font-medium">
                                        <FaUsers size={14} className="text-gray-500" /> Users
                                    </span>
                                    <span className="text-white text-sm font-bold">
                                        {users}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Related Tools Card */}
                    {relatedTools && relatedTools.length > 0 && (
                        <div className="rounded-2xl bg-[#0a0a0a] border border-white/10 p-6">
                            <h4 className="text-lg font-bold text-white mb-4">Related Tools</h4>
                            <div className="space-y-3">
                                {relatedTools.map((relTool) => (
                                    <div key={relTool.id || relTool._id} className="group flex items-center gap-3 p-2 -mx-2 rounded-xl hover:bg-white/5 transition-colors cursor-pointer">
                                        <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/5 flex items-center justify-center text-xs text-gray-500">
                                            {relTool.image ? <img src={relTool.image} alt={relTool.name} className="w-full h-full object-cover rounded-lg"/> : "AI"}
                                        </div>
                                        <div>
                                            <div className="text-sm font-bold text-gray-300 group-hover:text-white transition-colors">{relTool.name}</div>
                                            <div className="text-xs text-gray-600">{relTool.category}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                </div>
             </div>
          </div>

          </m.div>
        </div>
      </m.div>
    </AnimatePresence>,
    document.body
  );
};

export default ToolDetailModal;
