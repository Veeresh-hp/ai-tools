import React from 'react';
import PageWrapper from './PageWrapper';

const About = () => {
  return (
      <section className="px-4 sm:px-6 md:px-12 lg:px-16 py-12 max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 text-center">
          About AI Tools Hub 😜
        </h1>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-md shadow-sm border border-gray-200 dark:border-gray-700">
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            Welcome to <span className="font-semibold">AI Tools Hub</span>, your one-stop shop for the coolest AI tools on the planet! 🚀 We’re here to make your life easier, funnier, and smarter with cutting-edge AI solutions.
          </p>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            From chatbots that sass back to image generators that turn your doodles into masterpieces, we’ve got it all. Our mission? To sprinkle a bit of AI magic into your daily grind! ✨
          </p>
          <p className="text-gray-700 dark:text-gray-300">
            Built by Veeresh H P who believe technology should be as fun as a barrel of monkeys, we’re constantly updating our hub with the latest and greatest tools. Stick around, and let’s geek out together! 🐒
          </p>
        </div>
      </section>
  );
};

export default About;
