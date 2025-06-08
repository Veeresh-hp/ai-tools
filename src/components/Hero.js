import React from 'react';

const Hero = () => {
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  const username = localStorage.getItem('username');
  const email = localStorage.getItem('userEmail');

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const formatName = (name) => {
    if (!name) return 'Guest';
    return name.charAt(0).toUpperCase() + name.slice(1);
  };

  const displayName = username || (email ? email.split('@')[0] : 'Guest');
  const getInitial = (name) => (name ? name.charAt(0).toUpperCase() : 'G');

  return (
    <section className="px-4 sm:px-6 md:px-10 lg:px-16 py-14 text-center bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <h1 className="text-5xl sm:text-6xl font-extrabold text-gray-900 dark:text-white mb-6 leading-tight">
        Welcome to <span className="text-red-600">AI Tools Hub</span>
      </h1>

      {isLoggedIn && (
        <div className="flex justify-center items-center gap-4 mb-4">
          <div className="w-10 h-10 flex items-center justify-center bg-red-600 text-white font-bold rounded-full text-lg shadow">
            {getInitial(displayName)}
          </div>
          <p className="text-xl text-gray-700 dark:text-gray-300">
            {getGreeting()},{' '}
            <span className="font-semibold">{displayName}</span>! Explore our curated AI tools below.
          </p>
        </div>
      )}

      <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-xl mx-auto">
        Discover powerful, curated AI tools to boost your productivity and creativity.
      </p>

      <a
        href="#tools"
        className="inline-block bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-xl shadow transition duration-300 transform hover:scale-105"
      >
        🚀 Explore Tools
      </a>
    </section>
  );
};

export default Hero;
