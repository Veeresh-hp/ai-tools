// ToolsSection.js
import React, { useState } from 'react';
import { motion, LayoutGroup } from 'framer-motion';
import toolsData from '../data/toolsData';
import ToolCard from './ToolCard';

const ToolsSection = ({ openModal }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');

  const handleSearch = () => setActiveFilter('all');
  const handleFilter = (category) => {
    setActiveFilter(category);
    setSearchQuery('');
  };

  const filteredTools = toolsData
    .map(category => ({
      ...category,
      tools: category.tools.filter(tool => {
        const matchesSearch = searchQuery
          ? tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            tool.description.toLowerCase().includes(searchQuery.toLowerCase())
          : true;
        const matchesFilter = activeFilter === 'all' || category.id === activeFilter;
        return matchesSearch && matchesFilter;
      })
    }))
    .filter(category => category.tools.length > 0);

  const filterButtons = [
    { name: 'All', id: 'all' },
    { name: 'Faceless Video', id: 'faceless-video' },
    { name: 'Video Generators', id: 'video-generators' },
    { name: 'Writing Tools', id: 'writing-tools' },
    { name: 'Presentation Tools', id: 'presentation-tools' },
    { name: 'Short Clippers', id: 'short-clippers' },
    { name: 'Marketing Tools', id: 'marketing-tools' },
    { name: 'Voice Tools', id: 'voice-tools' },
    { name: 'Website Builders', id: 'website-builders' },
    { name: 'Image Generators', id: 'image-generators' },
    { name: 'Chatbots', id: 'chatbots' },
    { name: 'AI Music Generators', id: 'music-generators' },
    { name: 'AI Data Analysis Tools', id: 'data-analysis' },
    { name: 'AI Gaming Tools', id: 'gaming-tools' },
    { name: 'UML, ER, Use Case Diagrams', id: 'ai-diagrams' },
    { name: 'Other Tools', id: 'other-tools' },
    { name: 'Utility Tools', id: 'utility-tools' },
  ];

  return (
    <section className="px-4 sm:px-6 md:px-10 lg:px-16 py-8 max-w-7xl mx-auto bg-white dark:bg-gray-900 transition-colors duration-300">
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <div className="flex w-full sm:w-auto">
            <input
              type="text"
              placeholder="Search tools..."
              className="w-full sm:w-64 px-4 py-2 text-sm border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-black dark:text-white rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyUp={(e) => e.key === 'Enter' && handleSearch()}
              aria-label="Search tools"
            />
            <button
              className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-r-md hover:bg-blue-700 cursor-pointer"
              onClick={handleSearch}
              aria-label="Search button"
            >
              Search
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {filterButtons.map(btn => (
              <button
                key={btn.id}
                className={`filter-btn px-3 py-1 text-xs font-semibold rounded-md cursor-pointer
                  ${activeFilter === btn.id
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 dark:bg-gray-800 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-700'}`}
                onClick={() => handleFilter(btn.id)}
                aria-pressed={activeFilter === btn.id}
              >
                {btn.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {filteredTools.length === 0 && (
        <div className="text-center text-gray-500 dark:text-gray-400 py-10 text-sm">
          No tools found matching your search.
        </div>
      )}

      <LayoutGroup>
        {filteredTools.map(category => (
          <motion.div
            key={category.id}
            layout
            className="category-section mb-8"
            data-category={category.id}
          >
            <h2 className={`text-xl font-bold mb-4 flex items-center gap-2 text-${getCategoryColor(category.id)}`}>
              <i className={`fas ${getCategoryIcon(category.id)} text-${getCategoryColor(category.id)}`}></i>
              {category.name}
            </h2>
            <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {category.tools.map(tool => (
                <motion.div
                  key={tool.name}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="cursor-pointer"
                >
                  <ToolCard tool={tool} openModal={openModal} />
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        ))}
      </LayoutGroup>
    </section>
  );
};

const getCategoryIcon = (categoryId) => {
  const iconMap = {
    chatbots: 'fa-robot',
    'image-generators': 'fa-image',
    'music-generators': 'fa-music',
    'data-analysis': 'fa-chart-bar',
    'ai-diagrams': 'fa-project-diagram',
    'writing-tools': 'fa-pen',
    'video-generators': 'fa-video',
    'utility-tools': 'fa-tools',
    'marketing-tools': 'fa-bullhorn',
    'voice-tools': 'fa-microphone',
    'presentation-tools': 'fa-chalkboard',
    'website-builders': 'fa-globe',
    'gaming-tools': 'fa-gamepad',
    'short-clippers': 'fa-cut',
    'faceless-video': 'fa-user-secret',
  };
  return iconMap[categoryId] || 'fa-box';
};

const getCategoryColor = (categoryId) => {
  const colorMap = {
    chatbots: 'purple-600',
    'image-generators': 'pink-600',
    'music-generators': 'green-600',
    'data-analysis': 'teal-600',
    'ai-diagrams': 'indigo-600',
    'writing-tools': 'blue-600',
    'video-generators': 'red-600',
    'utility-tools': 'gray-700',
    'marketing-tools': 'orange-500',
    'voice-tools': 'yellow-500',
    'presentation-tools': 'cyan-600',
    'website-builders': 'emerald-600',
    'gaming-tools': 'fuchsia-600',
    'short-clippers': 'rose-500',
    'faceless-video': 'zinc-600',
  };
  return colorMap[categoryId] || 'gray-500';
};

export default ToolsSection;
