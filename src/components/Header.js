import React, { useState, useEffect, useRef, useContext } from 'react';
import { Link, useHistory, useLocation } from 'react-router-dom';
import { ThemeContext } from '../contexts/ThemeContext';
import './Header.css';
import PageWrapper from './PageWrapper';

const Header = () => {
  const { isDarkMode, toggleDarkMode } = useContext(ThemeContext);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isAccountDropdownOpen, setIsAccountDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(() => localStorage.getItem('isLoggedIn') === 'true');
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);
  const accountRef = useRef(null);
  const accountButtonRef = useRef(null);
  const mobileMenuRef = useRef(null);

  const closeTimeoutRef = useRef(null);
  const accountCloseTimeoutRef = useRef(null);
  const history = useHistory();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setShowBackToTop(window.scrollY > 300);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        dropdownRef.current && buttonRef.current &&
        !dropdownRef.current.contains(e.target) &&
        !buttonRef.current.contains(e.target)
      ) setIsDropdownOpen(false);

      if (
        accountRef.current && accountButtonRef.current &&
        !accountRef.current.contains(e.target) &&
        !accountButtonRef.current.contains(e.target)
      ) setIsAccountDropdownOpen(false);

      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(e.target)
      ) setIsMobileMenuOpen(false);
    };

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setIsMobileMenuOpen(false);
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const addToHistory = (label, link) => {
    const historyData = JSON.parse(localStorage.getItem('clickHistory')) || [];
    const timestamp = new Date().toISOString();
    const newEntry = { label, link, timestamp };
    const updated = [newEntry, ...historyData.filter(item => item.link !== link)].slice(0, 10);
    localStorage.setItem('clickHistory', JSON.stringify(updated));
  };

  const handleLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    window.location.reload();
  };

  const openDropdown = () => {
    clearTimeout(closeTimeoutRef.current);
    setIsDropdownOpen(true);
  };
  const closeDropdownWithDelay = () => {
    closeTimeoutRef.current = setTimeout(() => setIsDropdownOpen(false), 300);
  };
  const cancelCloseDropdown = () => clearTimeout(closeTimeoutRef.current);

  const openAccountDropdown = () => {
    clearTimeout(accountCloseTimeoutRef.current);
    setIsAccountDropdownOpen(true);
  };
  const closeAccountDropdownWithDelay = () => {
    accountCloseTimeoutRef.current = setTimeout(() => setIsAccountDropdownOpen(false), 300);
  };
  const cancelCloseAccountDropdown = () => clearTimeout(accountCloseTimeoutRef.current);

  const categories = [
    { name: 'Faceless AI Video', id: 'faceless-video' },
    { name: 'AI Video Generators', id: 'video-generators' },
    { name: 'AI Writing Tools', id: 'writing-tools' },
    { name: 'AI Presentation Tools', id: 'presentation-tools' },
    { name: 'AI Short Clippers', id: 'short-clippers' },
    { name: 'AI Marketing Tools', id: 'marketing-tools' },
    { name: 'AI Voice Tools', id: 'voice-tools' },
    { name: 'AI Website Builders', id: 'website-builders' },
    { name: 'AI Image Generators', id: 'image-generators' },
    { name: 'ChatGPT Alternatives', id: 'chatbots' },
    { name: 'AI Music Tools', id: 'music-generators' },
    { name: 'AI Data Tools', id: 'data-analysis' },
    { name: 'AI Diagrams', id: 'ai-diagrams' },
    { name: 'AI Gaming Tools', id: 'gaming-tools' },
    { name: 'Other AI Tools', id: 'other-tools' },
    { name: 'Utility Tools', id: 'utility-tools' },
  ];

  const handleCategoryClick = (id) => {
    addToHistory(`Category: ${id}`, `#${id}`);
    if (location.pathname !== '/') {
      history.push('/');
      setTimeout(() => scrollToSection(id), 100);
    } else {
      scrollToSection(id);
    }
    setIsDropdownOpen(false);
    setIsMobileMenuOpen(false);
  };

  const scrollToSection = (id) => {
    const el = document.querySelector(`[data-category="${id}"]`);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const handleBackToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <PageWrapper>
      <style>
        {`
          .spin-on-hover {
            display: inline-block;
            transition: transform 0.4s ease;
          }
          .spin-on-hover:hover {
            transform: rotate(360deg);
          }
        `}
      </style>
      <header className="fixed top-0 left-0 w-full backdrop-blur-md border-b border-gray-200 dark:border-gray-700 bg-white/90 dark:bg-gray-800/90 z-50">
        <nav className="flex items-center justify-between px-4 sm:px-6 md:px-10 lg:px-5 h-16">
          <Link to="/" className="flex items-center text-xl font-extrabold text-red-600 dark:text-red-400 hover:scale-105 transition-all duration-200" onClick={() => {
            window.scrollTo({ top: 0 });
            addToHistory('Home', '/');
          }}>
            <i className="fas fa-bolt mr-2 spin-on-hover"></i> AI Tools Hub
          </Link>

          {/* Mobile Hamburger */}
          <div className="sm:hidden">
            <button 
              onClick={() => {
                setIsMobileMenuOpen(!isMobileMenuOpen);
                setIsDropdownOpen(false); // Close dropdown when toggling mobile menu
              }} 
              className="hover:text-blue-600 dark:hover:text-blue-400"
            >
              <i className={`fas ${isMobileMenuOpen ? 'fa-times' : 'fa-bars'} text-xl spin-on-hover`}></i>
            </button>
          </div>

          {/* Desktop Nav */}
          <ul className="hidden sm:flex items-center space-x-6 text-sm font-semibold">
            {[['/', '🏠', 'Home'], ['#chatbots', '🤖', 'Chatbots'], ['#image-generators', '🖼️', 'Images'], ['#music-generators', '🎵', 'Music'], ['#data-analysis', '📊', 'Data'], ['#ai-diagrams', '📈', 'Diagrams'], ['#writing-tools', '✍️', 'Text'], ['#video-generators', '🎬', 'Video']].map(([link, icon, label]) => (
              <li key={link}>
                {link.startsWith('#') ? (
                  <button onClick={() => handleCategoryClick(link.slice(1))} className="nav-item hover:text-blue-600 dark:hover:text-blue-400">
                    <span className="spin-on-hover inline-block">{icon}</span> {label}
                  </button>
                ) : (
                  <Link to={link} onClick={() => addToHistory(label, link)} className="nav-item hover:text-blue-600 dark:hover:text-blue-400">
                    <span className="spin-on-hover inline-block">{icon}</span> {label}
                  </Link>
                )}
              </li>
            ))}
            <li><Link to="/about" onClick={() => addToHistory('About', '/about')} className="nav-item hover:text-blue-600 dark:hover:text-blue-400"><span className="spin-on-hover inline-block">ℹ️</span> About</Link></li>
            <li><Link to="/contact" onClick={() => addToHistory('Contact', '/contact')} className="nav-item hover:text-blue-600 dark:hover:text-blue-400"><span className="spin-on-hover inline-block">📞</span> Contact</Link></li>
            <li className="relative" ref={dropdownRef}>
              <button
                ref={buttonRef}
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                onMouseEnter={cancelCloseDropdown}
                onMouseLeave={closeDropdownWithDelay}
                className="nav-item flex items-center gap-1 hover:text-blue-600 dark:hover:text-blue-400"
              >
                <span className="spin-on-hover inline-block">🧰</span> All Tools <i className="fas fa-caret-down text-[10px] spin-on-hover"></i>
              </button>
              {isDropdownOpen && (
                <ul
                  className="absolute left-0 mt-2 bg-white dark:bg-gray-800 shadow-lg rounded-md py-2 min-w-[300px] max-h-[calc(100vh-100px)] overflow-y-auto z-50 text-sm grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 px-2"
                  onMouseEnter={cancelCloseDropdown}
                  onMouseLeave={closeDropdownWithDelay}
                >
                  <li className="col-span-full px-2 pb-2">
                    <input
                      type="text"
                      placeholder="Search tools..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-sm text-gray-800 dark:text-white"
                    />
                  </li>
                  {categories.filter(cat => cat.name.toLowerCase().includes(searchTerm.toLowerCase())).map(cat => (
                    <li key={cat.id}>
                      <button
                        onClick={() => handleCategoryClick(cat.id)}
                        className="block w-full text-left px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-white rounded"
                      >
                        {cat.name}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          </ul>

          {/* Right Side Icons */}
          <div className="hidden sm:flex items-center space-x-4 text-xs font-semibold">
            <button onClick={toggleDarkMode} className="text-yellow-400 dark:text-gray-200 hover:scale-110 transition-transform duration-200" title="Toggle Dark Mode">
              <i className={`fas ${isDarkMode ? 'fa-moon' : 'fa-sun'} spin-on-hover`}></i>
            </button>
            {isLoggedIn ? (
              <div className="relative" ref={accountRef}>
                <button
                  ref={accountButtonRef}
                  onClick={() => setIsAccountDropdownOpen(!isAccountDropdownOpen)}
                  onMouseEnter={cancelCloseAccountDropdown}
                  onMouseLeave={closeAccountDropdownWithDelay}
                  className="nav-item flex items-center gap-1 hover:text-blue-600 dark:hover:text-blue-400"
                >
                  Account <i className="fas fa-caret-down text-[10px] spin-on-hover" />
                </button>
                {isAccountDropdownOpen && (
                  <ul
                    className="absolute right-0 mt-2 bg-white dark:bg-gray-800 shadow-lg rounded-md py-2 z-50 text-sm w-32"
                    onMouseEnter={cancelCloseAccountDropdown}
                    onMouseLeave={closeAccountDropdownWithDelay}
                  >
                    <li><Link to="/history" className="block px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"><span className="spin-on-hover inline-block">📜</span> History</Link></li>
                    <li><button onClick={handleLogout} className="block w-full text-left px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"><span className="spin-on-hover inline-block">🚪</span> Sign Out</button></li>
                  </ul>
                )}
              </div>
            ) : (
              <>
                <Link to="/login" className="hover:text-blue-600 dark:hover:text-blue-400"><span className="spin-on-hover inline-block">🔐</span> Login</Link>
                <Link to="/signup" className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md flex items-center"><span className="spin-on-hover inline-block">📝</span> Sign up</Link>
              </>
            )}
          </div>
        </nav>
      </header>

      {/* 🔻 Mobile Drawer with Overlay */}
      {isMobileMenuOpen && (
        <>
          <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-40" onClick={() => setIsMobileMenuOpen(false)} />
          <div
            ref={mobileMenuRef}
            className="fixed top-0 left-0 h-full w-[75%] max-w-xs bg-white dark:bg-gray-900 shadow-lg z-50 transform transition-transform duration-300 ease-in-out translate-x-0"
          >
            <ul className="flex flex-col px-4 py-6 space-y-4 text-sm font-medium">
              {[['/', '🏠', 'Home'], ['#chatbots', '🤖', 'Chatbots'], ['#image-generators', '🖼️', 'Images'], ['#music-generators', '🎵', 'Music'], ['#data-analysis', '📊', 'Data'], ['#ai-diagrams', '📈', 'Diagrams'], ['#writing-tools', '✍️', 'Text'], ['#video-generators', '🎬', 'Video']].map(([link, icon, label]) => (
                <li key={label}>
                  {link.startsWith('#') ? (
                    <button
                      onClick={() => handleCategoryClick(link.slice(1))}
                      className="w-full text-left flex items-center gap-2 text-gray-800 dark:text-white hover:text-blue-600 dark:hover:text-blue-400"
                    >
                      <span className="spin-on-hover inline-block">{icon}</span>
                      <span>{label}</span>
                    </button>
                  ) : (
                    <Link
                      to={link}
                      onClick={() => {
                        addToHistory(label, link);
                        setIsMobileMenuOpen(false);
                      }}
                      className="flex items-center gap-2 text-gray-800 dark:text-white hover:text-blue-600 dark:hover:text-blue-400"
                    >
                      <span className="spin-on-hover inline-block">{icon}</span>
                      <span>{label}</span>
                    </Link>
                  )}
                </li>
              ))}

              <li>
                <Link to="/about" onClick={() => { addToHistory('About', '/about'); setIsMobileMenuOpen(false); }} className="flex items-center gap-2 hover:text-blue-600 dark:hover:text-blue-400">
                  <span className="spin-on-hover inline-block">ℹ️</span> About
                </Link>
              </li>
              <li>
                <Link to="/contact" onClick={() => { addToHistory('Contact', '/contact'); setIsMobileMenuOpen(false); }} className="flex items-center gap-2 hover:text-blue-600 dark:hover:text-blue-400">
                  <span className="spin-on-hover inline-block">📞</span> Contact
                </Link>
              </li>

              {isLoggedIn ? (
                <>
                  <li>
                    <Link to="/history" onClick={() => { addToHistory('History', '/history'); setIsMobileMenuOpen(false); }} className="flex items-center gap-2 hover:text-blue-600 dark:hover:text-blue-400">
                      <span className="spin-on-hover inline-block">📜</span> History
                    </Link>
                  </li>
                  <li>
                    <button onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }} className="flex items-center gap-2 w-full text-left hover:text-blue-600 dark:hover:text-blue-400">
                      <span className="spin-on-hover inline-block">🚪</span> Sign Out
                    </button>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-2 hover:text-blue-600 dark:hover:text-blue-400">
                      <span className="spin-on-hover inline-block">🔐</span> Login
                    </Link>
                  </li>
                  <li>
                    <Link to="/signup" onClick={() => setIsMobileMenuOpen(false)} className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-md flex items-center justify-center">
                      <span className="spin-on-hover inline-block">📝</span> Sign up
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>
        </>
      )}

      {/* Back to Top Button */}
      {showBackToTop && (
        <button
          onClick={handleBackToTop}
          className="fixed bottom-6 right-6 bg-red-600 text-white p-3 rounded-full shadow-lg hover:bg-red-700 transition-all duration-200 hover:scale-110 animate-bounce z-50"
          title="Back to Top 🚀"
        >
          <i className="fas fa-rocket text-lg spin-on-hover"></i>
        </button>
      )}
    </PageWrapper>
  );
};

export default Header;