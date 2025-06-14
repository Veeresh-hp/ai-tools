import React, { useRef } from 'react';
import { m, LazyMotion, domAnimation } from 'framer-motion';

const ToolCard = ({ tool, openModal }) => {
  const cardRef = useRef(null);

  const handleClick = (e) => {
    if (tool.comingSoon) return;

    const ripple = document.createElement('span');
    ripple.className = 'ripple';
    ripple.style.left = `${e.nativeEvent.offsetX}px`;
    ripple.style.top = `${e.nativeEvent.offsetY}px`;
    cardRef.current.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);

    openModal(tool);
  };

  const handleGetToolClick = (e) => {
    e.stopPropagation();
    if (!tool.url) {
      e.preventDefault();
      return;
    }

    const historyItem = {
      name: tool.name,
      url: tool.url,
      icon: tool.icon,
      timestamp: new Date().toISOString(),
    };

    const existingHistory = JSON.parse(localStorage.getItem("toolClickHistory") || "[]");
    const updatedHistory = [historyItem, ...existingHistory.slice(0, 9)];
    localStorage.setItem("toolClickHistory", JSON.stringify(updatedHistory));
  };

  return (
    <LazyMotion features={domAnimation}>
      <m.article
        ref={cardRef}
        onClick={handleClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if ((e.key === 'Enter' || e.key === ' ') && !tool.comingSoon) openModal(tool);
        }}
        aria-disabled={tool.comingSoon}
        aria-label={`${tool.name} tool card${tool.comingSoon ? ', coming soon' : ''}`}
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={!tool.comingSoon ? { scale: 1.05 } : {}}
        whileTap={!tool.comingSoon ? { scale: 0.97 } : {}}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className={`
          relative border border-gray-200 dark:border-gray-700 rounded-md p-4 flex flex-col gap-2 
          bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-shadow duration-300 
          ${!tool.comingSoon ? 'cursor-pointer hover:shadow-lg hover:shadow-blue-200 dark:hover:shadow-blue-900' : 'cursor-not-allowed'}
          overflow-hidden
        `}
      >
        {/* Coming Soon Badge */}
        {tool.comingSoon && (
          <span className="absolute top-2 right-2 text-[10px] font-semibold text-yellow-800 bg-yellow-400 px-2 py-1 rounded shadow-sm select-none">
            Coming Soon
          </span>
        )}

        {/* Ripple effect styling */}
        <style>{`
          .ripple {
            position: absolute;
            width: 80px;
            height: 80px;
            background: rgba(0, 0, 255, 0.3);
            border-radius: 9999px;
            pointer-events: none;
            transform: translate(-50%, -50%);
            animation: ripple-animation 0.6s ease-out;
            z-index: 0;
          }
          @keyframes ripple-animation {
            from { transform: translate(-50%, -50%) scale(0); opacity: 1; }
            to { transform: translate(-50%, -50%) scale(2.5); opacity: 0; }
          }
        `}</style>

        {/* Tool Icon */}
        <i className={`${tool.icon} w-6 h-6 text-gray-700 dark:text-gray-300`}></i>

        {/* Title and Badge */}
        <h3 className="font-bold text-sm flex items-center gap-2">
          {tool.name}
          {tool.badge && (
            <span
              className={`text-[10px] font-semibold border rounded px-1 py-[1px] select-none
                ${tool.badge === 'Recommended'
                  ? 'text-yellow-600 border-yellow-600'
                  : tool.badge === 'New'
                  ? 'text-green-600 border-green-600'
                  : 'text-red-600 border-red-600'
                }`}
            >
              {tool.badge}
            </span>
          )}
        </h3>

        {/* Description */}
        <p className="text-xs text-gray-500 dark:text-gray-400 leading-tight">{tool.description}</p>

        {/* Get Tool Link/Button */}
        {!tool.comingSoon ? (
          <a
            href={tool.url || '#'}
            target="_blank"
            rel="noopener noreferrer"
            className={`text-xs ${tool.url ? 'text-blue-600 hover:underline' : 'text-gray-400 cursor-not-allowed'} mt-auto`}
            onClick={handleGetToolClick}
          >
            Get Tool
          </a>
        ) : (
          <button
            disabled
            className="text-xs text-blue-600 mt-auto cursor-not-allowed"
            onClick={(e) => e.stopPropagation()}
          >
            Get Tool
          </button>
        )}
      </m.article>
    </LazyMotion>
  );
};

export default ToolCard;
