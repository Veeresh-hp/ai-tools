import { useState, useRef, useEffect } from 'react';
import { ReactCompareSlider, ReactCompareSliderImage } from 'react-compare-slider';
import { Upload, X, Zap, Sparkles, Download, RefreshCw, AlertCircle } from 'lucide-react';
import axios from 'axios';

const STUDIO_API_BASE = process.env.NODE_ENV === 'production'
    ? (process.env.REACT_APP_STUDIO_API_URL || 'https://your-studio-backend.onrender.com')
    : 'http://localhost:8000';

const ImageEnhancer = () => {
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [mode, setMode] = useState('fast');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null); // { original_url, enhanced_url }
    const [error, setError] = useState(null);
    const [timer, setTimer] = useState(0);
    
    const timerRef = useRef(null);
    const abortControllerRef = useRef(null);

    // Cleanup object URL on unmount or new file
    useEffect(() => {
        return () => {
            if (preview) URL.revokeObjectURL(preview);
        };
    }, [preview]);

    const handleFileChange = (selectedFile) => {
        if (!selectedFile) return;
        if (!selectedFile.type.startsWith('image/')) {
            setError("Please upload a valid image file.");
            return;
        }

        setFile(selectedFile);
        setPreview(URL.createObjectURL(selectedFile));
        setResult(null);
        setError(null);
    };

    const handleUpload = async () => {
        if (!file) return;

        setLoading(true);
        setError(null);
        setTimer(0);
        
        // Timer
        if (timerRef.current) clearInterval(timerRef.current);
        timerRef.current = setInterval(() => {
            setTimer(prev => prev + 1);
        }, 1000);

        // API Call
        const formData = new FormData();
        formData.append('file', file);
        formData.append('mode', mode);

        abortControllerRef.current = new AbortController();

        try {
            const response = await axios.post(`${STUDIO_API_BASE}/api/upload`, formData, {
                signal: abortControllerRef.current.signal,
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            setResult({
                original_url: `${STUDIO_API_BASE}${response.data.original_url}`,
                enhanced_url: `${STUDIO_API_BASE}${response.data.enhanced_url}`
            });
        } catch (err) {
            if (axios.isCancel(err)) {
                console.log('Request canceled');
            } else {
                setError(err.response?.data?.error || "An error occurred during enhancement.");
            }
        } finally {
            setLoading(false);
            clearInterval(timerRef.current);
        }
    };

    const handleCancel = () => {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }
        setLoading(false);
        clearInterval(timerRef.current);
    };

    const reset = () => {
        setFile(null);
        setPreview(null);
        setResult(null);
        setError(null);
        setLoading(false);
    };

    const handleDownload = async () => {
        if (!result) return;
        try {
            const response = await fetch(result.enhanced_url);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `enhanced_${Date.now()}.jpg`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (err) {
            console.error("Download failed:", err);
            setError("Failed to download image.");
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            {/* Mode Selection */}
            {!result && !loading && (
                <div className="grid grid-cols-2 gap-4 mb-8">
                    <button
                        onClick={() => setMode('fast')}
                        className={`p-4 rounded-xl border transition-all flex flex-col items-center gap-2 ${
                            mode === 'fast'
                                ? 'bg-blue-500/10 border-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.2)]'
                                : 'bg-white/5 border-white/10 hover:bg-white/10'
                        }`}
                    >
                        <Zap className={`w-8 h-8 ${mode === 'fast' ? 'text-blue-400' : 'text-slate-400'}`} />
                        <div className="text-center">
                            <h3 className={`font-bold ${mode === 'fast' ? 'text-blue-400' : 'text-white'}`}>Fast Mode</h3>
                            <p className="text-xs text-slate-400">Standard AI (FSRCNN) - Seconds</p>
                        </div>
                    </button>

                    <button
                        onClick={() => setMode('quality')}
                        className={`p-4 rounded-xl border transition-all flex flex-col items-center gap-2 ${
                            mode === 'quality'
                                ? 'bg-purple-500/10 border-purple-500 shadow-[0_0_20px_rgba(168,85,247,0.2)]'
                                : 'bg-white/5 border-white/10 hover:bg-white/10'
                        }`}
                    >
                        <Sparkles className={`w-8 h-8 ${mode === 'quality' ? 'text-purple-400' : 'text-slate-400'}`} />
                        <div className="text-center">
                            <h3 className={`font-bold ${mode === 'quality' ? 'text-purple-400' : 'text-white'}`}>Quality Mode</h3>
                            <p className="text-xs text-slate-400">Premium AI (EDSR) - Slower</p>
                        </div>
                    </button>
                </div>
            )}

            {/* Upload Area */}
            {!file && (
                <div
                    className="border-2 border-dashed border-[#3f3f46] rounded-3xl bg-[#18181b] p-16 text-center hover:border-[#8b5cf6] transition-all cursor-pointer group relative overflow-hidden"
                    onClick={() => document.getElementById('file-upload').click()}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                        e.preventDefault();
                        if (e.dataTransfer.files.length) handleFileChange(e.dataTransfer.files[0]);
                    }}
                >
                    <input
                        type="file"
                        id="file-upload"
                        className="hidden"
                        accept="image/*"
                        onChange={(e) => e.target.files.length && handleFileChange(e.target.files[0])}
                    />
                    
                    <div className="relative z-10">
                        <div className="mb-6 inline-flex p-4 rounded-2xl bg-[#27272a] group-hover:bg-[#3f3f46] transition-colors shadow-lg">
                             <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-xl flex items-center justify-center">
                                <Upload className="w-6 h-6 text-white" />
                             </div>
                        </div>
                        
                        <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-zinc-400 mb-3">
                            Drag image here
                        </h3>
                        <p className="text-zinc-500 text-sm mb-8">
                            Support upload format: JPG, PNG, WEBP
                        </p>

                        <button className="bg-[#8b5cf6] hover:bg-[#7c3aed] text-white px-8 py-3 rounded-full font-bold text-lg shadow-lg shadow-violet-500/25 transition-all transform hover:scale-105 flex items-center gap-2 mx-auto">
                            <Upload className="w-5 h-5 pointer-events-none" /> Upload Here
                        </button>
                    </div>

                    {/* Background decoration */}
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent to-[#8b5cf6]/5 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
            )}

            {/* Preview & Action */}
            {file && !result && !loading && (
                <div className="text-center space-y-6">
                    <div className="relative inline-block group">
                        <img src={preview} alt="Preview" className="max-h-[500px] rounded-lg shadow-2xl border border-white/10" />
                        <button 
                            onClick={reset}
                            className="absolute -top-3 -right-3 bg-red-500 text-white p-1.5 rounded-full hover:bg-red-600 shadow-lg"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                    
                    <div>
                        <button
                            onClick={handleUpload}
                            className="bg-gradient-to-r from-blue-500 to-violet-600 hover:from-blue-600 hover:to-violet-700 text-white font-bold py-3 px-8 rounded-full shadow-lg shadow-blue-500/20 transform hover:-translate-y-0.5 transition-all flex items-center gap-2 mx-auto"
                        >
                            <Sparkles className="w-5 h-5" />
                            Enhance Image
                        </button>
                    </div>
                </div>
            )}

            {/* Loading State */}
            {loading && (
                <div className="text-center py-20 animate-fade-in">
                    <div className="w-24 h-24 border-4 border-white/10 border-t-blue-500 rounded-full animate-spin mx-auto mb-6"></div>
                    <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                        Enhancing Image...
                    </h3>
                    <p className="text-slate-400 mt-2">Time Elapsed: {timer}s</p>
                    {mode === 'quality' && timer > 5 && (
                        <p className="text-xs text-yellow-500/80 mt-2 bg-yellow-500/10 inline-block px-3 py-1 rounded-full">
                            Premium model warming up...
                        </p>
                    )}
                    <button onClick={handleCancel} className="mt-8 text-red-400 hover:text-red-300 text-sm font-semibold">
                        Cancel Processing
                    </button>
                </div>
            )}

            {/* Result View */}
            {result && (
                <div className="space-y-6">
                    <div className="bg-black/30 rounded-xl overflow-hidden border border-white/10 shadow-2xl relative h-[600px] max-h-[70vh]">
                        <ReactCompareSlider
                            itemOne={<ReactCompareSliderImage src={result.original_url} alt="Original" />}
                            itemTwo={<ReactCompareSliderImage src={result.enhanced_url} alt="Enhanced" />}
                            style={{ width: '100%', height: '100%' }}
                            portrait={false}
                        />
                        <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-lg text-xs font-bold border border-white/10">Original</div>
                        <div className="absolute top-4 right-4 bg-blue-500/80 backdrop-blur-md px-3 py-1 rounded-lg text-xs font-bold border border-white/10">Enhanced</div>
                    </div>

                    <div className="flex justify-center gap-4">
                        <button 
                            onClick={handleDownload}
                            className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg flex items-center gap-2 shadow-lg shadow-green-500/20 transition-all"
                        >
                            <Download className="w-5 h-5" /> Download
                        </button>
                        <button 
                            onClick={reset}
                            className="bg-white/10 hover:bg-white/20 text-white font-bold py-3 px-6 rounded-lg flex items-center gap-2 transition-all border border-white/10"
                        >
                            <RefreshCw className="w-5 h-5" /> Enhance Another
                        </button>
                    </div>
                </div>
            )}

            {/* Error Message */}
            {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-200 p-4 rounded-xl flex items-center gap-3 mt-4">
                    <AlertCircle className="w-5 h-5 text-red-500" />
                    {error}
                </div>
            )}
        </div>
    );
};

export default ImageEnhancer;
