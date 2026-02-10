import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { m } from 'framer-motion';
import { FaDice } from 'react-icons/fa';

const SurpriseMeButton = ({ tools, className = '', compact = false, responsive = false }) => {
    const history = useHistory();
    const [isSpinning, setIsSpinning] = useState(false);

    const handleSurprise = () => {
        if (!tools || tools.length === 0) return;

        setIsSpinning(true);

        // Add a small delay for the "spinning" effect/anticipation
        setTimeout(() => {
            const randomTool = tools[Math.floor(Math.random() * tools.length)];
            
            if (randomTool && randomTool.name) {
                const toolSlug = randomTool.name.toLowerCase()
                    .replace(/[^a-z0-9\s-]/g, '')
                    .replace(/\s+/g, '-')
                    .replace(/-+/g, '-');
                const categorySlug = randomTool.category || 'all';
                
                history.push(`/tools/${categorySlug}/${toolSlug}`);
            }
            setIsSpinning(false);
        }, 600);
    };

    // Calculate dynamic classes based on responsive prop
    const paddingClass = responsive 
        ? 'p-2 w-10 h-10 md:w-auto md:h-auto md:px-5 md:py-2.5' 
        : compact ? 'p-2 w-10 h-10' : 'px-5 py-2.5';
        
    const iconSizeClass = responsive
        ? 'text-xl md:text-lg'
        : compact ? "text-xl" : "text-lg";

    return (
        <m.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSurprise}
            disabled={isSpinning}
            className={`
                relative group overflow-hidden
                flex items-center justify-center gap-2 
                ${paddingClass}
                bg-gradient-to-r from-violet-600 to-indigo-600 
                hover:from-violet-500 hover:to-indigo-500
                text-white font-bold rounded-xl shadow-lg shadow-indigo-500/20 
                border border-white/10 transition-all
                ${className}
            `}
        >
            {/* Shimmer Effect */}
            <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent z-0" />

            {/* Icon with spin animation */}
            <m.div
                animate={isSpinning ? { rotate: 360 } : { rotate: 0 }}
                transition={{ duration: 0.5, ease: "easeInOut", loop: isSpinning ? Infinity : 0 }}
                className="relative z-10"
            >
                <FaDice className={iconSizeClass} />
            </m.div>

            {(!compact || responsive) && (
                <span className={`relative z-10 ${responsive ? 'hidden md:inline' : ''}`}>
                    Surprise Me
                </span>
            )}
        </m.button>
    );
};

export default SurpriseMeButton;
