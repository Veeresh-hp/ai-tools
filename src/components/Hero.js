import React from 'react';

const Hero = () => {
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  const userEmail = localStorage.getItem('userEmail');

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <section className="px-4 sm:px-6 md:px-10 lg:px-16 py-14 text-center bg-gray-50">
      <h1 className="text-5xl sm:text-6xl font-extrabold text-gray-900 mb-6 leading-tight">
        Welcome to <span className="text-red-600">AI Tools Hub</span>
      </h1>

      {isLoggedIn && (
        <p className="text-xl text-gray-700 mb-4">
          {getGreeting()},{' '}
          <span className="font-semibold">
            {userEmail || 'Guest'}
          </span>
          ! Explore our curated AI tools below.
        </p>
      )}

      <p className="text-lg text-gray-600 mb-8 max-w-xl mx-auto">
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
