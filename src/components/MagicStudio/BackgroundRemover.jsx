import { useState } from 'react';
import { ReactCompareSlider, ReactCompareSliderImage } from 'react-compare-slider';
import { Upload, X, Download, RotateCcw, Sparkles, Layers, AlertCircle } from 'lucide-react';
import axios from 'axios';

const STUDIO_API_BASE = process.env.NODE_ENV === 'production'
    ? (process.env.REACT_APP_STUDIO_API_URL || 'https://your-studio-backend.onrender.com')
    : 'http://localhost:8000';

const BackgroundRemover = () => {
    const [file, setFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [result, setResult] = useState(null); // { original_url, cleaned_url }
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleFileChange = (selectedFile) => {
        if (!selectedFile) return;
        if (!selectedFile.type.startsWith('image/')) {
            setError("Please upload a valid image file.");
            return;
        }

        setFile(selectedFile);
        setPreviewUrl(URL.createObjectURL(selectedFile));
        setResult(null);
        setError(null);
    };

    const handleRemoveBackground = async () => {
        if (!file) return;

        setLoading(true);
        setError(null);

        try {
            const formData = new FormData();
            formData.append('image', file);

            const response = await axios.post(`${STUDIO_API_BASE}/api/remove-bg`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            if (response.data.error) throw new Error(response.data.error);

            setResult({
                original_url: `${STUDIO_API_BASE}${response.data.original_url}`,
                cleaned_url: `${STUDIO_API_BASE}${response.data.cleaned_url}`,
                timestamp: Date.now()
            });
        } catch (err) {
            setError(err.response?.data?.error || err.message || "Failed to remove background.");
        } finally {
            setLoading(false);
        }
    };

    const reset = () => {
        setFile(null);
        setPreviewUrl(null);
        setResult(null);
        setError(null);
    };

    const handleDownload = async () => {
        if (!result) return;
        try {
            const response = await fetch(result.cleaned_url);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = result.filename || 'background_removed.png';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (err) {
            console.error("Download failed:", err);
            setError("Failed to download image. Please try again.");
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-fade-in relative">
            
            {/* Upload Area */}
            {!file && !loading && (
                <div 
                    className="bg-white/5 border-2 border-dashed border-white/10 rounded-[2.5rem] p-16 text-center hover:border-violet-500/50 transition-all cursor-pointer group relative overflow-hidden"
                    onClick={() => document.getElementById('bg-upload').click()}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                        e.preventDefault();
                        if (e.dataTransfer.files.length) handleFileChange(e.dataTransfer.files[0]);
                    }}
                >
                    <input 
                        type="file" 
                        id="bg-upload" 
                        className="hidden" 
                        accept="image/*"
                        onChange={(e) => e.target.files.length && handleFileChange(e.target.files[0])}
                    />
                    
                    <div className="relative z-10">
                        <div className="mb-6 inline-flex p-4 rounded-2xl bg-white/5 group-hover:bg-violet-500/10 transition-colors">
                            <Upload className="w-10 h-10 text-violet-400" />
                        </div>
                        
                        <h3 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-zinc-400 mb-2">
                            Drop image to remove background
                        </h3>
                        <p className="text-zinc-400 text-sm mb-8">Crystal clear cutouts in seconds</p>
                        <button className="bg-violet-600 hover:bg-violet-700 text-white px-8 py-3 rounded-full font-bold transition-all transform hover:scale-105 shadow-lg shadow-violet-500/20">
                            Select Photo
                        </button>
                    </div>

                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent to-violet-500/5 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
            )}

            {/* Processing / Preview State */}
            {file && !result && !loading && (
                <div className="space-y-6">
                    <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-[2.5rem] p-4 animate-fade-in shadow-2xl overflow-hidden relative">
                        <div className="aspect-video relative rounded-2xl overflow-hidden bg-black/40 border border-white/5 shadow-inner flex items-center justify-center">
                             <img src={previewUrl} alt="Original" className="max-w-full max-h-full object-contain" />
                             <button 
                                onClick={reset}
                                className="absolute top-4 right-4 p-2 bg-black/60 hover:bg-red-500 text-white rounded-full backdrop-blur-md transition-all border border-white/10 shadow-lg"
                             >
                                <X className="w-5 h-5" />
                             </button>
                        </div>
                    </div>

                    <div className="mt-8 flex justify-center">
                        <button
                            onClick={handleRemoveBackground}
                            className="bg-violet-600 hover:bg-violet-700 text-white font-bold py-4 px-12 rounded-2xl flex items-center gap-2 shadow-2xl shadow-violet-600/30 transition-all transform hover:scale-105 active:scale-95"
                        >
                            <Sparkles className="w-6 h-6" /> Remove Background
                        </button>
                    </div>
                </div>
            )}

            {/* Loading State */}
            {loading && (
                <div className="text-center py-24 bg-[#18181b] border border-[#27272a] rounded-3xl shadow-2xl">
                    <div className="w-24 h-24 border-4 border-white/5 border-t-violet-500 rounded-full animate-spin mx-auto mb-8 shadow-inner"></div>
                    <h3 className="text-3xl font-bold text-white mb-2">Analyzing Pixels...</h3>
                    <p className="text-zinc-500">AI is performing high-accuracy matting and edge refinement.</p>
                </div>
            )}

            {/* Result View */}
            {result && (
                <div className="space-y-8">
                    <div className="bg-[#18181b] border border-[#27272a] rounded-3xl overflow-hidden shadow-2xl h-[600px]">
                        <ReactCompareSlider
                            key={result.timestamp}
                            itemOne={<ReactCompareSliderImage src={`${result.original_url}?t=${result.timestamp}`} alt="Original" className="object-contain" />}
                            itemTwo={<ReactCompareSliderImage src={`${result.cleaned_url}?t=${result.timestamp}`} alt="Transparent" className="object-contain bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] bg-repeat" />}
                            style={{ width: '100%', height: '100%' }}
                        />
                        <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-lg text-xs font-bold border border-white/10 text-white">Original</div>
                        <div className="absolute top-4 right-4 bg-violet-600/80 backdrop-blur-md px-3 py-1 rounded-lg text-xs font-bold border border-white/10 text-white">Cleaned PNG</div>
                    </div>
                    
                    <div className="flex justify-center flex-wrap gap-4">
                        <button 
                            onClick={handleDownload}
                            className="bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-10 rounded-2xl flex items-center gap-2 shadow-xl shadow-green-600/20 transition-all transform hover:scale-105"
                        >
                            <Download className="w-6 h-6" /> Download PNG
                        </button>
                        <button 
                            onClick={reset}
                            className="bg-white/5 hover:bg-white/10 text-white font-bold py-4 px-10 rounded-2xl flex items-center gap-2 border border-white/10 transition-all transform hover:scale-105"
                        >
                            <RotateCcw className="w-6 h-6" /> Start New
                        </button>
                    </div>
                </div>
            )}

             {/* Features Info */}
             {!loading && !result && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8">
                    <div className="p-6 bg-[#18181b]/50 rounded-2xl border border-[#27272a]">
                        <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center mb-4 text-blue-400">
                            <Layers className="w-5 h-5" />
                        </div>
                        <h4 className="text-white font-bold mb-2 text-sm">Fine Matting</h4>
                        <p className="text-zinc-500 text-xs leading-relaxed">AI analyzes hair, fur, and complex edges for a perfect cutout every time.</p>
                    </div>
                    <div className="p-6 bg-[#18181b]/50 rounded-2xl border border-[#27272a]">
                        <div className="w-10 h-10 bg-green-500/10 rounded-xl flex items-center justify-center mb-4 text-green-400">
                            <Download className="w-5 h-5" />
                        </div>
                        <h4 className="text-white font-bold mb-2 text-sm">HD Exports</h4>
                        <p className="text-zinc-500 text-xs leading-relaxed">Download your results as high-quality transparent PNGs at full resolution.</p>
                    </div>
                    <div className="p-6 bg-[#18181b]/50 rounded-2xl border border-[#27272a]">
                        <div className="w-10 h-10 bg-amber-500/10 rounded-xl flex items-center justify-center mb-4 text-amber-400">
                            <Sparkles className="w-5 h-5" />
                        </div>
                        <h4 className="text-white font-bold mb-2 text-sm">One-Click</h4>
                        <p className="text-zinc-500 text-xs leading-relaxed">No manual selection required. The AI automatically detects your main subject.</p>
                    </div>
                </div>
             )}

             {/* Error Message */}
             {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-200 p-6 rounded-2xl flex items-center gap-4 mt-8 animate-fade-in relative z-20">
                    <AlertCircle className="w-6 h-6 text-red-500" />
                    <div className="flex-1">
                        <p className="font-bold">Oops! Something went wrong</p>
                        <p className="text-sm text-red-300/80">{error}</p>
                    </div>
                    <button onClick={() => setError(null)} className="p-2 hover:bg-white/5 rounded-lg transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>
            )}
        </div>
    );
};

export default BackgroundRemover;
