import React, { useEffect } from 'react';
import { HelpCircle, X, ArrowDown, ExternalLink } from 'lucide-react';

const LogoRemoverInstructions = ({ onClose }) => {
    // Intersection Observer for entry animations
    useEffect(() => {
        const observerOptions = { 
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px' 
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('opacity-100', 'translate-y-0');
                    entry.target.classList.remove('opacity-0', 'translate-y-10');
                }
            });
        }, observerOptions);

        document.querySelectorAll('.animate-on-scroll').forEach((el) => observer.observe(el));
        return () => observer.disconnect();
    }, []);

    const steps = [
        {
            step: "01",
            title: "Upload Your Image",
            subtitle: "Drag and drop your image or click to upload. We support high-resolution PNG, JPG, and WEBP formats.",
            image: "/obj1.JPG", 
        },
        {
            step: "02",
            title: "Highlight Object",
            subtitle: "Use the brush tool to paint over the unwanted object, text, or logo. Adjust the brush size for precision.",
            image: "/obj3.JPG",
        },
        {
            step: "03",
            title: "Remove & Download",
            subtitle: "Click 'Remove Now' to let our AI magically erase the object. Preview the result and download your clean image.",
            image: "/obj2.JPG", 
        }
    ];

    const stepRefs = React.useRef([]);
    const footerRef = React.useRef(null);

    const scrollToStep = (index) => {
        if (index < steps.length) {
            stepRefs.current[index]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } else {
            footerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    };

    return (
        <div className="relative max-w-[1400px] mx-auto pt-16 md:pt-32 pb-20 md:pb-32 px-4 md:px-8 overflow-hidden">
            
            {/* Enhanced Fixed Close Button with Backdrop Blur */}
            {onClose && (
                <div className="fixed top-0 left-0 right-0 z-[60] flex justify-end p-4 pointer-events-none">
                    <button 
                        onClick={onClose}
                        className="pointer-events-auto p-3 md:p-4 bg-zinc-950/60 backdrop-blur-xl rounded-full text-zinc-400 hover:text-violet-500 border border-white/10 hover:border-violet-500/50 transition-all active:scale-90 shadow-2xl"
                        aria-label="Close"
                    >
                        <X className="w-6 h-6 md:w-8 md:h-8" />
                    </button>
                </div>
            )}

            {/* Massive Header Section */}
            <div className="text-center mb-16 md:mb-32 animate-on-scroll transition-all duration-1000 opacity-0 translate-y-10">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-zinc-900 border border-zinc-800 text-violet-500 mb-6 md:mb-8">
                    <HelpCircle className="w-4 h-4 md:w-5 md:h-5" />
                    <span className="font-bold tracking-[0.2em] text-[10px] md:text-xs uppercase text-zinc-300">Instructional Guide</span>
                </div>

                <h2 className="text-4xl md:text-8xl font-black text-white mb-6 md:mb-8 tracking-tighter leading-tight md:leading-[0.9]">
                    Clean. Magic. <br className="md:hidden" /> <span className="text-violet-500">Perfection.</span>
                </h2>

                <p className="text-zinc-500 text-base md:text-2xl max-w-3xl mx-auto font-medium px-4">
                    Remove unwanted objects in seconds with our professional AI tools.
                </p>
                
                <div className="mt-8 flex justify-center">
                    <button 
                         onClick={() => scrollToStep(0)}
                         className="flex flex-col items-center gap-2 text-zinc-500 hover:text-white transition-colors animate-bounce"
                    >
                        <span className="text-xs font-bold tracking-widest uppercase">Start Guide</span>
                        <ArrowDown className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Large Card Stack */}
            <div className="space-y-24 md:space-y-48">
                {steps.map((step, index) => (
                    <div 
                        key={index}
                        ref={el => stepRefs.current[index] = el}
                        className={`flex flex-col ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center gap-8 md:gap-16 lg:gap-32 animate-on-scroll transition-all duration-1000 delay-100 opacity-0 translate-y-10`}
                    >
                        {/* Massive Image Container */}
                        <div className="w-full lg:w-[60%] relative group">
                            <div className="absolute top-4 left-4 z-20 lg:hidden">
                                <span className="bg-violet-600 text-white font-black px-4 py-1 rounded-full text-sm shadow-lg shadow-violet-600/20">
                                    STEP {step.step}
                                </span>
                            </div>

                            <div className="absolute -inset-4 bg-gradient-to-tr from-violet-600/20 to-transparent rounded-[3rem] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 hidden md:block" />
                            
                            <div className="relative rounded-[1.5rem] md:rounded-[2.5rem] overflow-hidden bg-zinc-900 border-2 md:border-4 border-zinc-800 transition-transform duration-500 group-hover:scale-[1.02] shadow-2xl">
                                <img 
                                    src={step.image} 
                                    alt={step.title}
                                    className="w-full h-auto object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-70" />
                            </div>

                            <div className={`absolute -top-16 ${index % 2 === 0 ? '-left-8' : '-right-8'} hidden lg:block`}>
                                <span className="text-[12rem] xl:text-[16rem] font-black text-white/[0.03] leading-none select-none">
                                    {step.step}
                                </span>
                            </div>
                        </div>

                        {/* Text Content */}
                        <div className="w-full lg:w-[40%] space-y-4 md:space-y-8 px-2">
                            <div className="hidden lg:flex items-center gap-4">
                                <span className="h-[2px] w-12 bg-violet-500" />
                                <span className="text-violet-500 font-black text-xl tracking-widest uppercase">Step {step.step}</span>
                            </div>
                            
                            <h3 className="text-3xl md:text-6xl font-bold text-white tracking-tight leading-tight">
                                {step.title}
                            </h3>

                            <p className="text-zinc-400 text-lg md:text-2xl leading-relaxed font-light">
                                {step.subtitle}
                            </p>

                            <div className="pt-4 flex items-center gap-6">
                                <button 
                                    onClick={() => {
                                        if (index === steps.length - 1) {
                                            onClose();
                                        } else {
                                            scrollToStep(index + 1);
                                        }
                                    }}
                                    className="flex items-center gap-3 text-white font-bold group"
                                >
                                    <div className="w-10 h-10 md:w-14 md:h-14 rounded-full border border-zinc-700 flex items-center justify-center group-hover:border-violet-500 group-hover:bg-violet-500 group-hover:text-white transition-all">
                                        <ArrowDown className={`w-4 h-4 md:w-6 md:h-6 transition-transform ${index === steps.length -1 ? '-rotate-90' : ''}`} />
                                    </div>
                                    <span className="group-hover:text-violet-500 transition-colors uppercase tracking-widest text-xs md:text-sm">
                                        {index === steps.length - 1 ? "Start Removing" : "Next Step"}
                                    </span>
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* High Impact Footer */}
            <div ref={footerRef} className="mt-32 md:mt-48 text-center animate-on-scroll transition-all duration-1000 opacity-0 translate-y-10 px-4">
                <div className="max-w-4xl mx-auto p-[1px] bg-gradient-to-r from-transparent via-zinc-800 to-transparent mb-12" />
                <p className="text-zinc-500 text-lg mb-8 uppercase tracking-[0.4em]">Ready to magic?</p>
                
                <button 
                    onClick={onClose}
                    className="w-full md:w-auto bg-violet-600 hover:bg-violet-500 text-white font-black px-12 md:px-16 py-5 md:py-6 rounded-xl md:rounded-2xl text-xl md:text-2xl transition-all transform active:scale-95 md:hover:scale-105 hover:shadow-[0_0_40px_rgba(124,58,237,0.4)]"
                >
                    GO TO EDITOR
                </button>

                <div className="mt-8 flex justify-center items-center gap-2 text-zinc-500 hover:text-white transition-colors cursor-pointer group">
                    <span className="text-sm font-bold uppercase tracking-widest">Full Documentation</span>
                    <ExternalLink className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </div>
            </div>
        </div>
    );
};

export default LogoRemoverInstructions;
