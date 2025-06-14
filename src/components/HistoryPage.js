import React, { useEffect, useState } from 'react';
import PageWrapper from './PageWrapper';

const HistoryPage = () => {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('toolClickHistory') || '[]');
    setHistory(stored);
  }, []);

  const handleClear = () => {
    localStorage.removeItem('toolClickHistory');
    setHistory([]);
  };

  return (
    <PageWrapper>
    <div className="p-4 md:p-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Tool Click History</h2>
        {history.length > 0 && (
          <button
            onClick={handleClear}
            className="bg-red-500 text-white px-3 py-1 text-sm rounded hover:bg-red-600"
          >
            Clear History
          </button>
        )}
      </div>

      {history.length ? (
        <ul className="space-y-3">
          {history.map((item, idx) => (
            <li
              key={idx}
              className="border dark:border-gray-700 p-3 rounded-md bg-white dark:bg-gray-800 flex items-center gap-3"
            >
              <i className={`${item.icon} text-lg text-blue-600`} />
              <div className="flex-1">
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline text-sm font-medium"
                >
                  {item.name}
                </a>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {new Date(item.timestamp).toLocaleString()}
                </div>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500 dark:text-gray-400">No history found.</p>
      )}
    </div>
    </PageWrapper>
  );
};

export default HistoryPage;
