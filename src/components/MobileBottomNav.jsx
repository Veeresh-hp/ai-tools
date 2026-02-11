import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { FaHome, FaPlus, FaNewspaper, FaLayerGroup } from 'react-icons/fa';
import { Wand2, Sparkles } from 'lucide-react';
import AccountMenu from './AccountMenu';

export default function MobileBottomNav() {
  const history = useHistory();
  const location = useLocation();
  const [activeIndex, setActiveIndex] = useState(0);
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  // Custom Studio Icon with Animation
  const StudioIcon = () => (
    <div className="relative group">
       {/* Animated Glow Background behind icon */}
       <div className="absolute inset-0 bg-violet-500/30 blur-md rounded-full animate-pulse md:group-hover:block hidden" />
       
       <div className="relative">
          <Wand2 size={22} className="text-inherit" />
          
          {/* Floating Sparkles */}
          <Sparkles 
            size={10} 
            className="absolute -top-2 -right-2 text-yellow-300 animate-spin-slow" 
            style={{ animationDuration: '3s' }}
          />
       </div>
    </div>
  );

  // Configuration for the menu items matching app routes
  const menuItems = useMemo(() => [
    { name: 'Home', icon: <FaHome size={20} />, path: '/', color: 'bg-[#FF6B00]', shadow: 'shadow-orange-500/40' },
    { 
        name: 'Studio', 
        icon: <StudioIcon />, 
        path: '/magic-studio', 
        color: 'bg-violet-600', 
        shadow: 'shadow-violet-600/50',
        isSpecial: true 
    },
    { name: 'Blog', icon: <FaNewspaper size={20} />, path: '/blog', color: 'bg-[#FF6B00]', shadow: 'shadow-orange-500/40' },
    { name: 'Add', icon: <FaPlus size={20} />, path: '/add-tool', color: 'bg-[#FF6B00]', shadow: 'shadow-orange-500/40' },
    { name: 'Stacks', icon: <FaLayerGroup size={20} />, path: '/stacks', color: 'bg-[#FF6B00]', shadow: 'shadow-orange-500/40' },
    { name: 'Profile', isProfile: true, path: '/profile', color: 'bg-[#FF6B00]', shadow: 'shadow-orange-500/40' }, 
  ], []);
  
  const itemCount = menuItems.length;
  const itemWidth = 100 / itemCount; // 16.666% for 6 items

  useEffect(() => {
    const currentPath = location.pathname;
    const index = menuItems.findIndex(item => {
      // Exact match for root, startsWith for others
      if (item.path === '/') return currentPath === '/';
      return currentPath.startsWith(item.path);
    });
    if (index !== -1) setActiveIndex(index);
    else setActiveIndex(0); 
  }, [location.pathname, menuItems]);

  const handleNavigation = (index, path) => {
    setActiveIndex(index);
    history.push(path);
    window.scrollTo(0, 0);
  };

  // Calculate mask position for "Dip" effect
  // Center is at index * width + width/2
  const centerPercent = activeIndex * itemWidth + (itemWidth / 2);
  const maskPosition = `${centerPercent}%`;

  // Scroll visibility logic
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Simple threshold to avoid jitter
      if (Math.abs(currentScrollY - lastScrollY.current) < 10) return;

      if (currentScrollY > lastScrollY.current && currentScrollY > 50) {
        // Scrolling DOWN -> Hide
        setIsVisible(false);
      } else {
        // Scrolling UP -> Show
        setIsVisible(true);
      }
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!isMobile) return null;

  const activeItem = menuItems[activeIndex];

  return (
    <div 
        className={`fixed bottom-0 left-0 right-0 z-50 flex justify-center items-end bg-transparent pointer-events-none px-2 transition-transform duration-300 ease-in-out ${isVisible ? 'translate-y-0' : 'translate-y-[120%]'}`}
    >
      {/* Structural Wrapper - No Mask */}
      <div className="relative w-full max-w-md mx-auto pointer-events-auto">
        
        {/* Floating Active Button - Sibling to bar so it's NOT masked */}
        <div 
            className="absolute bottom-[40px] left-0 h-14 z-50 flex justify-center transition-transform duration-300 ease-[cubic-bezier(0.25,1,0.5,1)] pointer-events-none"
            style={{ 
                width: `${itemWidth}%`,
                transform: `translateX(${activeIndex * 100}%)` 
            }}
        >
             <div className={`w-14 h-14 rounded-full shadow-lg flex items-center justify-center text-white transition-colors duration-300 ${activeItem.color || 'bg-[#FF6B00]'} ${activeItem.shadow || 'shadow-orange-500/40'} ${activeItem.isProfile ? 'pointer-events-auto' : ''}`}>
                 {activeItem.isProfile ? (
                     <div className="flex items-center justify-center w-full h-full">
                        <AccountMenu compact={true} transparent={true} isMobile={isMobile} />
                     </div>
                 ) : (
                     activeItem.icon
                 )}
             </div>
        </div>

        {/* 
          Main Bar Container - MASK APPLIED HERE 
          This contains the white background and the menu list.
        */}
        <div 
          className="relative w-full bg-[#0F0F0F] border-t border-white/10 h-[70px] rounded-t-[20px] shadow-[0_-5px_20px_rgba(0,0,0,0.5)] flex items-center justify-center transition-all duration-300 ease-[cubic-bezier(0.25,1,0.5,1)]"
          style={{
            WebkitMaskImage: `radial-gradient(circle 38px at ${maskPosition} 0px, transparent 96%, black 100%)`,
            maskImage: `radial-gradient(circle 38px at ${maskPosition} 0px, transparent 96%, black 100%)`
          }}
        >
          {/* The Menu List */}
          <ul 
            className="grid w-full h-full relative z-20"
            style={{ gridTemplateColumns: `repeat(${itemCount}, minmax(0, 1fr))` }}
          >
            {menuItems.map((item, i) => {
              const isActive = i === activeIndex;
              
              // If this is the Profile item
              if (item.isProfile) {
                return (
                    <li key={i} className="relative w-full h-full flex items-center justify-center group">
                        {/* If inactive, show AccountMenu which handles its own click */}
                        <div 
                            className={`transition-all duration-300 transform ${isActive ? 'opacity-0 scale-50 pointer-events-none' : 'opacity-100 scale-100'}`}
                        >
                            <AccountMenu compact={true} transparent={true} isMobile={isMobile} />
                        </div>
                        
                        {/* Label logic - same as buttons */}
                         <span
                            className={`
                              absolute text-[10px] font-semibold tracking-wide transition-all duration-300 transform pointer-events-none
                              ${isActive 
                                ? 'opacity-100 translate-y-[20px] text-[#FF6B00]' 
                                : 'opacity-0 translate-y-[20px]'}
                            `}
                          >
                            {item.name}
                          </span>
                    </li>
                );
              }

              return (
                <li key={i} className="relative w-full h-full flex items-center justify-center group">
                  <button
                    className="flex flex-col items-center justify-center w-full h-full focus:outline-none pt-4"
                    onClick={() => handleNavigation(i, item.path)}
                  >
                    <span
                      className={`
                        absolute transition-all duration-300 ease-[cubic-bezier(0.25,1,0.5,1)] z-40
                        ${isActive 
                          ? 'opacity-0 scale-50' 
                          : 'transform translate-y-0 text-gray-400 group-hover:text-[#FF6B00] opacity-100 scale-100'}
                      `}
                    >
                      {item.icon}
                    </span>
                    
                    <span
                      className={`
                        absolute text-[10px] font-semibold tracking-wide transition-all duration-300 transform
                        ${isActive 
                          ? 'opacity-100 translate-y-[12px] text-[#FF6B00]' 
                          : 'opacity-0 translate-y-[20px]'}
                      `}
                    >
                      {item.name}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

      </div>
    </div>
  );
}
