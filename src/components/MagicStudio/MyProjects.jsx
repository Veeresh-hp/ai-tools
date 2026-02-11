import { useState, useEffect } from 'react';
import axios from 'axios';
import { Download, ExternalLink, Calendar, HardDrive, Trash2, LayoutGrid, List } from 'lucide-react';

const STUDIO_API_BASE = process.env.NODE_ENV === 'production'
    ? (process.env.REACT_APP_STUDIO_API_URL || 'https://aitools-backend-kh4a.onrender.com')
    : 'http://localhost:8000';

const MyProjects = ({ onEditAgain }) => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'

    const fetchProjects = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${STUDIO_API_BASE}/api/projects`);
            // Prepend BASE_URL to project urls
            const formattedProjects = (response.data.projects || []).map(p => ({
                ...p,
                url: p.url.startsWith('http') ? p.url : `${STUDIO_API_BASE}${p.url}`
            }));
            setProjects(formattedProjects);
        } catch (err) {
            console.error("Failed to fetch projects:", err);
        } finally {
            setLoading(false);
        }
    };

    // eslint-disable-next-line no-unused-vars
    const handleProjectDownload = async (url, filename) => {
        try {
            const response = await fetch(url);
            const blob = await response.blob();
            const blobUrl = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = blobUrl;
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(blobUrl);
        } catch (err) {
            console.error("Download failed:", err);
            alert("Failed to download project.");
        }
    };

    useEffect(() => {
        fetchProjects();
    }, []);

    const handleDelete = async (filename) => {
        if (!window.confirm(`Are you sure you want to delete "${filename}"?`)) return;

        try {
            await axios.delete(`${STUDIO_API_BASE}/api/delete-project/${filename}`);
            // Optimistic update
            setProjects(prev => prev.filter(p => p.name !== filename));
        } catch (err) {
            console.error("Failed to delete project:", err);
            alert("Failed to delete project. Please try again.");
        }
    };

    const handleDeleteAll = async () => {
        if (!window.confirm("Are you sure you want to delete ALL projects? This action cannot be undone.")) return;

        try {
            await axios.delete(`${STUDIO_API_BASE}/api/delete-all-projects`);
            setProjects([]);
        } catch (err) {
            console.error("Failed to delete all projects:", err);
            alert("Failed to clear history. Please try again.");
        }
    };

    const formatDate = (mtime) => {
        return new Date(mtime * 1000).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatSize = (bytes) => {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-20">
                <div className="w-12 h-12 border-4 border-white/10 border-t-violet-500 rounded-full animate-spin mb-4"></div>
                <p className="text-zinc-500 font-medium">Loading your projects...</p>
            </div>
        );
    }

    if (projects.length === 0) {
        return (
            <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-[2.5rem] p-20 text-center animate-fade-in">
                <div className="w-24 h-24 bg-white/5 rounded-3xl flex items-center justify-center mx-auto mb-8 text-5xl shadow-xl">
                    📁
                </div>
                <h3 className="text-3xl font-bold text-white mb-3">No projects yet</h3>
                <p className="text-zinc-400 max-w-md mx-auto text-lg leading-relaxed">
                    Start by using our AI tools to remove objects or backgrounds. Your history will appear here in high-fidelity.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between pb-4 border-b border-[#27272a]">
                <div className="flex items-center gap-4">
                    <button 
                        onClick={() => setViewMode('grid')}
                        className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-violet-600 text-white shadow-lg shadow-violet-600/20' : 'text-zinc-500 hover:text-white hover:bg-[#27272a]'}`}
                    >
                        <LayoutGrid className="w-5 h-5" />
                    </button>
                    <button 
                        onClick={() => setViewMode('list')}
                        className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-violet-600 text-white shadow-lg shadow-violet-600/20' : 'text-zinc-500 hover:text-white hover:bg-[#27272a]'}`}
                    >
                        <List className="w-5 h-5" />
                    </button>
                    <span className="text-sm font-semibold text-zinc-400 ml-2">
                        {projects.length} {projects.length === 1 ? 'Project' : 'Projects'} Found
                    </span>
                </div>
                
                <button 
                    onClick={handleDeleteAll}
                    className="flex items-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-xl text-sm font-bold transition-all border border-red-500/20 shadow-lg shadow-red-500/5"
                >
                    <Trash2 className="w-4 h-4" /> Delete All History
                </button>
            </div>

            {viewMode === 'grid' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {projects.map((project) => (
                        <div key={project.name} className="group bg-white/5 border border-white/10 backdrop-blur-xl rounded-3xl overflow-hidden hover:border-violet-500/40 transition-all duration-500 shadow-2xl hover:-translate-y-2">
                            <div className="aspect-[4/3] relative overflow-hidden bg-black/40 flex items-center justify-center">
                                <img 
                                    src={project.url} 
                                    alt={project.name}
                                    className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-500"
                                />
                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                                    <button 
                                        onClick={() => handleProjectDownload(project.url, project.name)}
                                        className="p-3 bg-white text-black rounded-xl hover:scale-110 transition-transform shadow-lg"
                                        title="Download"
                                    >
                                        <Download className="w-5 h-5" />
                                    </button>
                                    <button 
                                        onClick={() => onEditAgain(project)}
                                        className="p-3 bg-violet-600 text-white rounded-xl hover:scale-110 transition-transform shadow-lg"
                                        title="Edit Again"
                                    >
                                        <ExternalLink className="w-5 h-5" />
                                    </button>
                                    <button 
                                        onClick={() => handleDelete(project.name)}
                                        className="p-3 bg-red-600 text-white rounded-xl hover:scale-110 transition-transform shadow-lg"
                                        title="Delete"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                            <div className="p-4 space-y-3">
                                <h4 className="text-sm font-bold text-white truncate pr-2" title={project.name}>
                                    {project.name}
                                </h4>
                                <div className="flex items-center justify-between text-[11px] text-zinc-500 font-medium">
                                    <div className="flex items-center gap-1.5">
                                        <Calendar className="w-3 h-3" />
                                        {formatDate(project.time)}
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <HardDrive className="w-3 h-3" />
                                        {formatSize(project.size)}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-[2rem] overflow-hidden shadow-2xl">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-white/5 bg-white/[0.02]">
                                <th className="px-6 py-4 text-xs font-bold text-zinc-400 uppercase tracking-wider">Preview</th>
                                <th className="px-6 py-4 text-xs font-bold text-zinc-400 uppercase tracking-wider">Name</th>
                                <th className="px-6 py-4 text-xs font-bold text-zinc-400 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-4 text-xs font-bold text-zinc-400 uppercase tracking-wider">Size</th>
                                <th className="px-6 py-4 text-xs font-bold text-zinc-400 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#27272a]">
                            {projects.map((project) => (
                                <tr key={project.name} className="hover:bg-[#27272a]/20 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="w-16 h-10 bg-black rounded flex items-center justify-center overflow-hidden border border-[#27272a]">
                                            <img src={project.url} alt="" className="max-w-full max-h-full object-contain" />
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm font-bold text-white truncate max-w-[200px]" title={project.name}>
                                            {project.name}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-xs text-zinc-400">{formatDate(project.time)}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-xs text-zinc-400">{formatSize(project.size)}</div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button 
                                                onClick={() => onEditAgain(project)}
                                                className="p-2 text-zinc-400 hover:text-white hover:bg-violet-600 rounded-lg transition-all"
                                                title="Edit Again"
                                            >
                                                <ExternalLink className="w-4 h-4" />
                                            </button>
                                            <button 
                                                onClick={() => handleProjectDownload(project.url, project.name)}
                                                className="p-2 text-zinc-400 hover:text-white hover:bg-green-600 rounded-lg transition-all"
                                                title="Download"
                                            >
                                                <Download className="w-4 h-4" />
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(project.name)}
                                                className="p-2 text-zinc-400 hover:text-white hover:bg-red-600 rounded-lg transition-all"
                                                title="Delete"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default MyProjects;
