import React, { useState } from 'react';
import StudioSidebar from './StudioSidebar';
import LogoRemover from './LogoRemover';
import BackgroundRemover from './BackgroundRemover';
import ImageEnhancer from './ImageEnhancer';
import FreepikDownloader from './FreepikDownloader';
import MyProjects from './MyProjects';
import Support from './Support';
import PricingPlansComponent from '../PricingPlans';
import { useHistory } from 'react-router-dom';
import { Menu } from 'lucide-react';

const MagicStudio = () => {
    const [activeTab, setActiveTab] = useState('freepik'); // Default to Freepik Downloader
    const [projectToEdit, setProjectToEdit] = useState(null);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const history = useHistory();

    const handleEditAgain = (project) => {
        setProjectToEdit(project);
        setActiveTab('remover');
    };

    // Dynamic Background Logic
    const getBackgroundImage = () => {
        switch(activeTab) {
            case 'bg-remover': 
                return require('../../assets/magic_bg_optimized.jpg'); // Fantasy Fire
            case 'enhancer': 
                return require('../../assets/enhancer_dark_bg.png'); // Dark 16:9 Background
            case 'remover':
                return require('../../assets/tourist_bg.jpg'); // Tourist
            case 'projects':
                return require('../../assets/history_bg.jpg'); // History/Projects
            case 'support':
                return require('../../assets/help_bg.png'); // Help/Support
            case 'upgrade':
                return require('../../assets/pricing-bg.png'); // Pricing/Upgrade
            case 'freepik':
                return require('../../assets/retro_bg.jpg'); // Retro Sky
            default:
                return require('../../assets/magic_studio_bg.jpg'); // Default (Indigenous)   
        }
    };

    return (
        <div className="flex h-screen font-sans text-slate-50 overflow-hidden selection:bg-violet-500/30 relative studio-noise">
            {/* dynamic Background Image - Restricted to Content Area (Right of Sidebar on Desktop) */}
            <div className="fixed inset-0 md:left-72 z-0 transition-opacity duration-700 ease-in-out">
                {/* We use a key to force re-render/fade when image changes, or just let CSS replace it */}
                 <div 
                    key={activeTab} 
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat animate-fade-in"
                    style={{
                        backgroundImage: `url(${getBackgroundImage()})`,
                    }}
                />
                {/* Contrast Overlay: Essential for white text on bright backgrounds */}
                <div className="absolute inset-0 bg-black/50" />
            </div>
            
            {/* Sidebar Replicated from Original Tools */}
            <StudioSidebar 
                activeTab={activeTab} 
                setActiveTab={setActiveTab} 
                isOpen={isMobileMenuOpen}
                setIsOpen={setIsMobileMenuOpen}
            />

            {/* Mobile Overlay */}
            {isMobileMenuOpen && (
                <div 
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden animate-fade-in"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col h-full relative overflow-y-auto custom-scrollbar">
                
                {/* Top Bar replicated from original */}
                <header className="h-16 flex items-center justify-between px-4 md:px-8 border-b border-white/[0.05] backdrop-blur-md bg-black/10 shrink-0 sticky top-0 z-20">
                    <div className="flex items-center gap-3">
                        {/* Mobile Menu Toggle */}
                        <button 
                            onClick={() => setIsMobileMenuOpen(true)}
                            className="md:hidden p-2 -ml-2 text-zinc-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
                        >
                            <Menu className="w-6 h-6" />
                        </button>

                         <span className="bg-violet-600/10 text-violet-400 px-3 py-1 rounded-full text-[10px] font-bold border border-violet-500/20 tracking-wider uppercase">
                            Premium Access
                        </span>
                    </div>
                    <div className="flex items-center gap-2 md:gap-4">
                        <button 
                            onClick={() => history.push('/')}
                            className="bg-[#27272a] hover:bg-[#3f3f46] text-white px-3 py-1.5 md:px-4 md:py-2 rounded-full text-xs md:text-sm font-semibold transition-all whitespace-nowrap"
                        >
                            Exit
                        </button>
                        <button 
                            onClick={() => setActiveTab('upgrade')}
                            className="bg-white text-black hover:bg-zinc-200 px-3 py-1.5 md:px-4 md:py-2 rounded-full text-xs md:text-sm font-bold transition-all flex items-center gap-1 md:gap-2 whitespace-nowrap"
                        >
                            <span className="text-yellow-500">👑</span> Upgrade
                        </button>
                    </div>
                </header>

                {/* Tool Content Area */}
                <div className="flex-1 p-4 md:p-8 flex items-center justify-center">
                    <div className="w-full max-w-5xl">
                        {/* Header for Active Tool replicates original App.jsx logic */}
                        <div className="text-center mb-6 md:mb-10">
                            <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
                                {activeTab === 'remover' && 'AI Image Object Remover'}
                                {activeTab === 'freepik' && 'Freepik Premium Downloader'}
                                {activeTab === 'enhancer' && 'AI Image Enhancer'}
                                {activeTab === 'bg-remover' && 'AI Background Remover'}
                                {activeTab === 'projects' && 'My Projects & History'}
                                {activeTab === 'support' && 'Help & Support Center'}
                                {activeTab === 'upgrade' && 'Premium Plans & Upgrades'}
                                {(activeTab === 'video-remover' || activeTab === 'text-remover') && 'Feature Coming Soon'}
                            </h2>
                            <p className="text-zinc-400 text-sm md:text-base px-4">
                                 {activeTab === 'remover' && 'Remove unwanted objects, people, text, or logos from images in seconds.'}
                                 {activeTab === 'freepik' && 'Download high-quality premium images from Freepik for free.'}
                                 {activeTab === 'enhancer' && 'Upscale and de-noise your images with advanced AI.'}
                                 {activeTab === 'bg-remover' && 'Remove backgrounds instantly with professional AI matting.'}
                                 {activeTab === 'projects' && 'Browse your history of AI-processed images and high-res downloads.'}
                                 {activeTab === 'support' && "Everything you need to know about Magic Studio and AI processing."}
                                 {activeTab === 'upgrade' && 'Choose the perfect plan for your creative needs.'}
                                 {(activeTab === 'video-remover' || activeTab === 'text-remover') && 'This tool is currently in active development.'}
                            </p>
                        </div>

                        {/* Components */}
                        <div className="animate-fade-in">
                            {activeTab === 'remover' && <LogoRemover projectToEdit={projectToEdit} clearProject={() => setProjectToEdit(null)} />}
                            {activeTab === 'freepik' && <FreepikDownloader />}
                            {activeTab === 'enhancer' && <ImageEnhancer />}
                            {activeTab === 'bg-remover' && <BackgroundRemover />}
                            {activeTab === 'projects' && <MyProjects onEditAgain={handleEditAgain} />}
                            {activeTab === 'support' && <Support />}
                            {activeTab === 'upgrade' && <PricingPlansComponent isInline={true} />}

                            {(activeTab === 'video-remover' || activeTab === 'text-remover') && (
                                <div className="glass-card rounded-[2.5rem] p-10 md:p-20 text-center">
                                    <div className="text-5xl mb-6">🚧</div>
                                    <h3 className="text-xl md:text-2xl font-bold text-white">Feature Coming Soon</h3>
                                    <p className="text-zinc-400 mt-4 max-w-sm mx-auto">This tool is currently in active development and will be available to premium members shortly.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default MagicStudio;
