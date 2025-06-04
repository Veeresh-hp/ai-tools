import React from 'react';

const ToolCard = ({ tool, openModal }) => {
  return (
    <article className="tool-card border border-gray-200 rounded-md p-4 flex flex-col gap-2 shadow-sm bg-white">
      <i className={`${tool.icon} w-6 h-6 text-gray-700`}></i>
      <h3 className="font-bold text-sm text-gray-900 flex items-center gap-2">
        {tool.name}
        {tool.badge && (
          <span
            className={`text-[10px] font-semibold ${tool.badge === 'Recommended' ? 'text-yellow-600 border-yellow-600' : 'text-red-600 border-red-600'} border rounded px-1 py-[1px] select-none`}
          >
            {tool.badge}
          </span>
        )}
      </h3>
      <p className="text-xs text-gray-500 leading-tight">{tool.description}</p>
      {tool.comingSoon ? (
        <button
          className="text-xs text-blue-600 hover:underline get-tool"
          onClick={openModal}
        >
          Get Tool
        </button>
      ) : (
        <a
          href={tool.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-blue-600 hover:underline get-tool"
        >
          Get Tool
        </a>
      )}
    </article>
  );
};

export default ToolCard;