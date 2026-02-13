import React, { useState } from 'react';
import { motion as m } from 'framer-motion';
import Favorites from './Favorites';
import StackList from './StackList';
import SavedBackground from '../assets/Saved-1.png'; // Reusing the background

const Library = () => {
  const [activeTab, setActiveTab] = useState('favorites'); // 'favorites' | 'stacks'

  return (
    <div className="min-h-screen text-white relative overflow-hidden pb-24">
      {/* Global background - shared for consistency */}
      <div className="fixed inset-0 z-0">
         <img 
           src={SavedBackground} 
           alt="Background" 
           className="absolute inset-0 w-full h-full object-cover opacity-60 pointer-events-none"
         />
         <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-black/80 pointer-events-none" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-6">
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center border border-white/10">
                    <span className="text-2xl">📚</span>
                </div>
                <div>
                     <h1 className="text-3xl font-bold text-white tracking-tight">Library</h1>
                     <p className="text-gray-400 text-sm">Your personal collection of tools and stacks</p>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 bg-[#0A0A0A] border border-white/10 p-1 rounded-xl">
                <button
                    onClick={() => setActiveTab('favorites')}
                    className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'favorites' ? 'bg-[#FF6B00] text-white shadow-lg' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                >
                    Saved Tools
                </button>
                <button
                    onClick={() => setActiveTab('stacks')}
                    className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'stacks' ? 'bg-[#FF6B00] text-white shadow-lg' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                >
                    My Stacks
                </button>
            </div>
        </div>

        {/* Content Area */}
        <m.div 
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="min-h-[500px]"
        >
            {activeTab === 'favorites' ? (
                <Favorites embedded={true} />
            ) : (
                <StackList embedded={true} />
            )}
        </m.div>

      </div>
    </div>
  );
};

export default Library;
