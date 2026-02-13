import { useState } from 'react';
import { ReactCompareSlider, ReactCompareSliderImage } from 'react-compare-slider';
import { Upload, X, Download, RotateCcw, Sparkles, Layers, AlertCircle, Flag } from 'lucide-react';
import axios from 'axios';
import ReportModal from '../ReportModal';

const STUDIO_API_BASE = process.env.NODE_ENV === 'production'
    ? (process.env.REACT_APP_STUDIO_API_URL || 'https://aitools-backend-kh4a.onrender.com')
    : 'http://localhost:8000';

const BackgroundRemover = () => {
    const [file, setFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [result, setResult] = useState(null); // { original_url, cleaned_url }
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isReportModalOpen, setIsReportModalOpen] = useState(false);

    // Tool info for report modal
    const toolInfo = { _id: 'background-remover', name: 'Background Remover' };

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
        <div className="relative min-h-[80vh] w-full overflow-hidden rounded-[2.5rem] bg-[#09090b]/40 backdrop-blur-sm isolate">
            
            {/* Background Effects */}
            <div className="absolute inset-0 z-0">
                 {/* Transparency Grid (Subtle Texture) - Kept for context */}
                <div 
                    className="absolute inset-0 opacity-[0.05]"
                    style={{
                        backgroundImage: `linear-gradient(45deg, #808080 25%, transparent 25%), 
                                        linear-gradient(-45deg, #808080 25%, transparent 25%), 
                                        linear-gradient(45deg, transparent 75%, #808080 75%), 
                                        linear-gradient(-45deg, transparent 75%, #808080 75%)`,
                        backgroundSize: '20px 20px',
                        backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px'
                    }}
                />
            </div>

            {/* Main Content Container (z-10 to stay above background) */}
            <div className="relative z-10 max-w-6xl mx-auto p-8 space-y-12 animate-fade-in">
                
                {/* Header Section Removed to avoid duplication with MagicStudio.jsx */}

                {/* Split Layout: Example (Left) & Input (Right) */}
                {!result && !loading && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                        
                        {/* LEFT COLUMN: Professional Example */}
                        {/* Order-2 on mobile (below upload), Order-1 on desktop (left) */}
                        <div className="order-2 md:order-1 space-y-6">
                            <div className="text-center md:text-left h-24 flex flex-col justify-end pb-2">
                                <div>
                                    <span className="bg-violet-500/10 text-violet-400 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2 inline-block">Professional Quality</span>
                                    <h3 className="text-3xl font-bold text-white mb-1">See the Difference</h3>
                                    <p className="text-zinc-400 text-sm">Drag the slider to compare original vs processed image.</p>
                                </div>
                            </div>
                            
                            <div className="bg-[#18181b] border border-[#27272a] rounded-[2.5rem] overflow-hidden shadow-2xl h-[350px] relative group mx-auto md:mx-0 w-full hover:shadow-violet-500/10 transition-shadow duration-500">
                                <ReactCompareSlider
                                    itemOne={<ReactCompareSliderImage src={require('../../assets/example_original.jpg')} alt="Original" className="object-cover w-full h-full" />}
                                    itemTwo={<ReactCompareSliderImage src={require('../../assets/example_removed.png')} alt="Result" className="object-cover w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] bg-repeat" />}
                                    style={{ width: '100%', height: '100%' }}
                                />
                                <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-lg text-xs font-bold border border-white/10 text-white pointer-events-none">Original</div>
                                <div className="absolute top-4 right-4 bg-violet-600/80 backdrop-blur-md px-3 py-1 rounded-lg text-xs font-bold border border-white/10 text-white pointer-events-none">Clean Cutout</div>
                                
                                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 backdrop-blur-sm px-4 py-2 rounded-full text-xs text-zinc-300 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
                                    Drag slider to compare
                                </div>
                            </div>
                        </div>

                        {/* RIGHT COLUMN: Upload / Preview */}
                        <div className="order-1 md:order-2 space-y-6">
                             
                            {/* Header - Matches Left Column Height/Style */}
                            <div className="text-center md:text-left h-24 flex flex-col justify-end pb-2">
                                 <div>
                                    <span className="bg-white/10 text-zinc-300 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2 inline-block">Free Tool</span>
                                    <h3 className="text-3xl font-bold text-white mb-1">Upload Image</h3>
                                    <p className="text-zinc-400 text-sm">Supported formats: JPG, PNG, WEBP</p>
                                 </div>
                            </div>

                            {!file ? (
                                 <div 
                                    className="bg-white/5 border-2 border-dashed border-white/10 rounded-[2.5rem] p-10 text-center hover:border-violet-500/50 transition-all cursor-pointer group relative overflow-hidden h-[350px] flex flex-col justify-center items-center backdrop-blur-sm hover:bg-white/10"
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
                                        <div className="mb-6 inline-flex p-4 rounded-2xl bg-violet-500/10 group-hover:bg-violet-500/20 transition-colors shadow-inner ring-1 ring-violet-500/20">
                                            <Upload className="w-10 h-10 text-violet-400" />
                                        </div>
                                        
                                        <h3 className="text-xl font-bold text-white mb-2">
                                            Drop image here
                                        </h3>
                                        <p className="text-zinc-500 text-sm mb-6 px-4">or click to browse</p>
                                        <button className="bg-violet-600 hover:bg-violet-700 text-white px-6 py-2 rounded-full font-bold transition-all transform hover:scale-105 shadow-lg shadow-violet-500/20 text-sm flex items-center gap-2 mx-auto">
                                            <Sparkles className="w-4 h-4" /> Select Photo
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-[2.5rem] p-4 animate-fade-in shadow-2xl overflow-hidden relative group">
                                        <div className="aspect-video relative rounded-2xl overflow-hidden bg-black/40 border border-white/5 shadow-inner flex items-center justify-center">
                                             <img src={previewUrl} alt="Original" className="max-w-full max-h-full object-contain" />
                                             <button 
                                                onClick={reset}
                                                className="absolute top-4 right-4 p-2 bg-black/60 hover:bg-red-500 text-white rounded-full backdrop-blur-md transition-all border border-white/10 shadow-lg opacity-0 group-hover:opacity-100"
                                             >
                                                <X className="w-5 h-5" />
                                             </button>
                                        </div>
                                    </div>

                                    <div className="flex justify-center">
                                        <button
                                            onClick={handleRemoveBackground}
                                            className="w-full bg-violet-600 hover:bg-violet-700 text-white font-bold py-4 px-12 rounded-2xl flex items-center justify-center gap-2 shadow-2xl shadow-violet-600/30 transition-all transform hover:scale-105 active:scale-95"
                                        >
                                            <Sparkles className="w-6 h-6" /> Remove Background
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                    </div>
                )}

                {/* Loading State */}
                {loading && (
                    <div className="text-center py-32 bg-[#18181b]/50 backdrop-blur-md border border-[#27272a] rounded-[2.5rem] shadow-2xl relative overflow-hidden">
                        <div className="absolute inset-0 bg-violet-500/5 animate-pulse"></div>
                        <div className="relative z-10">
                            <div className="w-24 h-24 border-4 border-white/5 border-t-violet-500 rounded-full animate-spin mx-auto mb-8 shadow-2xl shadow-violet-500/20"></div>
                            <h3 className="text-3xl font-bold text-white mb-2">Analyzing Pixels...</h3>
                            <p className="text-zinc-500">AI is performing high-accuracy matting and edge refinement.</p>
                        </div>
                    </div>
                )}

                {/* Result View */}
                {result && (
                    <div className="space-y-8 animate-fade-in">
                        <div className="bg-[#18181b]/80 backdrop-blur-xl border border-[#27272a] rounded-[2.5rem] overflow-hidden shadow-2xl h-[600px] relative">
                            <ReactCompareSlider
                                key={result.timestamp}
                                itemOne={<ReactCompareSliderImage src={`${result.original_url}?t=${result.timestamp}`} alt="Original" className="object-contain" />}
                                itemTwo={<ReactCompareSliderImage src={`${result.cleaned_url}?t=${result.timestamp}`} alt="Transparent" className="object-contain bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] bg-repeat" />}
                                style={{ width: '100%', height: '100%' }}
                            />
                            <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-lg text-xs font-bold border border-white/10 text-white shadow-lg">Original</div>
                            <div className="absolute top-4 right-4 bg-violet-600/80 backdrop-blur-md px-3 py-1 rounded-lg text-xs font-bold border border-white/10 text-white shadow-lg">Cleaned PNG</div>
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
                                className="bg-white/5 hover:bg-white/10 text-white font-bold py-4 px-10 rounded-2xl flex items-center gap-2 border border-white/10 transition-all transform hover:scale-105 backdrop-blur-sm"
                            >
                                <RotateCcw className="w-6 h-6" /> Start New
                            </button>
                        </div>
                    </div>
                )}

                 {/* Features Info */}
                 {!loading && !result && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8">
                        <div className="p-6 bg-[#18181b]/40 backdrop-blur-sm rounded-3xl border border-[#27272a] hover:bg-[#18181b]/60 transition-colors">
                            <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-4 text-blue-400">
                                <Layers className="w-6 h-6" />
                            </div>
                            <h4 className="text-white font-bold mb-2">Fine Matting</h4>
                            <p className="text-zinc-500 text-sm leading-relaxed">AI analyzes hair, fur, and complex edges for a perfect cutout every time.</p>
                        </div>
                        <div className="p-6 bg-[#18181b]/40 backdrop-blur-sm rounded-3xl border border-[#27272a] hover:bg-[#18181b]/60 transition-colors">
                            <div className="w-12 h-12 bg-green-500/10 rounded-2xl flex items-center justify-center mb-4 text-green-400">
                                <Download className="w-6 h-6" />
                            </div>
                            <h4 className="text-white font-bold mb-2">HD Exports</h4>
                            <p className="text-zinc-500 text-sm leading-relaxed">Download your results as high-quality transparent PNGs at full resolution.</p>
                        </div>
                        <div className="p-6 bg-[#18181b]/40 backdrop-blur-sm rounded-3xl border border-[#27272a] hover:bg-[#18181b]/60 transition-colors">
                            <div className="w-12 h-12 bg-amber-500/10 rounded-2xl flex items-center justify-center mb-4 text-amber-400">
                                <Sparkles className="w-6 h-6" />
                            </div>
                            <h4 className="text-white font-bold mb-2">One-Click</h4>
                            <p className="text-zinc-500 text-sm leading-relaxed">No manual selection required. The AI automatically detects your main subject.</p>
                        </div>
                    </div>
                 )}

                 {/* Error Message */}
                 {error && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-200 p-6 rounded-2xl flex items-center gap-4 mt-8 animate-fade-in relative z-20 backdrop-blur-md">
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
                
                {/* Report Issue Button */}
                <div className="flex justify-center pt-8">
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
        </div>
    );
};

export default BackgroundRemover;
