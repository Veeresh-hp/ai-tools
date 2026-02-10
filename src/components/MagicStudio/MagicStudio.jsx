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

const MagicStudio = () => {
    const [activeTab, setActiveTab] = useState('remover');
    const [projectToEdit, setProjectToEdit] = useState(null);
    const history = useHistory();

    const handleEditAgain = (project) => {
        setProjectToEdit(project);
        setActiveTab('remover');
    };

    return (
        <div className="flex h-screen font-sans text-slate-50 overflow-hidden selection:bg-violet-500/30 relative studio-noise">
            {/* Mesh Gradient Local to Studio */}
            <div className="mesh-gradient" />
            
            {/* Sidebar Replicated from Original Tools */}
            <StudioSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col h-full relative overflow-y-auto custom-scrollbar">
                
                {/* Top Bar replicated from original */}
                <header className="h-16 flex items-center justify-between px-8 border-b border-white/[0.05] backdrop-blur-md bg-black/10 shrink-0 sticky top-0 z-20">
                    <div className="flex items-center gap-2">
                         <span className="bg-violet-600/10 text-violet-400 px-3 py-1 rounded-full text-[10px] font-bold border border-violet-500/20 tracking-wider uppercase">
                            Premium Access
                        </span>
                    </div>
                    <div className="flex items-center gap-4">
                        <button 
                            onClick={() => history.push('/')}
                            className="bg-[#27272a] hover:bg-[#3f3f46] text-white px-4 py-2 rounded-full text-sm font-semibold transition-all"
                        >
                            Exit Studio
                        </button>
                        <button 
                            onClick={() => setActiveTab('upgrade')}
                            className="bg-white text-black hover:bg-zinc-200 px-4 py-2 rounded-full text-sm font-bold transition-all flex items-center gap-2"
                        >
                            <span className="text-yellow-500">👑</span> Upgrade
                        </button>
                    </div>
                </header>

                {/* Tool Content Area */}
                <div className="flex-1 p-8 flex items-center justify-center">
                    <div className="w-full max-w-5xl">
                        {/* Header for Active Tool replicates original App.jsx logic */}
                        <div className="text-center mb-10">
                            <h2 className="text-3xl font-bold text-white mb-2">
                                {activeTab === 'remover' && 'AI Image Object Remover'}
                                {activeTab === 'freepik' && 'Freepik Premium Downloader'}
                                {activeTab === 'enhancer' && 'AI Image Enhancer'}
                                {activeTab === 'bg-remover' && 'AI Background Remover'}
                                {activeTab === 'projects' && 'My Projects & History'}
                                {activeTab === 'support' && 'Help & Support Center'}
                                {activeTab === 'upgrade' && 'Premium Plans & Upgrades'}
                                {(activeTab === 'video-remover' || activeTab === 'text-remover') && 'Feature Coming Soon'}
                            </h2>
                            <p className="text-zinc-400">
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
                                <div className="glass-card rounded-[2.5rem] p-20 text-center">
                                    <div className="text-5xl mb-6">🚧</div>
                                    <h3 className="text-2xl font-bold text-white">Feature Coming Soon</h3>
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
