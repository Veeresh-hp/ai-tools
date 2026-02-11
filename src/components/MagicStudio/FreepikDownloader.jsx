import { useState } from 'react';
import axios from 'axios';
import { Download, Link as LinkIcon, AlertCircle, Loader2, CheckCircle2 } from 'lucide-react';

const STUDIO_API_BASE = process.env.NODE_ENV === 'production'
    ? (process.env.REACT_APP_STUDIO_API_URL || 'https://aitools-backend-kh4a.onrender.com')
    : 'http://localhost:8000';

const FreepikDownloader = () => {
    const [url, setUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);

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
                setResult({
                    ...response.data,
                    download_url: `${STUDIO_API_BASE}${response.data.download_url}`
                });
            }
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to process URL.');
        } finally {
            setLoading(false);
        }
    };

    // eslint-disable-next-line no-unused-vars
    const handleDownload = async () => {
        if (!result) return;
        try {
            const response = await fetch(result.download_url);
            const blob = await response.blob();
            const urlBlob = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = urlBlob;
            link.download = result.filename || `freepik_${Date.now()}.jpg`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(urlBlob);
        } catch (err) {
            console.error("Download failed:", err);
            setError("Failed to download image.");
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
        <div className="max-w-3xl mx-auto">
            {/* Input Section */}
            <div className="bg-[#18181b] p-8 rounded-3xl border border-[#27272a] shadow-xl mb-8">
                <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
                        <Download className="w-6 h-6 text-green-500" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-white">Freepik Downloader</h2>
                        <p className="text-zinc-400">Paste a Freepik premium URL to download the high-quality image.</p>
                    </div>
                </div>

                <div className="flex gap-4">
                    <div className="relative flex-1 group">
                        <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500 group-focus-within:text-green-500 transition-colors" />
                        <input
                            type="text"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            placeholder="https://www.freepik.com/premium-vector/..."
                            className="w-full bg-[#27272a] border border-[#3f3f46] text-white rounded-xl py-4 pl-12 pr-4 focus:outline-none focus:border-green-500 transition-all font-medium placeholder:text-zinc-600"
                        />
                         <button 
                            onClick={handlePaste}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-xs bg-[#3f3f46] hover:bg-[#52525b] text-zinc-300 px-2 py-1 rounded transition-colors"
                        >
                            Paste
                        </button>
                    </div>
                    <button
                        onClick={handleProcess}
                        disabled={loading || !url}
                        className="bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 px-8 rounded-xl shadow-lg shadow-green-600/20 transition-all flex items-center gap-2"
                    >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Download'}
                    </button>
                </div>

                {error && (
                    <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-400">
                        <AlertCircle className="w-5 h-5" />
                        {error}
                    </div>
                )}
            </div>

            {/* Result Section */}
            {loading && (
                 <div className="text-center py-20 animate-fade-in">
                    <div className="w-16 h-16 border-4 border-[#27272a] border-t-green-500 rounded-full animate-spin mx-auto mb-6"></div>
                    <h3 className="text-xl font-bold text-white">Extracting Image...</h3>
                    <p className="text-zinc-500 mt-2">Connecting to Freepik cloud...</p>
                </div>
            )}

            {result && (
                <div className="bg-[#18181b] rounded-3xl overflow-hidden border border-[#27272a] shadow-2xl animate-fade-in-up">
                    <div className="relative h-[400px] w-full bg-[#09090b] flex items-center justify-center p-8">
                         <img 
                            src={result.download_url} 
                            alt="Downloaded Content" 
                            className="max-h-full max-w-full rounded-lg shadow-2xl object-contain"
                        />
                    </div>
                    
                    <div className="p-6 bg-[#27272a]/50 border-t border-[#27272a] flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <CheckCircle2 className="w-6 h-6 text-green-500" />
                            <div>
                                <h3 className="font-bold text-white">Download Component</h3>
                                <p className="text-xs text-zinc-400 truncate max-w-[200px]">{result.filename}</p>
                            </div>
                        </div>

                        <button 
                            onClick={handleDownload}
                            className="bg-white text-black hover:bg-zinc-200 font-bold py-3 px-6 rounded-xl flex items-center gap-2 transition-all shadow-lg"
                        >
                            <Download className="w-5 h-5" /> Save to Device
                        </button>
                    </div>
                </div>
            )}

             {/* Steps Info */}
            {!result && !loading && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-[#18181b]/50 p-6 rounded-2xl border border-[#27272a]">
                        <div className="text-3xl mb-4">🔗</div>
                        <h3 className="font-bold text-white mb-2">1. Paste URL</h3>
                        <p className="text-sm text-zinc-500">Copy the link of any Premium Freepik image.</p>
                    </div>
                    <div className="bg-[#18181b]/50 p-6 rounded-2xl border border-[#27272a]">
                        <div className="text-3xl mb-4">⚡</div>
                        <h3 className="font-bold text-white mb-2">2. Processing</h3>
                        <p className="text-sm text-zinc-500">Our tool extracts the high-resolution source file.</p>
                    </div>
                    <div className="bg-[#18181b]/50 p-6 rounded-2xl border border-[#27272a]">
                        <div className="text-3xl mb-4">💾</div>
                        <h3 className="font-bold text-white mb-2">3. Download</h3>
                        <p className="text-sm text-zinc-500">Save the clean image directly to your device.</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FreepikDownloader;
