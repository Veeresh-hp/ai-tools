import { useState, useRef, useEffect } from 'react';
import { ReactCompareSlider, ReactCompareSliderImage } from 'react-compare-slider';
import { Upload, X, Eraser, Download, RefreshCw, AlertCircle, RotateCcw, Brush, Sparkles, MousePointer2 } from 'lucide-react';
import axios from 'axios';

const STUDIO_API_BASE = process.env.NODE_ENV === 'production'
    ? (process.env.REACT_APP_STUDIO_API_URL || 'https://your-studio-backend.onrender.com')
    : 'http://localhost:8000';

const LogoRemover = ({ projectToEdit, clearProject }) => {
    const [file, setFile] = useState(null);
    const [imageObj, setImageObj] = useState(null); // The Image object
    const [result, setResult] = useState(null); // { original_url, cleaned_url }
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [brushSize, setBrushSize] = useState(25);
    const [isMasked, setIsMasked] = useState(false); // Track if user has drawn anything
    const [selectionMode, setSelectionMode] = useState('brush'); // 'brush' or 'lasso'
    
    const canvasRef = useRef(null);
    const maskCanvasRef = useRef(null); // Offscreen canvas for the mask
    const containerRef = useRef(null);
    const isDrawing = useRef(false);

    // Initial load from project history
    useEffect(() => {
        if (projectToEdit) {
            const img = new Image();
            img.onload = () => {
                setImageObj(img);
                // Create a file-like object from the URL (or just name it)
                setFile({ name: projectToEdit.name, type: 'image/png' });
                setResult(null);
                setIsMasked(false);
                if (clearProject) clearProject();
            };
            img.crossOrigin = "anonymous";
            img.src = projectToEdit.url.startsWith('http') ? projectToEdit.url : `${STUDIO_API_BASE}${projectToEdit.url}`;
        }
    }, [projectToEdit, clearProject]);

    // Initialize Canvas when Image Loads
    useEffect(() => {
        if (!file || !imageObj || !canvasRef.current) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const container = containerRef.current;

        // Fit canvas to container width while maintaining aspect ratio
        const maxWidth = container.clientWidth;
        const scale = Math.min(1, maxWidth / imageObj.width);
        
        canvas.width = imageObj.width * scale;
        canvas.height = imageObj.height * scale;

        // Draw Image
        ctx.drawImage(imageObj, 0, 0, canvas.width, canvas.height);

        // Init Mask Canvas (matches visual canvas size)
        if (!maskCanvasRef.current) {
            maskCanvasRef.current = document.createElement('canvas'); // Create once
        }
        const maskCanvas = maskCanvasRef.current;
        maskCanvas.width = canvas.width;
        maskCanvas.height = canvas.height;
        
        const maskCtx = maskCanvas.getContext('2d');
        maskCtx.fillStyle = 'black';
        maskCtx.fillRect(0, 0, maskCanvas.width, maskCanvas.height);

    }, [file, imageObj]); // Re-run if file changes or image loads

    const handleFileChange = (selectedFile) => {
        if (!selectedFile) return;
        if (!selectedFile.type.startsWith('image/')) {
            setError("Please upload a valid image file.");
            return;
        }

        const img = new Image();
        img.onload = () => {
            setImageObj(img);
            setFile(selectedFile);
            setResult(null);
            setIsMasked(false);
            setError(null);
        };
        img.src = URL.createObjectURL(selectedFile);
    };

    // Drawing Logic
    const getPos = (e) => {
        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();
        const clientX = e.clientX || (e.touches && e.touches[0].clientX);
        const clientY = e.clientY || (e.touches && e.touches[0].clientY);
        return {
            x: (clientX - rect.left) * (canvas.width / rect.width),
            y: (clientY - rect.top) * (canvas.height / rect.height)
        };
    };

    const draw = (e) => {
        if (!isDrawing.current || !canvasRef.current) return;
        if (e.cancelable) e.preventDefault();

        if (!isMasked) setIsMasked(true);

        const { x, y } = getPos(e);
        const ctx = canvasRef.current.getContext('2d');
        const maskCtx = maskCanvasRef.current.getContext('2d');

        if (selectionMode === 'brush') {
            // Brush Mode: Standard line drawing
            ctx.lineWidth = brushSize;
            ctx.lineCap = 'round';
            ctx.strokeStyle = 'rgba(239, 68, 68, 0.5)'; // More vibrant red
            ctx.lineTo(x, y);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(x, y);

            maskCtx.lineWidth = brushSize;
            maskCtx.lineCap = 'round';
            maskCtx.strokeStyle = 'white';
            maskCtx.lineTo(x, y);
            maskCtx.stroke();
            maskCtx.beginPath();
            maskCtx.moveTo(x, y);
        } else {
            // Lasso Mode: Draw outline only while moving
            ctx.lineWidth = 2;
            ctx.setLineDash([5, 5]);
            ctx.strokeStyle = '#ef4444';
            ctx.lineTo(x, y);
            ctx.stroke();
        }
    };

    const startDrawing = (e) => {
        isDrawing.current = true;
        const { x, y } = getPos(e);
        const ctx = canvasRef.current.getContext('2d');
        const maskCtx = maskCanvasRef.current.getContext('2d');

        ctx.beginPath();
        ctx.moveTo(x, y);
        
        if (selectionMode === 'lasso') {
            ctx.setLineDash([5, 5]);
        } else {
            ctx.setLineDash([]);
        }

        maskCtx.beginPath();
        maskCtx.moveTo(x, y);
        draw(e);
    };

    const stopDrawing = () => {
        if (!isDrawing.current) return;
        isDrawing.current = false;
        
        const ctx = canvasRef.current.getContext('2d');
        const maskCtx = maskCanvasRef.current.getContext('2d');

        if (selectionMode === 'lasso') {
            // Close the loop and fill
            ctx.setLineDash([]);
            ctx.closePath();
            ctx.fillStyle = 'rgba(239, 68, 68, 0.3)';
            ctx.fill();
            ctx.strokeStyle = '#ef4444';
            ctx.lineWidth = 2;
            ctx.stroke();

            maskCtx.closePath();
            maskCtx.fillStyle = 'white';
            maskCtx.fill();
        }
        
        ctx.beginPath();
        maskCtx.beginPath();
    };

    const clearMask = () => {
        if (!canvasRef.current || !imageObj) return;
        const ctx = canvasRef.current.getContext('2d');
        const maskCtx = maskCanvasRef.current.getContext('2d');

        // Reset Visual
        ctx.drawImage(imageObj, 0, 0, canvasRef.current.width, canvasRef.current.height);
        
        // Reset Mask
        maskCtx.fillStyle = 'black';
        maskCtx.fillRect(0, 0, maskCanvasRef.current.width, maskCanvasRef.current.height);
        setIsMasked(false);
    };

    const handleRemove = async (autoDetect = false) => {
        if (!file) return;
        if (!autoDetect && (!maskCanvasRef.current || !isMasked)) return;

        setLoading(true);
        setError(null);

        try {
            const formData = new FormData();
            formData.append('image', file);
            
            if (autoDetect) {
                formData.append('auto_detect', 'true');
            } else {
                // Convert mask canvas to blob
                const maskBlob = await new Promise(resolve => maskCanvasRef.current.toBlob(resolve, 'image/png'));
                formData.append('mask', maskBlob, 'mask.png');
            }

            const response = await axios.post(`${STUDIO_API_BASE}/api/remove-logo`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            if (response.data.error) throw new Error(response.data.error);

            // Prepend BASE_URL to results
            const resultData = {
                original_url: `${STUDIO_API_BASE}${response.data.original_url}`,
                cleaned_url: `${STUDIO_API_BASE}${response.data.cleaned_url}`,
                timestamp: Date.now()
            };

            setResult(resultData);
        } catch (err) {
            setError(err.response?.data?.error || err.message || "Failed to remove object.");
        } finally {
            setLoading(false);
        }
    };

    // eslint-disable-next-line no-unused-vars
    const handleDownload = async () => {
        if (!result) return;
        try {
            const response = await fetch(result.cleaned_url);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `cleaned_${Date.now()}.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (err) {
            console.error("Download failed:", err);
            setError("Failed to download image.");
        }
    };

    const handleCorrection = async () => {
        if (!result) return;
        setLoading(true);
        try {
            // Fetch the cleaned image back as a blob
            const response = await fetch(result.cleaned_url);
            const blob = await response.blob();
            
            // Create a new File from it
            const newFile = new File([blob], `refine_${Date.now()}.png`, { type: 'image/png' });
            
            // Load it back into the editor
            const img = new Image();
            img.onload = () => {
                setImageObj(img);
                setFile(newFile);
                setResult(null);
                setIsMasked(false);
                setLoading(false);
            };
            img.src = URL.createObjectURL(newFile);
        } catch (e) {
            console.error("Correction error:", e);
            setError("Failed to initialize correction mode.");
            setLoading(false);
        }
    };

    const reset = () => {
        setFile(null);
        setImageObj(null);
        setResult(null);
        setIsMasked(false);
        setError(null);
    };

    return (
        <div className="max-w-4xl mx-auto" ref={containerRef}>
            
            {/* Upload Area */}
            {!file && !loading && (
                <div
                    className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-[2.5rem] p-16 text-center hover:border-violet-500/50 transition-all cursor-pointer group relative overflow-hidden"
                    onClick={() => document.getElementById('image-upload').click()}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                        e.preventDefault();
                        if (e.dataTransfer.files.length) handleFileChange(e.dataTransfer.files[0]);
                    }}
                >
                    <input
                        type="file"
                        id="image-upload"
                        className="hidden"
                        accept="image/*"
                        onChange={(e) => e.target.files.length && handleFileChange(e.target.files[0])}
                    />
                    
                    <div className="relative z-10">
                        <div className="mb-6 inline-flex p-4 rounded-2xl bg-white/5 group-hover:bg-violet-500/10 transition-colors">
                             <Upload className="w-10 h-10 text-violet-400" />
                        </div>
                        
                        <h3 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-zinc-400 mb-2">
                             Drop your image here
                        </h3>
                        <p className="text-zinc-400 text-sm mb-6">Support PNG, JPG, or WEBP (Max 10MB)</p>
                        <button className="bg-violet-600 hover:bg-violet-700 text-white px-8 py-3 rounded-full font-bold transition-all transform hover:scale-105 shadow-lg shadow-violet-500/20">
                            Select File
                        </button>
                    </div>

                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent to-violet-500/5 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
            )}

            {/* Editor State */}
            {file && imageObj && !loading && !result && (
                <div className="space-y-6 animate-fade-in">
                    {/* Control Bar */}
                    <div className="bg-white/5 border border-white/10 backdrop-blur-xl p-4 rounded-2xl flex items-center justify-between border-white/5 shadow-xl">
                        <div className="flex items-center gap-6">
                            <div className="flex bg-black/40 p-1 rounded-xl border border-white/5 shadow-inner">
                                <button
                                    onClick={() => setSelectionMode('brush')}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${selectionMode === 'brush' ? 'bg-violet-600 text-white shadow-lg shadow-violet-600/20' : 'text-zinc-400 hover:text-white'}`}
                                >
                                    <Brush className="w-4 h-4" /> Brush
                                </button>
                                <button
                                    onClick={() => setSelectionMode('lasso')}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${selectionMode === 'lasso' ? 'bg-violet-600 text-white shadow-lg shadow-violet-600/20' : 'text-zinc-400 hover:text-white'}`}
                                >
                                    <MousePointer2 className="w-4 h-4" /> Lasso
                                </button>
                            </div>

                            <div className="h-8 w-px bg-white/10" />

                             <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
                                    <span className="w-2 h-2 rounded-full bg-violet-400" />
                                    Size: {brushSize}px
                                </div>
                                <input
                                    type="range"
                                    min="5"
                                    max="100"
                                    value={brushSize}
                                    onChange={(e) => setBrushSize(parseInt(e.target.value))}
                                    className="w-32 h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-violet-500"
                                />
                             </div>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={clearMask}
                                className="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-sm font-semibold flex items-center gap-2 transition-all border border-white/10"
                            >
                                <RotateCcw className="w-4 h-4" /> Clear
                            </button>
                            <button
                                onClick={() => handleRemove(true)}
                                className="px-6 py-2.5 rounded-xl bg-amber-500/10 hover:bg-amber-500 text-amber-500 hover:text-white font-bold text-sm border border-amber-500/20 shadow-lg shadow-amber-500/5 transition-all"
                            >
                                <Sparkles className="w-4 h-4" /> Auto-Logo
                            </button>
                            <button
                                onClick={() => handleRemove(false)}
                                disabled={!isMasked}
                                className={`px-8 py-2.5 rounded-xl font-bold text-sm shadow-lg flex items-center gap-2 transition-all ${isMasked ? 'bg-violet-600 hover:bg-violet-700 text-white shadow-violet-600/20 active:scale-95' : 'bg-white/5 text-zinc-500 cursor-not-allowed border border-white/5'}`}
                            >
                                <Eraser className="w-4 h-4" /> Remove Now
                            </button>
                        </div>
                    </div>

                    <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-[2rem] p-4 flex justify-center overflow-hidden min-h-[400px] relative">
                        <canvas
                            ref={canvasRef}
                            className="cursor-crosshair touch-none rounded-xl max-w-full h-auto"
                            onMouseDown={startDrawing}
                            onMouseMove={draw}
                            onMouseUp={stopDrawing}
                            onMouseLeave={stopDrawing}
                            onTouchStart={startDrawing}
                            onTouchMove={draw}
                            onTouchEnd={stopDrawing}
                        />
                         {!isMasked && (
                            <div className="absolute inset-x-0 bottom-8 flex justify-center pointer-events-none">
                                <div className="bg-black/80 backdrop-blur-xl border border-white/10 px-6 py-3 rounded-full text-white text-sm font-medium flex items-center gap-3 animate-pulse-subtle">
                                    <span className="flex h-2 w-2 rounded-full bg-violet-400" />
                                    Highlight the area you want to remove
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

             {/* Loading State */}
             {loading && (
                <div className="text-center py-20 animate-fade-in">
                    <div className="w-24 h-24 border-4 border-white/10 border-t-violet-500 rounded-full animate-spin mx-auto mb-6"></div>
                    <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-fuchsia-400">
                        {result ? "Refining Details..." : "AI Object Removal in Progress..."}
                    </h3>
                    <p className="text-slate-400 mt-2">{result ? "Perfecting the final edges..." : "Processing with VisualGPT Magic..."}</p>
                </div>
            )}

            {/* Result View */}
            {result && !loading && (
                <div className="space-y-8 animate-fade-in">
                    <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-[2.5rem] p-4 overflow-hidden shadow-2xl relative h-[600px]">
                        <ReactCompareSlider
                            key={result.timestamp}
                            itemOne={<ReactCompareSliderImage src={`${result.original_url}?t=${result.timestamp}`} alt="Original" />}
                            itemTwo={<ReactCompareSliderImage src={`${result.cleaned_url}?t=${result.timestamp}`} alt="Cleaned" />}
                            className="w-full h-full rounded-2xl"
                        />
                        <div className="absolute top-6 left-6 bg-white/5 border border-white/10 backdrop-blur-xl px-4 py-2 rounded-xl text-xs font-bold text-white">Original View</div>
                        <div className="absolute top-6 right-6 bg-violet-600/90 backdrop-blur-md px-4 py-2 rounded-xl text-xs font-bold text-white shadow-xl shadow-violet-600/40">Cleaned Result</div>
                    </div>
                    
                     <div className="flex justify-center flex-wrap gap-4">
                        <button 
                            onClick={handleDownload}
                            className="group bg-white text-black hover:bg-zinc-200 font-bold py-4 px-10 rounded-[1.5rem] flex items-center gap-3 shadow-2xl transition-all transform hover:scale-105 active:scale-95"
                        >
                            <Download className="w-6 h-6" /> Download Result
                        </button>
                        <button 
                            onClick={handleCorrection}
                            className="bg-white/5 hover:bg-white/10 text-white font-bold py-4 px-10 rounded-[1.5rem] flex items-center gap-3 border border-white/10 transition-all transform hover:scale-105 active:scale-95"
                        >
                            <RefreshCw className="w-5 h-5 text-amber-400" /> Refine Again
                        </button>
                        <button 
                            onClick={reset}
                            className="bg-white/5 hover:bg-white/10 text-white font-bold py-4 px-10 rounded-[1.5rem] flex items-center gap-3 border border-white/10 transition-all transform hover:scale-105 active:scale-95"
                        >
                            <RotateCcw className="w-5 h-5 text-zinc-400" /> New Image
                        </button>
                    </div>
                </div>
            )}

             {/* Error Message */}
             {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-200 p-6 rounded-2xl flex items-center gap-4 mt-8 animate-fade-in">
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

export default LogoRemover;
