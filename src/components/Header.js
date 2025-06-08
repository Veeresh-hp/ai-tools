import React, { useState, useEffect, useRef, useContext } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { ThemeContext } from '../contexts/ThemeContext';
import './Header.css';

const Header = () => {
  const { isDarkMode, toggleDarkMode } = useContext(ThemeContext);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(() => localStorage.getItem('isLoggedIn') === 'true');
  const [showBackToTop, setShowBackToTop] = useState(false);
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);
  const closeTimeoutRef = useRef(null);
  const history = useHistory();

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const openDropdown = () => {
    if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
    setIsDropdownOpen(true);
  };

  const closeDropdownWithDelay = () => {
    closeTimeoutRef.current = setTimeout(() => {
      setIsDropdownOpen(false);
    }, 300);
  };

  const cancelCloseDropdown = () => {
    if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
  };

  useEffect(() => {
    if (!isDropdownOpen) return;
    const handleClickOutside = (e) => {
      if (
        dropdownRef.current &&
        buttonRef.current &&
        !dropdownRef.current.contains(e.target) &&
        !buttonRef.current.contains(e.target)
      ) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isDropdownOpen]);

  const handleLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    window.location.reload();
  };

  const categories = [
    { name: '🎬 Faceless AI Video', id: 'faceless-video' },
    { name: '📹 AI Video Generators', id: 'video-generators' },
    { name: '✍️ AI Writing Tools', id: 'writing-tools' },
    { name: '📊 AI Presentation Tools', id: 'presentation-tools' },
    { name: '✂️ AI Short Clippers', id: 'short-clippers' },
    { name: '📈 AI Marketing Tools', id: 'marketing-tools' },
    { name: '🎤 AI Voice/Audio Tools', id: 'voice-tools' },
    { name: '🌐 AI Website Builders', id: 'website-builders' },
    { name: '🖼️ AI Image Generators', id: 'image-generators' },
    { name: '🤖 ChatGPT Alternatives', id: 'chatbots' },
    { name: '🎵 AI Music Generators', id: 'music-generators' },
    { name: '🧠 AI Data Analysis Tools', id: 'data-analysis' },
    { name: '📐 UML, ER, Use Case Diagrams', id: 'ai-diagrams' },
    { name: '🎮 AI Gaming Tools', id: 'gaming-tools' },
    { name: '🧪 Other AI Tools', id: 'other-tools' },
    { name: '🛠️ Utility Tools', id: 'utility-tools' },
  ];

  const handleCategoryClick = (id) => {
    if (history.location.pathname !== '/') {
      history.push('/');
      setTimeout(() => scrollToSection(id), 100);
    } else {
      scrollToSection(id);
    }
    setIsDropdownOpen(false);
    setIsMobileMenuOpen(false);
  };

  const scrollToSection = (id) => {
    const element = document.querySelector(`[data-category="${id}"]`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleBackToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div>
      <header className="fixed top-0 left-0 w-full border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-700 z-50">
        <nav className="flex items-center justify-between px-4 sm:px-6 md:px-10 lg:px-5 h-16">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center text-xl font-extrabold text-red-600 dark:text-red-400 hover:scale-105 transition-all duration-200"
            onClick={() => window.scrollTo({ top: 0 })}
          >
            <i className="fas fa-bolt mr-2"></i> AI Tools Hub
          </Link>

          {/* Desktop Nav */}
          <ul className="hidden sm:flex items-center space-x-4 text-sm">
            {[
              ['chatbots', '🤖', 'CHATBOTS'],
              ['image-generators', '🖼️', 'IMAGE GENERATORS'],
              ['music-generators', '🎵', 'MUSIC TOOLS'],
              ['data-analysis', '📊', 'DATA TOOLS'],
              ['ai-diagrams', '📐', 'AI DIAGRAMS'],
              ['writing-tools', '✍️', 'TEXT TOOLS'],
              ['video-generators', '📹', 'VIDEO TOOLS'],
            ].map(([id, emoji, label]) => (
              <li key={id}>
                <button
                  onClick={() => handleCategoryClick(id)}
                  className="flex items-center hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
                  title={`${label}`}
                >
                  <span className="mr-1">{emoji}</span> {label}
                </button>
              </li>
            ))}
            <li><Link to="/about" className="hover:text-blue-600 dark:hover:text-blue-400">ABOUT</Link></li>
            <li><Link to="/contact" className="hover:text-blue-600 dark:hover:text-blue-400">CONTACT</Link></li>
            {/* Dropdown */}
            <li className="relative" ref={dropdownRef}>
              <button
                ref={buttonRef}
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                onMouseEnter={cancelCloseDropdown}
                onMouseLeave={closeDropdownWithDelay}
                className="flex items-center gap-1 hover:text-blue-600 dark:hover:text-blue-400"
              >
                <i className="fas fa-tools mr-1"></i> ALL TOOLS
                <i className="fas fa-caret-down text-[10px]"></i>
              </button>
              {isDropdownOpen && (
                <ul
                  className="absolute right-0 bg-white dark:bg-gray-800 shadow-lg rounded-md mt-2 py-2 w-48 z-50 text-xs"
                  onMouseEnter={cancelCloseDropdown}
                  onMouseLeave={closeDropdownWithDelay}
                >
                  {categories.map((category) => (
                    <li key={category.id}>
                      <button
                        onClick={() => handleCategoryClick(category.id)}
                        className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left text-gray-800 dark:text-white"
                      >
                        {category.name}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          </ul>

          {/* Right Options */}
          <div className="hidden sm:flex items-center space-x-4 text-xs font-normal">
            <button
              onClick={toggleDarkMode}
              className="text-yellow-400 dark:text-gray-200 hover:scale-110 transition-transform duration-200"
              title="Toggle Dark Mode"
            >
              <i className={`fas ${isDarkMode ? 'fa-moon' : 'fa-sun'}`}></i>
            </button>
            {!isLoggedIn ? (
              <>
                <Link to="/login" className="hover:text-blue-600 dark:hover:text-blue-400">
                  <i className="fas fa-sign-in-alt mr-1"></i> Login
                </Link>
                <Link to="/signup" className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md flex items-center">
                  <i className="fas fa-user-plus mr-1"></i> Sign up
                </Link>
              </>
            ) : (
              <button onClick={handleLogout} className="hover:text-blue-600 dark:hover:text-blue-400">
                <i className="fas fa-sign-out-alt mr-1"></i> Logout
              </button>
            )}
          </div>

          {/* Mobile menu toggle */}
          <div className="sm:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="hover:text-blue-600 dark:hover:text-blue-400"
            >
              <i className={`fas ${isMobileMenuOpen ? 'fa-times' : 'fa-bars'} text-xl`}></i>
            </button>
          </div>
        </nav>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="sm:hidden px-4 py-4 text-sm bg-white dark:bg-gray-800 space-y-3 animate-slide-in">
            {categories.slice(0, 7).map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleCategoryClick(cat.id)}
                className="block hover:text-blue-600 dark:hover:text-blue-400"
              >
                {cat.name}
              </button>
            ))}
            <Link to="/about" onClick={() => setIsMobileMenuOpen(false)} className="block hover:text-blue-600 dark:hover:text-blue-400">
              About
            </Link>
            <Link to="/contact" onClick={() => setIsMobileMenuOpen(false)} className="block hover:text-blue-600 dark:hover:text-blue-400">
              Contact
            </Link>
            <details className="group">
              <summary className="cursor-pointer flex items-center gap-1 select-none">
                <i className="fas fa-tools mr-1"></i> All Tools
              </summary>
              <ul className="ml-4 mt-2 space-y-1">
                {categories.map((cat) => (
                  <li key={cat.id}>
                    <button
                      onClick={() => handleCategoryClick(cat.id)}
                      className="block hover:text-blue-600 dark:hover:text-blue-400 w-full text-left"
                    >
                      {cat.name}
                    </button>
                  </li>
                ))}
              </ul>
            </details>

            <div className="pt-2 border-t border-gray-300 dark:border-gray-600 flex items-center justify-between">
              <button
                onClick={toggleDarkMode}
                className="text-yellow-400 dark:text-gray-200 hover:scale-110 transition-transform duration-200"
              >
                <i className={`fas ${isDarkMode ? 'fa-moon' : 'fa-sun'}`}></i> Mode
              </button>
              {!isLoggedIn ? (
                <div className="flex gap-4">
                  <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-blue-600 dark:hover:text-blue-400">Login</Link>
                  <Link to="/signup" onClick={() => setIsMobileMenuOpen(false)} className="text-red-600 hover:text-red-700">Sign up</Link>
                </div>
              ) : (
                <button onClick={handleLogout} className="hover:text-blue-600 dark:hover:text-blue-400">Logout</button>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Back to Top */}
      {showBackToTop && (
        <button
          onClick={handleBackToTop}
          className="fixed bottom-6 right-6 bg-red-600 text-white p-3 rounded-full shadow-lg hover:bg-red-700 transition-all duration-200 hover:scale-110 animate-bounce z-50"
          title="Back to Top 🚀"
        >
          <i className="fas fa-rocket text-lg"></i>
        </button>
      )}
    </div>
  );
};

export default Header;
