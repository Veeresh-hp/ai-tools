import { useState } from 'react';
import axios from 'axios';
import { Download, Link as LinkIcon, AlertCircle, Loader2, CheckCircle2, History, Trash2, HelpCircle, Flag } from 'lucide-react';
import FreepikInstructions from './FreepikInstructions';
import ReportModal from '../ReportModal';

const STUDIO_API_BASE = process.env.NODE_ENV === 'production'
    ? (process.env.REACT_APP_STUDIO_API_URL || 'https://aitools-backend-kh4a.onrender.com')
    : 'http://localhost:8000';

const FreepikDownloader = () => {
    const [url, setUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);
    const [showInstructions, setShowInstructions] = useState(false);
    const [isReportModalOpen, setIsReportModalOpen] = useState(false);

    // Tool info for the report modal
    const toolInfo = { _id: 'freepik-downloader', name: 'Freepik Downloader' };
    
    // Load history from local storage
    const [history, setHistory] = useState(() => {
        try {
            const saved = localStorage.getItem('freepik_history');
            return saved ? JSON.parse(saved) : [];
        } catch (e) {
            return [];
        }
    });

    const saveToHistory = (item) => {
        const newHistory = [item, ...history.filter(h => h.original_url !== item.original_url)].slice(0, 10);
        setHistory(newHistory);
        localStorage.setItem('freepik_history', JSON.stringify(newHistory));
    };

    const clearHistory = () => {
        setHistory([]);
        localStorage.removeItem('freepik_history');
    };

    const handleProcess = async () => {
        if (!url || !url.includes('freepik.com')) {
            setError('Please enter a valid Freepik URL.');
            return;
        }

        setLoading(true);
        setError(null);
        setResult(null);

        try {
            const response = await axios.post(`${STUDIO_API_BASE}/api/freepik`, { url });

            if (response.data.error) {
                setError(response.data.error);
            } else {
                const resultData = {
                    ...response.data,
                    download_url: `${STUDIO_API_BASE}${response.data.download_url}`,
                    timestamp: Date.now()
                };
                setResult(resultData);
                saveToHistory(resultData);
            }
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to process URL. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleDownload = async (targetResult = result) => {
        if (!targetResult) return;
        try {
            // If it's a history item, the URL might need the base added if not already full
            let downloadUrl = targetResult.download_url;
            if (downloadUrl.startsWith('/') && !downloadUrl.startsWith('http')) {
                downloadUrl = `${STUDIO_API_BASE}${downloadUrl}`;
            }

            const response = await fetch(downloadUrl);
            const blob = await response.blob();
            const urlBlob = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = urlBlob;
            link.download = targetResult.filename || `freepik_${Date.now()}.jpg`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(urlBlob);
        } catch (err) {
            console.error("Download failed:", err);
            setError("Failed to download image. The link might have expired.");
        }
    };

    const handlePaste = async () => {
        try {
            const text = await navigator.clipboard.readText();
            setUrl(text);
        } catch (err) {
            console.error('Failed to read clipboard', err);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-12">
            {/* Input Section */}
            <div className="bg-[#18181b] p-6 md:p-12 rounded-[2.5rem] border border-[#27272a] shadow-2xl relative overflow-hidden group">
                 {/* Background Glow */}
                 <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

                <div className="relative z-10">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8 text-center md:text-left">
                        <div className="flex items-center gap-6">
                            <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg shadow-green-500/20">
                                <Download className="w-6 h-6 md:w-8 md:h-8 text-white" />
                            </div>
                            <div>
                                <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">Freepik Downloader</h2>
                                <p className="text-zinc-400 text-lg">Paste a Premium link to unlock the full-resolution image instantly.</p>
                            </div>
                        </div>
                        
                        {/* Help Trigger */}
                        <button 
                            onClick={() => setShowInstructions(true)}
                            className="group flex items-center gap-2 px-4 py-2 bg-[#27272a] hover:bg-[#3f3f46] rounded-full border border-white/5 transition-all"
                        >
                            <HelpCircle className="w-5 h-5 text-[#00DC82] group-hover:scale-110 transition-transform" />
                            <span className="text-sm font-bold text-white">How to use?</span>
                        </button>
                    </div>

                    <div className="flex flex-col md:flex-row gap-4 pt-4 md:pt-0">
                        <div className="relative flex-1 group/input">
                            <LinkIcon className={`absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 transition-colors ${url.includes('freepik') ? 'text-green-500' : 'text-zinc-500'}`} />
                            <input
                                type="text"
                                value={url}
                                onChange={(e) => setUrl(e.target.value)}
                                placeholder="Paste your Freepik link here..."
                                className={`w-full bg-[#09090b] border text-white rounded-2xl py-5 pl-14 pr-20 text-lg focus:outline-none transition-all placeholder:text-zinc-600 ${
                                    url.includes('freepik') 
                                    ? 'border-green-500/50 shadow-[0_0_20px_rgba(34,197,94,0.1)]' 
                                    : 'border-[#3f3f46] focus:border-green-500'
                                }`}
                            />
                             <button 
                                onClick={handlePaste}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold bg-[#27272a] hover:bg-[#3f3f46] text-zinc-300 px-3 py-1.5 rounded-lg transition-colors border border-white/5"
                            >
                                PASTE
                            </button>
                        </div>
                        <button
                            onClick={handleProcess}
                            disabled={loading || !url}
                            className="bg-green-600 hover:bg-green-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 px-6 md:py-4 md:px-10 rounded-2xl shadow-xl shadow-green-600/20 transition-all flex items-center justify-center gap-3 transform hover:scale-[1.02] active:scale-[0.98]"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-6 h-6 animate-spin" /> Starting...
                                </>
                            ) : (
                                <>
                                    Download <span className="hidden md:inline">Now</span>
                                </>
                            )}
                        </button>
                    </div>

                    {error && (
                        <div className="mt-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3 text-red-400 animate-fade-in">
                            <AlertCircle className="w-6 h-6 shrink-0" />
                            <p className="font-medium">{error}</p>
                        </div>
                    )}
                </div>
                </div>


            {/* Instructions Modal Overlay */}
            {showInstructions && (
                <div className="fixed inset-0 z-50 flex justify-center p-4 bg-black/95 backdrop-blur-sm overflow-y-auto" onClick={(e) => {
                       if(e.target === e.currentTarget) setShowInstructions(false)
                    }}>
                    <div className="w-full relative">
                        <FreepikInstructions onClose={() => setShowInstructions(false)} />
                    </div>
                </div>
            )}

            {/* Loading State Overlay */}
            {loading && (
                 <div className="text-center py-12 animate-fade-in">
                    <div className="w-20 h-20 border-4 border-[#27272a] border-t-green-500 rounded-full animate-spin mx-auto mb-6 shadow-2xl shadow-green-500/10"></div>
                    <h3 className="text-2xl font-bold text-white mb-2">Extracting High-Quality Image...</h3>
                    <p className="text-zinc-500 max-w-md mx-auto">This may take a few seconds as we bypass the security.</p>
                </div>
            )}

            {/* Result Section */}
            {result && !loading && (
                <div className="bg-[#18181b] rounded-[2.5rem] overflow-hidden border border-[#27272a] shadow-2xl animate-fade-in-up md:flex">
                    <div className="relative h-64 md:h-auto md:w-1/2 bg-[#09090b] flex items-center justify-center p-8 border-b md:border-b-0 md:border-r border-[#27272a]">
                         {/* Checkered pattern for transparent images */}
                         <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: `linear-gradient(45deg, #333 25%, transparent 25%), linear-gradient(-45deg, #333 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #333 75%), linear-gradient(-45deg, transparent 75%, #333 75%)`, backgroundSize: '20px 20px', backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px' }}></div>
                         
                         <img 
                            src={result.download_url} 
                            alt="Downloaded Content" 
                            className="relative z-10 max-h-full max-w-full rounded-lg shadow-2xl object-contain hover:scale-105 transition-transform duration-500"
                        />
                    </div>
                    
                    <div className="p-6 md:p-12 md:w-1/2 flex flex-col justify-center bg-gradient-to-br from-[#18181b] to-[#121215]">
                        <div className="mb-8">
                            <div className="inline-flex items-center gap-2 bg-green-500/10 text-green-400 px-4 py-2 rounded-full font-bold text-sm mb-4 border border-green-500/20">
                                <CheckCircle2 className="w-4 h-4" /> Download Ready
                            </div>
                            <h3 className="text-3xl font-bold text-white mb-2 break-all line-clamp-2" title={result.filename}>
                                {result.filename.length > 30 ? result.filename.substring(0, 30) + '...' : result.filename}
                            </h3>
                            <p className="text-zinc-500">Full Resolution • No Watermark</p>
                        </div>

                        <div className="space-y-4">
                            <button 
                                onClick={() => handleDownload(result)}
                                className="w-full bg-white hover:bg-zinc-200 text-black font-bold py-4 px-6 rounded-2xl flex items-center justify-center gap-3 transition-all shadow-lg transform hover:-translate-y-1"
                            >
                                <Download className="w-6 h-6 shrink-0" /> Save to Device
                            </button>
                            <button 
                                onClick={() => { setResult(null); setUrl(''); }}
                                className="w-full bg-[#27272a] hover:bg-[#3f3f46] text-white font-bold py-4 px-6 rounded-2xl transition-colors border border-white/5"
                            >
                                Download Another
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Recent History */}
            {history.length > 0 && (
                <div className="animate-fade-in">
                    <div className="flex items-center justify-between mb-6 px-2">
                        <h3 className="text-xl font-bold text-white flex items-center gap-2">
                            <History className="w-5 h-5 text-zinc-500" /> Recent Downloads
                        </h3>
                        <button onClick={clearHistory} className="flex items-center gap-1 text-xs text-red-400 hover:text-red-300 transition-colors bg-red-500/10 px-3 py-1.5 rounded-lg border border-red-500/20">
                            <Trash2 className="w-3 h-3" /> Clear History
                        </button>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {history.map((item, index) => (
                            <div key={index} className="bg-[#18181b] border border-[#27272a] rounded-2xl overflow-hidden group hover:border-zinc-600 transition-colors">
                                <div className="h-32 bg-[#09090b] relative overflow-hidden">
                                    <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: `linear-gradient(45deg, #333 25%, transparent 25%), linear-gradient(-45deg, #333 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #333 75%), linear-gradient(-45deg, transparent 75%, #333 75%)`, backgroundSize: '10px 10px', backgroundPosition: '0 0, 0 5px, 5px -5px, -5px 0px' }}></div>
                                    <img 
                                        src={item.download_url.startsWith('/') && !item.download_url.startsWith('http') ? `${STUDIO_API_BASE}${item.download_url}` : item.download_url} 
                                        alt={item.filename}
                                        className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity"
                                    />
                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 backdrop-blur-sm">
                                        <button 
                                            onClick={() => handleDownload(item)} 
                                            className="bg-white text-black p-2 rounded-full shadow-lg hover:scale-110 transition-transform"
                                            title="Download Again"
                                        >
                                            <Download className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                                <div className="p-3">
                                    <p className="text-xs text-zinc-400 truncate font-medium" title={item.filename}>{item.filename}</p>
                                    <p className="text-[10px] text-zinc-600 mt-1">{new Date(item.timestamp).toLocaleDateString()}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
            
            {/* Report Issue Button */}
            <div className="flex justify-center pb-8">
                <button
                    onClick={() => setIsReportModalOpen(true)}
                    className="flex items-center gap-2 text-zinc-200 hover:text-white transition-colors text-sm font-medium bg-white/10 hover:bg-white/20 px-4 py-2 rounded-full border border-white/10 hover:border-white/20 shadow-lg shadow-black/20"
                >
                    <Flag className="w-4 h-4" /> Report Issue
                </button>
            </div>

            {/* Report Modal */}
            <ReportModal 
                isOpen={isReportModalOpen} 
                onClose={() => setIsReportModalOpen(false)} 
                tool={toolInfo}
            />
        </div>
    );
};

export default FreepikDownloader;
