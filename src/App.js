// App.js
import React, { useState, useEffect, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Route, Switch, useLocation, Redirect } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// --- CONTEXT PROVIDER ---
import { LoadingProvider } from './contexts/LoadingContext'; // Make sure this path is correct
import { ThemeProvider } from './contexts/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';
import { CompareProvider } from './contexts/CompareContext';

// --- STATIC COMPONENTS (Normal Imports) ---
import Footer from './components/Footer';
import ComingSoonModal from './components/ComingSoonModal';
import '@fortawesome/fontawesome-free/css/all.min.css';
import './index.css';
import Sidebar from './components/Sidebar';
import MobileBottomNav from './components/MobileBottomNav';
import Favorites from './components/Favorites';
import NewsletterPopup from './components/NewsletterPopup';
import ComparisonBar from './components/ComparisonBar';
import AnnouncementBanner from './components/AnnouncementBanner';

import CinematicLoader from './components/CinematicLoader';

// ... (existing imports)

// --- LAZY-LOADED PAGE COMPONENTS ---
const Home = lazy(() => import('./components/Home'));
const Login = lazy(() => import('./components/Login'));
const Signup = lazy(() => import('./components/Signup'));
const About = lazy(() => import('./components/About'));
const Contact = lazy(() => import('./components/Contact'));
const HistoryPage = lazy(() => import('./components/HistoryPage'));
const ResetPassword = lazy(() => import('./components/ResetPassword'));
const AdminDashboard = lazy(() => import('./components/AdminDashboard'));
const BlogList = lazy(() => import('./components/BlogList'));
const BlogPost = lazy(() => import('./components/BlogPost'));
const AddTool = lazy(() => import('./components/AddTool'));
// 1. LAZY-LOAD THE USERPROFILE COMPONENT
const UserProfile = lazy(() => import('./components/UserProfile'));
const ToolDetail = lazy(() => import('./components/ToolDetail'));
const ShowcasePage = lazy(() => import('./components/ShowcasePage'));
const Upgrade = lazy(() => import('./components/Upgrade'));
const Help = lazy(() => import('./components/Help'));
const PrivacyPolicy = lazy(() => import('./components/PrivacyPolicy'));
const TermsOfService = lazy(() => import('./components/TermsOfService'));
const ComparePage = lazy(() => import('./components/ComparePage'));
const StackDetail = lazy(() => import('./components/StackDetail'));
const Library = lazy(() => import('./components/Library'));
const MagicStudio = lazy(() => import('./components/MagicStudio/MagicStudio'));





// --- LOADER COMPONENT ---
// This component will be shown while a lazy-loaded page is being fetched.
const PageLoader = () => (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
    {/* The path should be absolute from the 'public' folder */}
    <img src="/ailogo.gif" alt="Loading..." style={{ width: '150px' }} />
  </div>
);

// ... (existing imports)

const AppWithDetails = () => {
    const location = useLocation();
    const isMagicStudio = location.pathname.startsWith('/magic-studio');
    const [initialLoad, setInitialLoad] = useState(true);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const onResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', onResize);
        return () => window.removeEventListener('resize', onResize);
    }, []);

    const closeModal = () => setIsModalOpen(false);

    return (
      <div className="App min-h-screen flex flex-col bg-black text-white transition-colors duration-300">
        {initialLoad && <CinematicLoader onComplete={() => setInitialLoad(false)} />}
        <LoadingProvider>
          <AnnouncementBanner />
          {!isMobile && !isMagicStudio && <Sidebar />}
          {!isMagicStudio && <NewsletterPopup />}
          <main className="flex-grow pb-24 md:pb-0">
            <Suspense fallback={<PageLoader />}>
              <Switch>
                <Route path="/tools/:category/:toolSlug" component={ToolDetail} />
                <Route path="/" exact render={(props) => <Home {...props} isCinematicLoading={initialLoad} />} />
                <Route path="/login" component={Login} />
                <Route path="/signup" component={Signup} />
                <Route path="/about" component={About} />
                <Route path="/favorites" component={Favorites} />
                <Route path="/contact" component={Contact} />
                <Route path="/history" component={HistoryPage} />
                <Route path="/showcase" component={ShowcasePage} />
                <Route path="/reset-password" component={ResetPassword} />
                <Route path="/admin" component={AdminDashboard} />
                <Route exact path="/blog" component={BlogList} />
                <Route path="/blog/:slug" component={BlogPost} />
                <Route path="/add-tool" component={AddTool} />
                <Route path="/upgrade" component={ Upgrade} />
                <Route path="/help" component={Help} />
                <Route path="/privacy" component={PrivacyPolicy} />
                <Route path="/terms" component={TermsOfService} />
                <Route path="/compare" component={ComparePage} />
                <Route path="/library" component={Library} />
                <Redirect from="/favorites" to="/library" />
                <Redirect from="/stacks" to="/library" />
                <Route path="/stack/:slug" component={StackDetail} />
                <Route path="/profile" component={UserProfile} />
                <Route path="/magic-studio/:toolId?" component={MagicStudio} />
              </Switch>
            </Suspense>
          </main>
          {!isMobile && !isMagicStudio && <ComparisonBar />}
          {!isMagicStudio && <MobileBottomNav />}
          {isModalOpen && <ComingSoonModal closeModal={closeModal} />}
          {!isMagicStudio && <Footer />}
          <Toaster position="bottom-right" reverseOrder={false} />
        </LoadingProvider>
      </div>
    );
};

function App() {
  return (
    <LanguageProvider>
      <ThemeProvider>
        <CompareProvider>
          <Router>
            <AppWithDetails />
          </Router>
        </CompareProvider>
      </ThemeProvider>
    </LanguageProvider>
  );
}

export default App;
