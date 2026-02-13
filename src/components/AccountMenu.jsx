import React from 'react';
import ReactDOM from 'react-dom';
import { useHistory } from 'react-router-dom';
import { motion as m, AnimatePresence } from 'framer-motion';
import { FaCrown, FaUser, FaQuestionCircle, FaSignOutAlt, FaHistory, FaShieldAlt, FaEnvelope, FaHeart } from 'react-icons/fa';
import AuthModal from './AuthModal';



  const AccountMenu = ({ compact = false, fromSidebar = false, onOpenChange, transparent = false, isMobile = false }) => {
  const history = useHistory();
  const [open, setOpen] = React.useState(false);
  const [focusedIndex, setFocusedIndex] = React.useState(0);
  const [showAuthPrompt, setShowAuthPrompt] = React.useState(false);
  const ref = React.useRef(null);
  const triggerRef = React.useRef(null);
  const username = localStorage.getItem('username') || '';
  const email = localStorage.getItem('userEmail') || '';
  const [lastUsedKey, setLastUsedKey] = React.useState(() => {
    try { return localStorage.getItem('account_last_item') || 'profile'; } catch { return 'profile'; }
  });

  React.useEffect(() => {
    if (onOpenChange) onOpenChange(open);
  }, [open, onOpenChange]);

  const setLastUsed = (key) => { try { localStorage.setItem('account_last_item', key); } catch {} setLastUsedKey(key); };
  const go = (path, key) => { setLastUsed(key); setOpen(false); history.push(path); window.scrollTo(0, 0); };
  const logout = () => {
    setOpen(false);
    try { localStorage.clear(); } catch {}
    history.push('/');
    window.location.reload();
  };

  const displayName = username || email || 'User';

  const isLoggedIn = !!(username || email);
  
  const isAdmin = React.useMemo(() => {
    const adminFlag = localStorage.getItem('isAdmin') === 'true';
    const envAdmin = process.env.REACT_APP_ADMIN_EMAIL;
    // robust case-insensitive check
    const currentEmail = email ? email.toLowerCase().trim() : '';
    const targetEmail = envAdmin ? envAdmin.toLowerCase().trim() : '';
    
    return adminFlag || (targetEmail && currentEmail === targetEmail);
  }, [email]);

  // Read avatar from saved profile (data URL) each render so changes reflect immediately after save
  const [avatarError, setAvatarError] = React.useState(false);

  const [avatar, setAvatar] = React.useState(() => {
    try {
      const raw = localStorage.getItem('userProfile');
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      return parsed && parsed.avatar ? parsed.avatar : null;
    } catch {
      return null;
    }
  });

  React.useEffect(() => {
    const handleProfileUpdate = () => {
      try {
        const raw = localStorage.getItem('userProfile');
        if (raw) {
          const parsed = JSON.parse(raw);
          if (parsed && parsed.avatar) {
            setAvatar(parsed.avatar);
          }
        }
      } catch (err) {
        console.error('Error updating avatar:', err);
      }
    };

    window.addEventListener('user-profile-updated', handleProfileUpdate);
    return () => window.removeEventListener('user-profile-updated', handleProfileUpdate);
  }, []);

  // Reset error state if avatar changes
  React.useEffect(() => { setAvatarError(false); }, [avatar]);

  // Disable body scroll when auth modal is open
  React.useEffect(() => {
    if (showAuthPrompt) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [showAuthPrompt]);

  // Menu items config
  const openAuthPrompt = () => {
    setOpen(false);
    setShowAuthPrompt(true);
  };

  const items = isLoggedIn ? [
    ...(isAdmin && isMobile ? [{ key: 'admin', label: 'Admin Dashboard', icon: <FaShieldAlt className="opacity-80" />, onClick: () => go('/admin', 'admin') }] : []),
    ...(!isMobile ? [{ key: 'favorites', label: 'Favorites', icon: <FaHeart className="opacity-80" />, onClick: () => go('/favorites', 'favorites') }] : []),
    { key: 'history', label: 'History', icon: <FaHistory className="opacity-80" />, onClick: () => go('/history', 'history') },
    { key: 'upgrade', label: 'Upgrade plan', icon: <FaCrown className="opacity-80" />, onClick: () => go('/upgrade', 'upgrade') },
    { key: 'profile', label: 'Profile', icon: <FaUser className="opacity-80" />, onClick: () => go('/profile', 'profile') },
    { key: 'help', label: 'Help', icon: <FaQuestionCircle className="opacity-80" />, onClick: () => go('/help', 'help') },
    { key: 'logout', label: 'Log out', icon: <FaSignOutAlt />, onClick: logout, danger: true },
  ] : [

    { key: 'history', label: 'History', icon: <FaHistory className="opacity-80" />, onClick: openAuthPrompt },
    { key: 'upgrade', label: 'Upgrade plan', icon: <FaCrown className="opacity-80" />, onClick: openAuthPrompt },
    { key: 'help', label: 'Help', icon: <FaQuestionCircle className="opacity-80" />, onClick: () => { setOpen(false); history.push('/help'); window.scrollTo(0, 0); } },
    { key: 'login', label: 'Login', icon: <FaUser className="opacity-80" />, onClick: () => { setOpen(false); history.push('/login'); window.scrollTo(0, 0); } },
    ...(isMobile 
        ? [{ key: 'contact', label: 'Contact', icon: <FaEnvelope className="opacity-80" />, onClick: () => { setOpen(false); history.push('/contact'); window.scrollTo(0, 0); } }]
        : [{ key: 'signup', label: 'Sign Up', icon: <FaCrown className="opacity-80" />, onClick: () => { setOpen(false); history.push('/signup'); window.scrollTo(0, 0); } }]
    ),
  ];

  // Click outside handler updated for Portal
  React.useEffect(() => {
    const onDoc = (e) => { 
      // check both the trigger container (ref) and the menu (menuRef)
      const clickedTrigger = ref.current && ref.current.contains(e.target);
      const clickedMenu = menuRef.current && menuRef.current.contains(e.target);
      
      if (!clickedTrigger && !clickedMenu) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);

  const menuRef = React.useRef(null);
  React.useEffect(() => {
    if (open) {
      // Focus first actionable item & shift focus to menu container for key events
      setFocusedIndex(0);
      requestAnimationFrame(() => {
        if (menuRef.current) {
          try { menuRef.current.focus(); } catch {}
        }
      });
    }
  }, [open]);

  const onKeyDown = (e) => {
    if (!open) return;
    if (['ArrowDown','ArrowUp','Home','End'].includes(e.key)) {
      e.preventDefault();
      setFocusedIndex((prev) => {
        if (e.key === 'Home') return 0;
        if (e.key === 'End') return items.length - 1;
        const delta = e.key === 'ArrowDown' ? 1 : -1;
        return (prev + delta + items.length) % items.length;
      });
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      const item = items[focusedIndex];
      if (item) item.onClick();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setOpen(false);
      if (triggerRef.current) triggerRef.current.focus();
    }
  };

  const menu = (
          <m.div
            initial={{ opacity: 0, scale: 0.92, y: compact ? -8 : 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: compact ? -8 : 8 }}
            transition={{ duration: 0.08, ease: 'easeOut' }}
            onKeyDown={onKeyDown}
            ref={menuRef}
            tabIndex={0}
className={`${
  compact
    ? fromSidebar 
       ? [
          'fixed',
          'bottom-24', // Roughly aligns with button in sidebar
          'left-20',   // Push to the right of the sidebar
          'w-64',
          'max-h-[70vh]',
          'overflow-y-auto',
          'pointer-events-auto',
          'ml-2' // Extra spacing
         ].join(' ')
       : [
          'fixed',
          'bottom-32',
          'left-1/2',
          '-translate-x-1/2',
          'w-72',
          'max-h-[70vh]',
          'overflow-y-auto',
          'pointer-events-auto',
          'mr-1'
      ].join(' ')
    : [
        'fixed',
        'bottom-24',
        'left-3',
        'w-52', // 13rem, fits well within 14rem sidebar
        'z-[9999]',
        'pointer-events-auto'
      ].join(' ')
} 
p-2
z-[100000]
bg-[#0F0F0F] border border-white/10 rounded-2xl shadow-2xl`}
            role="menu"
          >
          {isLoggedIn && email && (
            <div className="px-4 py-2 text-xs text-gray-300 border-b border-white/5 mb-2 truncate font-bold uppercase tracking-wider">
              {email}
            </div>
          )}
          <div className={`space-y-1 ${isLoggedIn && email ? '' : ''}`}>
            {items.map((item, idx) => (
              <m.button
                key={item.key}
                role="menuitem"
                tabIndex={-1}
                data-idx={idx}
                onMouseEnter={() => setFocusedIndex(idx)}
                onClick={item.onClick}
                whileHover={{ scale: 1.02, x: 2 }}
                whileTap={{ scale: 0.98 }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all relative group ${
                  item.danger ? 'text-red-400 hover:bg-red-500/15' : 'text-gray-300 hover:bg-white/10 hover:text-white'
                } ${focusedIndex === idx ? 'bg-white/10 text-white' : ''}`}
              >
                <span className="text-lg opacity-70 group-hover:opacity-100 transition-opacity">{item.icon}</span>
                <span className="font-medium whitespace-nowrap text-left">{item.label}</span>
                <div className="ml-2 shrink-0">
                  {lastUsedKey === item.key && isLoggedIn && (
                    <span className="text-[10px] uppercase font-bold bg-[#FF6B00]/20 px-2 py-0.5 rounded text-[#FF6B00] whitespace-nowrap tracking-wide border border-[#FF6B00]/30 shadow-[0_0_10px_rgba(255,107,0,0.1)]">Recent</span>
                  )}
                </div>
              </m.button>
            ))}
          </div>
        </m.div>
  );

const DEFAULT_AVATAR = 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix';

  return (
    <div 
      className={`relative ${compact ? '' : 'w-full'}`} 
      ref={ref}
    >
      {!isLoggedIn ? (
        <m.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          ref={triggerRef}
          className={`${compact ? 'w-10 h-10 mx-auto' : 'w-[92%] mx-auto'} flex items-center justify-center gap-2 px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-lg transition-colors font-medium text-xs`}
          onClick={() => setOpen(o => !o)}
          aria-haspopup="menu"
          aria-expanded={open}
        >
          {compact ? '👨‍💼' : '👨‍💼 Account'}
          <span className={`transition-transform ${open ? 'rotate-180' : ''}`}>▼</span>
        </m.button>
      ) : compact ? (
        <button
          ref={triggerRef}
          className={`w-10 h-10 mx-auto flex items-center justify-center text-white transition-colors ${transparent ? 'rounded-full' : 'bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl'}`}
          onClick={() => setOpen(o => !o)}
          aria-haspopup="menu"
          aria-expanded={open}
          title={displayName}
        >
          <img
            src={avatar && !avatarError ? avatar : DEFAULT_AVATAR}
            alt={displayName}
            className={`w-7 h-7 rounded-full object-cover transition-all ${open ? 'ring-2 ring-orange-500/70 ring-offset-2 ring-offset-black/40' : ''}`}
            onError={(e) => {
              // If the current avatar fails, try default. If default fails, we might still show broken image but avoids initials.
              // To prevent infinite loop if default also fails, check src
              if (e.target.src !== DEFAULT_AVATAR) {
                 e.target.src = DEFAULT_AVATAR;
                 setAvatarError(true); 
              }
            }}
          />
        </button>
      ) : (
        <button
          ref={triggerRef}
          className="w-[92%] mx-auto flex items-center justify-between gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white px-3 py-1.5 rounded-xl transition-colors"
          onClick={() => setOpen(o => !o)}
          aria-haspopup="menu"
          aria-expanded={open}
        >
          <span className="flex items-center gap-2">
            <img
              src={avatar && !avatarError ? avatar : DEFAULT_AVATAR}
              alt={displayName}
              className={`w-7 h-7 rounded-full object-cover transition-all ${open ? 'ring-2 ring-orange-500/70 ring-offset-2 ring-offset-black' : ''}`}
               onError={(e) => {
                  if (e.target.src !== DEFAULT_AVATAR) {
                     e.target.src = DEFAULT_AVATAR;
                     setAvatarError(true);
                  }
               }}
            />
            <span className="text-xs font-medium truncate max-w-[7rem]">{displayName}</span>
          </span>
          <span className={`transition-transform text-xs ${open ? 'rotate-180' : ''}`}>▼</span>
        </button>
      )}

       {/* Portal the menu to the body to break z-index/transform limits */}
       {typeof document !== 'undefined' && ReactDOM.createPortal(
            <AnimatePresence mode="wait">
                {open && menu}
            </AnimatePresence>,
            document.body
       )}


      <AuthModal 
        isOpen={showAuthPrompt} 
        onClose={() => setShowAuthPrompt(false)} 
      />
    </div>
  );
};

export default AccountMenu;