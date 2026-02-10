import React from 'react';
import { Eraser, Wand2, Video, Type, HelpCircle, LayoutGrid, Download, Scissors } from 'lucide-react'; // LINT_MARKER_SIDEBAR
import Logo from '../../assets/logo.png';

const StudioSidebar = ({ activeTab, setActiveTab }) => {
    
    const menuItems = [
        { id: 'freepik', icon: Download, label: 'Freepik Downloader', badge: 'New' },
        { id: 'enhancer', icon: Wand2, label: 'Image Enhancer', badge: 'Hot' },
        { id: 'bg-remover', icon: Scissors, label: 'Background Remover', badge: 'Hot' },
        { id: 'remover', icon: Eraser, label: 'Image Object Remover', badge: 'New' },
        { id: 'video-remover', icon: Video, label: 'Video Object Remover', badge: 'Beta' },
        { id: 'text-remover', icon: Type, label: 'Image Text Remover' },
    ];

    return (
        <aside className="w-72 glass-nav flex flex-col h-full shrink-0 z-30">
            {/* Logo Area */}
            <div className="p-6 flex items-center gap-3">
                <img src={Logo} alt="AI Tools Hub Logo" className="w-10 h-10 rounded-lg shadow-lg shadow-violet-500/20" />
                <h1 className="text-xl font-bold text-white tracking-tight">Tools Hub</h1>
            </div>

            {/* Main Navigation */}
            <nav className="flex-1 px-4 space-y-2 py-4">
                 <div className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-4 px-2">Tools</div>
                
                {menuItems.map((item) => {
                    const isActive = activeTab === item.id;
                    return (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all group ${
                                isActive 
                                    ? "bg-[#8b5cf6] text-white shadow-lg shadow-violet-500/20" 
                                    : "text-zinc-400 hover:bg-[#27272a] hover:text-white"
                            }`}
                        >
                            <div className="flex items-center gap-3">
                                <item.icon className={`w-5 h-5 ${isActive ? "text-white" : "text-zinc-500 group-hover:text-white"}`} />
                                {item.label}
                            </div>
                            {item.badge && (
                                <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold uppercase ${
                                    item.badge === 'Beta' ? "bg-zinc-800 text-zinc-400" :
                                    item.badge === 'Hot' ? "bg-orange-500/20 text-orange-400" : ""
                                }`}>
                                    {item.badge}
                                </span>
                            )}
                        </button>
                    );
                })}
            </nav>

            {/* Bottom Actions */}
            <div className="p-4 border-t border-[#27272a] space-y-1">
                <button 
                    onClick={() => setActiveTab('projects')}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all group ${
                        activeTab === 'projects' ? "bg-[#8b5cf6] text-white shadow-lg shadow-violet-500/20" : "text-zinc-400 hover:text-white hover:bg-[#27272a]"
                    }`}
                >
                    <LayoutGrid className={`w-5 h-5 ${activeTab === 'projects' ? "text-white" : "text-zinc-500 group-hover:text-white"}`} />
                    My Projects
                </button>
                <button 
                    onClick={() => setActiveTab('support')}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all group ${
                        activeTab === 'support' ? "bg-[#8b5cf6] text-white shadow-lg shadow-violet-500/20" : "text-zinc-400 hover:text-white hover:bg-[#27272a]"
                    }`}
                >
                    <HelpCircle className={`w-5 h-5 ${activeTab === 'support' ? "text-white" : "text-zinc-500 group-hover:text-white"}`} />
                    Support
                </button>
            </div>
        </aside>
    );
};

export default StudioSidebar;
