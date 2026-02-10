import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { FaTimes, FaInfoCircle } from 'react-icons/fa';

const CustomToast = ({ t, title, description, timeout, shouldShowTimeoutProgress, icon }) => {
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    if (shouldShowTimeoutProgress && timeout) {
      const startTime = Date.now();
      const endTime = startTime + timeout;

      const interval = setInterval(() => {
        const now = Date.now();
        const remaining = Math.max(0, endTime - now);
        const percentage = (remaining / timeout) * 100;
        setProgress(percentage);

        if (remaining <= 0) {
          clearInterval(interval);
        }
      }, 16); // ~60fps

      return () => clearInterval(interval);
    }
  }, [shouldShowTimeoutProgress, timeout]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
      className={`${
        t.visible ? 'animate-enter' : 'animate-leave'
      } max-w-md w-full bg-[#121212]/90 backdrop-blur-xl border border-white/10 shadow-2xl rounded-2xl pointer-events-auto flex flex-col overflow-hidden ring-1 ring-white/5`}
    >
      <div className="flex-1 w-0 p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0 pt-0.5">
             {icon ? icon : <FaInfoCircle className="h-10 w-10 text-blue-500/80" />}
          </div>
          <div className="ml-3 flex-1">
            <p className="text-sm font-bold text-white mb-1">
              {title}
            </p>
            <p className="mt-1 text-sm text-gray-400 leading-relaxed">
              {description}
            </p>
          </div>
          <div className="ml-4 flex-shrink-0 flex">
            <button
              className="bg-transparent rounded-md inline-flex text-gray-400 hover:text-white focus:outline-none transition-colors"
              onClick={() => toast.dismiss(t.id)}
            >
              <span className="sr-only">Close</span>
              <FaTimes className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
      
      {shouldShowTimeoutProgress && (
        <div className="h-1 w-full bg-white/5">
          <motion.div 
            className="h-full bg-gradient-to-r from-blue-500 to-violet-500"
            style={{ width: `${progress}%` }}
            initial={{ width: '100%' }}
            animate={{ width: `${progress}%` }}
            transition={{ ease: "linear", duration: 0 }}
          />
        </div>
      )}
    </motion.div>
  );
};

export default CustomToast;
