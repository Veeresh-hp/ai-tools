import React, { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { Share2, Lock, Globe, Edit3, Trash2, ArrowLeft, Layers } from 'lucide-react';
import api from '../utils/api';
import ToolCard from './ToolCard';
import toolsData from '../data/toolsData';

const StackDetail = () => {
    const { slug } = useParams();
    const history = useHistory();
    const [stack, setStack] = useState(null);
    const [hydratedTools, setHydratedTools] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isOwner, setIsOwner] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState({});

    // Fetch Stack Data
    useEffect(() => {
        const fetchStack = async () => {
             try {
                 // Try fetching using auth token first to check ownership
                 const token = localStorage.getItem('token');
                 const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
                 
                 const res = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/stacks/${slug}`, { headers });
                 
                 if (!res.ok) throw new Error('Stack not found or private');
                 const data = await res.json();
                 setStack(data);
                 setEditForm({ name: data.name, description: data.description, isPublic: data.isPublic });

                 // Check ownership
                 const currentUser = localStorage.getItem('username'); // Simple check, ideally compare IDs
                 if (data.user && data.user.username === currentUser) {
                     setIsOwner(true);
                 } else {
                    // Fallback ID check if username mismatches due to updates
                    // Note: Ideally we decode token payload, but this is a decent heuristic for now
                    // We can also check a specific "isOwner" flag from backend if we added it
                 }

                 // Hydrate Tools
                 // 1. Get all local tools
                 const allLocal = toolsData.flatMap(c => c.tools.map(t => ({...t, category: t.category || c.id})));
                 
                 // 2. Map stack tool IDs/Names to actual objects
                 // Note: stack.tools contains strings (names or IDs)
                 const tools = data.tools.map(item => {
                     // Try finding by ID
                     let found = allLocal.find(t => t.id === item || t.name === item);
                     if (found) return found;

                     // Try Case-Insensitive Name Match
                     found = allLocal.find(t => t.name && t.name.toLowerCase() === (item || '').toLowerCase());
                     if (found) return found;
                     
                     // Fallback: If not found in local data, create a partial object
                     // This ensures the tool count matches the visual list
                     const pseudoPricing = ['Free', 'Paid', 'Freemium'][item.length % 3];
                     return {
                        id: item, // Use the stored string as ID
                        name: item,
                        description: item.startsWith('http') ? 'External Link' : 'Custom saved tool',
                        url: item.startsWith('http') ? item : '#',
                        image: item.startsWith('http') ? `https://image.thum.io/get/width/400/crop/400/noanimate/${item}` : null,
                        category: 'saved',
                        pricing: pseudoPricing,
                        isFallback: true
                     };
                 }).filter(Boolean);
                 
                 // Fetch live tools if needed? For now rely on local
                 setHydratedTools(tools);

             } catch (err) {
                 console.error(err);
                 // history.push('/stacks'); // Don't redirect immediately in case it's just loading
             } finally {
                 setLoading(false);
             }
        };
        fetchStack();
    }, [slug, history]);

    const handleUpdate = async () => {
        try {
            const res = await api.put(`/api/stacks/${stack._id}`, editForm);
            setStack(res.data);
            setIsEditing(false);
        } catch (err) {
            alert('Failed to update stack');
        }
    };

    const handleRemoveTool = async (toolIdentifier) => {
        if (!window.confirm('Remove from stack?')) return;
        const newTools = stack.tools.filter(t => t !== toolIdentifier);
        try {
             await api.put(`/api/stacks/${stack._id}`, { tools: newTools });
             // Optimistic update
             setStack(prev => ({ ...prev, tools: newTools }));
             // Re-hydrate logic implies removing from current view
             // Simplest: filter hydrated
             // We need to know which hydrated tool corresponds to the identifier.
             // If we used the tool object to indentify...
             // Let's reload page or filter hydrated list
             window.location.reload(); 
        } catch (err) {
            console.error(err);
        }
    };

    const handleClone = async () => {
        if (!window.confirm(`Clone "${stack.name}" to your stacks?`)) return;
        try {
            const res = await api.post(`/api/stacks/${stack._id}/clone`);
            history.push(`/stack/${res.data.slug}`);
            alert('Stack cloned successfully!');
        } catch (err) {
            alert(err.response?.data?.error || 'Failed to clone stack');
        }
    };

    const copyLink = () => {
        const url = window.location.href;
        navigator.clipboard.writeText(url);
        alert('Link copied to clipboard!');
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 rounded-full border-2 border-white/20 border-t-blue-500 animate-spin" /></div>;
    if (!stack) return <div className="min-h-screen pt-32 text-center text-white">Stack not found or private.</div>;

    return (
        <div className="min-h-screen pt-24 pb-12 px-4">
             {/* Background */}
             <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-blue-900/10 to-transparent" />
             </div>

            <div className="max-w-7xl mx-auto relative z-10">
                <button onClick={() => history.push('/stacks')} className="flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors">
                    <ArrowLeft size={16} /> Back to Stacks
                </button>

                {/* Header Card */}
                <div className="bg-[#0A0A0A] border border-white/10 rounded-3xl p-8 mb-12 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-20 hidden md:block">
                        <Share2 size={120} />
                    </div>

                    {!isEditing ? (
                        <>
                            <div className="flex flex-wrap items-start justify-between gap-6 relative z-10">
                                <div>
                                    <div className="flex items-center gap-4 mb-2">
                                        <h1 className="text-4xl md:text-5xl font-black text-white">{stack.name}</h1>
                                        {stack.isPublic ? <Globe size={20} className="text-green-400" /> : <Lock size={20} className="text-gray-400" />}
                                    </div>
                                    <p className="text-gray-400 text-lg max-w-2xl leading-relaxed">{stack.description || "A curated collection of AI tools."}</p>
                                    
                                    <div className="flex items-center gap-4 mt-6">
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-xs font-bold text-white uppercase">
                                                {stack.user?.username?.[0] || 'U'}
                                            </div>
                                            <span className="text-sm text-gray-300">Curated by <span className="text-white font-bold">{stack.user?.username || 'Unknown'}</span></span>
                                        </div>
                                        <div className="w-1 h-1 bg-gray-600 rounded-full" />
                                        <span className="text-sm text-gray-500">{new Date(stack.updatedAt).toLocaleDateString()}</span>
                                    </div>
                                </div>

                                <div className="flex gap-3">
                                    <button onClick={copyLink} className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 text-white flex items-center gap-2 transition-colors">
                                        <Share2 size={18} /> Share
                                    </button>
                                    {isOwner ? (
                                        <button onClick={() => setIsEditing(true)} className="px-4 py-2 bg-blue-600 rounded-xl text-white flex items-center gap-2 hover:bg-blue-500 transition-colors">
                                            <Edit3 size={18} /> Edit
                                        </button>
                                    ) : (
                                        <button onClick={handleClone} className="px-4 py-2 bg-purple-600 rounded-xl text-white flex items-center gap-2 hover:bg-purple-500 transition-colors shadow-lg shadow-purple-500/20">
                                            <Layers size={18} /> Clone Stack
                                        </button>
                                    )}
                                </div>
                            </div>
                        </>
                    ) : (
                        /* Edit Mode */
                        <div className="max-w-2xl relative z-10">
                             <div className="space-y-4">
                                <input 
                                    className="w-full bg-black/50 border border-white/10 rounded-xl p-4 text-2xl font-bold text-white"
                                    value={editForm.name}
                                    onChange={e => setEditForm({...editForm, name: e.target.value})}
                                />
                                <textarea 
                                    className="w-full bg-black/50 border border-white/10 rounded-xl p-4 text-white resize-none h-32"
                                    value={editForm.description}
                                    onChange={e => setEditForm({...editForm, description: e.target.value})}
                                    placeholder="Add a description..."
                                />
                                <div className="flex gap-4">
                                    <label className="flex items-center gap-2 cursor-pointer text-gray-300">
                                        <input type="checkbox" checked={editForm.isPublic} onChange={e => setEditForm({...editForm, isPublic: e.target.checked})} className="accent-blue-500" />
                                        Public Visibility
                                    </label>
                                </div>
                                <div className="flex gap-3 pt-4">
                                    <button onClick={() => setIsEditing(false)} className="px-4 py-2 text-gray-400">Cancel</button>
                                    <button onClick={handleUpdate} className="px-6 py-2 bg-green-600 text-white font-bold rounded-lg hover:bg-green-500">Save Changes</button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Tools Grid */}
                <h2 className="text-2xl font-bold text-white mb-6">Included Tools ({hydratedTools.length})</h2>
                {hydratedTools.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {hydratedTools.map((tool, idx) => (
                            <div key={idx} className="relative group">
                                <ToolCard tool={tool} />
                                {isOwner && (
                                    <button 
                                        onClick={() => handleRemoveTool(tool.id || tool.name)}
                                        className="absolute -top-2 -right-2 bg-red-600 text-white p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-20 hover:scale-110"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 border border-dashed border-white/10 rounded-3xl">
                        <p className="text-gray-500">No tools in this stack yet.</p>
                        {isOwner && <p className="text-blue-400 mt-2">Go explore tools and click "Add to Stack"!</p>}
                    </div>
                )}
            </div>
        </div>
    );
};

export default StackDetail;
