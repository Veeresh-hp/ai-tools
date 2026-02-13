import { useState, useRef, useEffect } from 'react';
import { ReactCompareSlider, ReactCompareSliderImage } from 'react-compare-slider';
import { X, Eraser, Download, AlertCircle, RotateCcw, HelpCircle, PenTool, Loader2, Flag } from 'lucide-react';
import axios from 'axios';
import LogoRemoverInstructions from './LogoRemoverInstructions';
import ReportModal from '../ReportModal';

const STUDIO_API_BASE = process.env.NODE_ENV === 'production'
    ? (process.env.REACT_APP_STUDIO_API_URL || 'https://aitools-backend-kh4a.onrender.com')
    : 'http://localhost:8000';

const LogoRemover = ({ projectToEdit, clearProject }) => {
    const [file, setFile] = useState(null);
    const [imageObj, setImageObj] = useState(null);
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [brushSize, setBrushSize] = useState(25);
    const [showInstructions, setShowInstructions] = useState(false);
    const [imageLoaded, setImageLoaded] = useState(false);
    
    // History State
    const [history, setHistory] = useState([]);
    const [step, setStep] = useState(0);

    // Report Modal State
    const [isReportModalOpen, setIsReportModalOpen] = useState(false);
    const toolInfo = { _id: 'object-remover', name: 'Object Remover' };
    
    const canvasRef = useRef(null);
    const maskCanvasRef = useRef(null);
    const containerRef = useRef(null);
    const imageRef = useRef(null);
    const isDrawing = useRef(false);

    // Initial load from project history
    useEffect(() => {
        if (projectToEdit) {
            const img = new Image();
            img.onload = () => {
                setImageObj(img);
                setFile({ name: projectToEdit.name, type: 'image/png' });
                setResult(null);
                setHistory([]);
                setStep(0);
                setImageLoaded(true);
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

        if (!container) return; // Guard against null container

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

        setImageLoaded(false); // Reset loaded state
        const img = new Image();
        img.onload = () => {
            setImageObj(img);
            setFile(selectedFile);
            setResult(null);
            setHistory([]);
            setStep(0);
            setImageLoaded(true);
            setError(null);
        };
        img.src = URL.createObjectURL(selectedFile);
    };

    // Drawing Logic
    const startDrawing = (e) => {
        if (!imageLoaded || loading) return;
        isDrawing.current = true;
        draw(e);
    };

    const stopDrawing = () => {
        if (!isDrawing.current) return;
        isDrawing.current = false;
        saveHistory(); 
    };

    const draw = (e) => {
        if (!isDrawing.current || !canvasRef.current || !imageRef.current) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const rect = imageRef.current.getBoundingClientRect(); // Use imageRef specifically
        
        // Calculate scale factor between display size and actual image size
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;

        // Calculate mouse position relative to image
        const x = (e.clientX - rect.left) * scaleX;
        const y = (e.clientY - rect.top) * scaleY;

        ctx.lineWidth = brushSize * scaleX; 
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.strokeStyle = 'rgba(255, 0, 0, 0.5)'; 
        ctx.globalCompositeOperation = 'source-over';

        ctx.lineTo(x, y);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(x, y);
    };

    // Undo/History Management
    const saveHistory = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        
        const newHistory = history.slice(0, step + 1);
        newHistory.push(canvas.toDataURL());
        setHistory(newHistory);
        setStep(newHistory.length - 1);
    };

    const undo = () => {
        if (step > 0) {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');
            const img = new Image();
            img.src = history[step - 1];
            img.onload = () => {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(img, 0, 0);
                setStep(step - 1);
            };
        } else {
             // Clear if at start
            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
            }
            setStep(0);
            setHistory([]);
        }
    };

    // Process Image
    const handleRemoveObject = async () => {
        if (!file || !canvasRef.current) return;

        // Check if mask is empty
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const pixelBuffer = new Uint32Array(
            ctx.getImageData(0, 0, canvas.width, canvas.height).data.buffer
        );
        
        if (!pixelBuffer.some(color => color !== 0)) {
            setError("Please paint over the object you want to remove first.");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            // Convert mask to blob
            const maskBlob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
            
            const formData = new FormData();
            formData.append('image', file);
            formData.append('mask', maskBlob, 'mask.png');

            const response = await axios.post(`${STUDIO_API_BASE}/api/cleanup`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            if (response.data.error) throw new Error(response.data.error);

            setResult({
                original_url: `${STUDIO_API_BASE}${response.data.original_url}`,
                cleaned_url: `${STUDIO_API_BASE}${response.data.cleaned_url}`,
                timestamp: Date.now()
            });
            
        } catch (err) {
            setError(err.response?.data?.error || err.message || "Failed to remove object.");
        } finally {
            setLoading(false);
        }
    };
    
    // Logic for "Refine Again" (Iterative Editing)
    const handleRefineAgain = async () => {
        if (!result) return;
        
        try {
            // 1. Fetch the cleaned image as a blob
            const response = await fetch(result.cleaned_url);
            const blob = await response.blob();
            const refineFile = new File([blob], "refined_image.png", { type: "image/png" });
            
            // 2. Set this file as the new "original"
            setFile(refineFile);
            setResult(null); // Clear result view to go back to editor
            setError(null);
            
            // 3. Clear the history/mask
            setHistory([]);
            setStep(0);
            setImageLoaded(true); // Since we just loaded it
            
        } catch (e) {
            console.error("Refine setup failed:", e);
            setError("Could not load image for refinement.");
        }
    };

    const reset = () => {
        setFile(null);
        setResult(null);
        setError(null);
        setHistory([]);
        setStep(0);
        setImageLoaded(false);
    };

    return (
        <div className="max-w-6xl mx-auto space-y-8 animate-fade-in">


            {/* Upload View */}
            {!file && (
                <div 
                    className="border-2 border-dashed border-zinc-700 hover:border-violet-500/50 bg-[#18181b]/50 rounded-[2rem] h-[400px] flex flex-col items-center justify-center cursor-pointer transition-all group relative overflow-hidden"
                    onClick={() => document.getElementById('logo-upload').click()}
                >
                    <input 
                        type="file" 
                        id="logo-upload" 
                        className="hidden" 
                        accept="image/*"
                        onChange={(e) => e.target.files.length && handleFileChange(e.target.files[0])}
                    />

                    <button
                        onClick={(e) => { e.stopPropagation(); setShowInstructions(true); }}
                        className="absolute top-6 right-6 z-20 flex items-center gap-2 text-zinc-400 hover:text-white transition-colors bg-[#18181b]/80 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium border border-white/5 hover:border-white/10"
                    >
                        <HelpCircle className="w-4 h-4" /> How to use?
                    </button>
                    
                    <div className="absolute inset-0 bg-violet-500/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none blur-3xl rounded-full transform scale-50 group-hover:scale-100 duration-700"></div>

                    <div className="w-20 h-20 bg-[#27272a] rounded-2xl flex items-center justify-center mb-6 shadow-xl group-hover:scale-110 transition-transform duration-300 relative z-10 border border-white/5">
                        <Eraser className="w-10 h-10 text-violet-400" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2 relative z-10">Upload Image</h3>
                    <p className="text-zinc-500 relative z-10">All formats supported</p>
                </div>
            )}

            {/* Editor View */}
            {file && !result && !loading && (
                <div className="flex flex-col lg:flex-row gap-8">
                     {/* Toolbar */}
                    <div className="lg:w-64 flex flex-col gap-6 order-2 lg:order-1">
                         <div className="bg-[#18181b] p-6 rounded-3xl border border-[#27272a] shadow-xl">
                            <h4 className="text-white font-bold mb-4 flex items-center gap-2">
                                <PenTool className="w-4 h-4 text-violet-400" /> Brush Settings
                            </h4>
                            <div className="space-y-4">
                                <div>
                                    <div className="flex justify-between text-xs text-zinc-400 mb-2">
                                        <span>Size</span>
                                        <span>{brushSize}px</span>
                                    </div>
                                    <input 
                                        type="range" 
                                        min="5" 
                                        max="100" 
                                        value={brushSize} 
                                        onChange={(e) => setBrushSize(parseInt(e.target.value))}
                                        className="w-full accent-violet-500 h-2 bg-[#27272a] rounded-lg appearance-none cursor-pointer"
                                    />
                                </div>
                                
                                <div className="flex gap-2 pt-2">
                                    <button 
                                        onClick={undo}
                                        className="flex-1 bg-[#27272a] hover:bg-[#3f3f46] text-white py-2 rounded-xl text-sm font-medium transition-colors border border-white/5"
                                        disabled={step === 0}
                                    >
                                        Undo
                                    </button>
                                     <button 
                                        onClick={() => {
                                             const canvas = canvasRef.current;
                                             const ctx = canvas.getContext('2d');
                                             if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
                                             setHistory([]);
                                             setStep(0);
                                        }}
                                        className="flex-1 bg-[#27272a] hover:bg-red-500/20 text-red-400 py-2 rounded-xl text-sm font-medium transition-colors border border-white/5"
                                    >
                                        Clear
                                    </button>
                                </div>
                            </div>
                         </div>
                         
                         <div className="bg-[#18181b] p-6 rounded-3xl border border-[#27272a] shadow-xl flex-1 flex flex-col justify-between">
                            <div>
                                <h4 className="text-white font-bold mb-2">Instructions</h4>
                                <ul className="text-sm text-zinc-400 space-y-2 list-disc pl-4">
                                    <li>Paint over the object you want to remove.</li>
                                    <li>Be sure to cover the entire object and its shadow.</li>
                                    <li>Click "Remove Object" when ready.</li>
                                </ul>
                            </div>
                            
                            <div className="space-y-3 mt-8">
                                <button 
                                    onClick={handleRemoveObject}
                                    className="w-full bg-violet-600 hover:bg-violet-700 text-white font-bold py-3 px-6 rounded-xl shadow-lg shadow-violet-600/20 transition-all transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
                                >
                                    <Eraser className="w-5 h-5" /> Remove Object
                                </button>
                                <button 
                                    onClick={reset}
                                    className="w-full bg-transparent hover:bg-white/5 text-zinc-400 hover:text-white py-3 rounded-xl font-medium transition-colors flex items-center justify-center gap-2 border border-transparent hover:border-white/10"
                                >
                                    <X className="w-5 h-5" /> Cancel
                                </button>
                            </div>
                         </div>
                    </div>

                    {/* Canvas Area */}
                    <div className="flex-1 order-1 lg:order-2">
                        <div 
                            className="bg-[#09090b] rounded-3xl overflow-hidden shadow-2xl relative border border-[#27272a] touch-none select-none max-h-[70vh] flex items-center justify-center"
                            onMouseDown={startDrawing}
                            onMouseMove={draw}
                            onMouseUp={stopDrawing}
                            onMouseLeave={stopDrawing}
                            onTouchStart={(e) => {
                                // Prevent scrolling while drawing on mobile
                                if(e.target === canvasRef.current) e.preventDefault();
                                // Helper to get touch coordinates similar to mouse
                                const touch = e.touches[0];
                                const mouseEvent = new MouseEvent('mousedown', {
                                    clientX: touch.clientX,
                                    clientY: touch.clientY
                                });
                                startDrawing(mouseEvent);
                            }}
                            onTouchMove={(e) => {
                                if(e.target === canvasRef.current) e.preventDefault();
                                const touch = e.touches[0];
                                const mouseEvent = new MouseEvent('mousemove', {
                                    clientX: touch.clientX,
                                    clientY: touch.clientY
                                });
                                draw(mouseEvent);
                            }}
                            onTouchEnd={stopDrawing}
                        >
                            {!imageLoaded && (
                                <div className="absolute inset-0 flex items-center justify-center text-zinc-500">
                                    <Loader2 className="w-8 h-8 animate-spin" />
                                </div>
                            )}
                            
                            {/* Images Stack */}
                            <div className="relative inline-block max-w-full max-h-full" ref={containerRef}>
                                <img 
                                    ref={imageRef}
                                    src={URL.createObjectURL(file)} 
                                    alt="Original" 
                                    className="max-w-full max-h-[70vh] object-contain block pointer-events-none select-none"
                                    onLoad={() => {
                                        // Ensure canvas matches image exactly
                                        if (imageRef.current && canvasRef.current) {
                                            canvasRef.current.width = imageRef.current.naturalWidth;
                                            canvasRef.current.height = imageRef.current.naturalHeight;
                                        }
                                        setImageLoaded(true);
                                    }}
                                />
                                <canvas 
                                    ref={canvasRef}
                                    className="absolute inset-0 w-full h-full cursor-crosshair touch-none"
                                    style={{ imageRendering: 'pixelated' }}
                                />
                            </div>
                        </div>
                         
                        {/* Mobile Warning */}
                        <p className="text-center text-zinc-500 text-xs mt-4 lg:hidden">
                            Two-finger scroll to move page. One finger to paint.
                        </p>
                    </div>
                </div>
            )}

            {/* Loading State */}
            {loading && (
                <div className="text-center py-32 bg-[#18181b] border border-[#27272a] rounded-[2.5rem] shadow-2xl relative overflow-hidden">
                    <div className="absolute inset-0 bg-violet-500/5 animate-pulse"></div>
                    <div className="relative z-10">
                        <div className="w-20 h-20 border-4 border-[#27272a] border-t-violet-500 rounded-full animate-spin mx-auto mb-6 shadow-2xl shadow-violet-500/20"></div>
                        <h3 className="text-2xl font-bold text-white mb-2">Magic in Progress...</h3>
                        <p className="text-zinc-500 max-w-md mx-auto">Complex AI inpainting is filling the gaps.</p>
                    </div>
                </div>
            )}

            {/* Result View */}
            {result && (
                <div className="space-y-8 animate-fade-in-up">
                    <div className="bg-[#18181b] border border-[#27272a] rounded-[2.5rem] overflow-hidden shadow-2xl h-[600px] relative">
                         <ReactCompareSlider
                            key={result.timestamp}
                            itemOne={<ReactCompareSliderImage src={`${result.original_url}?t=${result.timestamp}`} alt="Original" className="object-contain" />}
                            itemTwo={<ReactCompareSliderImage src={`${result.cleaned_url}?t=${result.timestamp}`} alt="Cleaned" className="object-contain" />}
                            style={{ width: '100%', height: '100%' }}
                        />
                        <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-lg text-xs font-bold border border-white/10 text-white pointer-events-none">Original</div>
                        <div className="absolute top-4 right-4 bg-violet-600/80 backdrop-blur-md px-3 py-1 rounded-lg text-xs font-bold border border-white/10 text-white pointer-events-none">Cleaned</div>
                    </div>

                    <div className="flex justify-center flex-wrap gap-4">
                         <button 
                            onClick={async () => {
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
                                } catch(e) { console.error(e); }
                            }}
                            className="bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-8 rounded-2xl flex items-center gap-2 shadow-xl shadow-green-600/20 transition-all transform hover:scale-105"
                        >
                            <Download className="w-5 h-5 shrink-0" /> Download Result
                        </button>
                        
                        <button 
                            onClick={handleRefineAgain}
                            className="bg-violet-600 hover:bg-violet-700 text-white font-bold py-4 px-8 rounded-2xl flex items-center gap-2 shadow-xl shadow-violet-600/20 transition-all transform hover:scale-105"
                            title="Edit this result further"
                        >
                            <PenTool className="w-5 h-5 shrink-0" /> Refine Again
                        </button>

                        <button 
                            onClick={reset}
                            className="bg-[#27272a] hover:bg-[#3f3f46] text-white font-bold py-4 px-8 rounded-2xl flex items-center gap-2 border border-white/5 transition-colors"
                        >
                            <RotateCcw className="w-5 h-5 shrink-0" /> Start New
                        </button>
                    </div>
                </div>
            )}
            
            {/* Error Message */}
            {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-200 p-4 rounded-xl flex items-center gap-3 mt-4 animate-fade-in mx-auto max-w-2xl">
                    <AlertCircle className="w-6 h-6 shrink-0 text-red-500" />
                     <div className="flex-1">
                        <p className="font-bold">Error</p>
                        <p className="text-sm text-red-300/80">{error}</p>
                    </div>
                    <button onClick={() => setError(null)}><X className="w-5 h-5" /></button>
                </div>
            )}

            {showInstructions && (
                <div className="fixed inset-0 z-50 flex justify-center p-4 bg-black/95 backdrop-blur-sm overflow-y-auto" onClick={(e) => {
                    if(e.target === e.currentTarget) setShowInstructions(false);
                }}>
                    <div className="w-full relative">
                        <LogoRemoverInstructions onClose={() => setShowInstructions(false)} />
                    </div>
                </div>
            )}
            
            {/* Report Issue Button */}
            <div className="flex justify-center pb-8 pt-4">
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

export default LogoRemover;
