import React, { useState } from 'react';
import toolsData from '../data/toolsData';
import ToolCard from './ToolCard';

const ToolsSection = ({ openModal }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');

  const handleSearch = () => {
    setActiveFilter('all'); // Reset filter when searching
  };

  const handleFilter = (category) => {
    setActiveFilter(category);
    setSearchQuery(''); // Reset search when filtering
  };

  const filteredTools = toolsData.map(category => ({
    ...category,
    tools: category.tools.filter(tool => {
      const matchesSearch = searchQuery
        ? tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          tool.description.toLowerCase().includes(searchQuery.toLowerCase())
        : true;
      const matchesFilter = activeFilter === 'all' || category.id === activeFilter;
      return matchesSearch && matchesFilter;
    })
  })).filter(category => category.tools.length > 0);

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
    { name: 'Other Tools', id: 'other-tools' },
    { name: 'Utility Tools', id: 'utility-tools' },
  ];

  return (
    <section className="px-4 sm:px-6 md:px-10 lg:px-16 py-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <div className="flex w-full sm:w-auto">
            <input
              type="text"
              placeholder="Search tools..."
              className="w-full sm:w-64 px-4 py-2 text-sm border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyUp={(e) => e.key === 'Enter' && handleSearch()}
            />
            <button
              className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-r-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onClick={handleSearch}
            >
              Search
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {filterButtons.map(btn => (
              <button
                key={btn.id}
                className={`filter-btn px-3 py-1 text-xs font-semibold rounded-md bg-gray-200 hover:bg-gray-300 ${activeFilter === btn.id ? 'active' : ''}`}
                onClick={() => handleFilter(btn.id)}
              >
                {btn.name}
              </button>
            ))}
          </div>
        </div>
      </div>
      {filteredTools.map(category => (
        <div key={category.id} className="category-section mb-8" data-category={category.id}>
          <h2 id={category.id} className="text-xl font-bold text-gray-900 mb-4">{category.name}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 tool-grid">
            {category.tools.map(tool => (
              <ToolCard key={tool.name} tool={tool} openModal={openModal} />
            ))}
          </div>
        </div>
      ))}
    </section>
  );
};

export default ToolsSection;