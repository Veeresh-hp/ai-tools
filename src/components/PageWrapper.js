import React from 'react';

const PageWrapper = ({ children, maxWidth = 'max-w-4xl', className = '' }) => {
  return (
    <main
      className={`relative pt-24 px-4 ${maxWidth} mx-auto bg-white dark:bg-gray-900 mt-0 md:mt-[-2cm] ${className}`}
    >
      {children}
    </main>
  );
};

export default PageWrapper;
