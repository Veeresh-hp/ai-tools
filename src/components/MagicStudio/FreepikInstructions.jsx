import React, { useEffect } from 'react';
import { HelpCircle, X } from 'lucide-react';

const FreepikInstructions = ({ onClose }) => {
    // Optional: Simple Intersection Observer for entry animations
    useEffect(() => {
        const observerOptions = { threshold: 0.1 };
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
            title: "Find & Click Share",
            subtitle: "Open the Freepik asset you desire and look for the 'Share' icon. This is the first step to generating your high-speed download link.",
            image: "/Images/freepik/Link2.JPG", 
        },
        {
            step: "02",
            title: "Copy the Share Link",
            subtitle: "A popup will appear with the resource URL. Click the 'Copy' button. Our system is optimized to recognize all Freepik premium and free link structures.",
            image: "/Images/freepik/link3.JPG",
        },
        {
            step: "03",
            title: "Paste & Download",
            subtitle: "Head back to our downloader, paste the link into the main search bar, and hit 'Download'. Your file will be processed and ready in seconds.",
            image: "/Images/freepik/link4.png",
        }
    ];

    return (
        <div className="relative max-w-[1400px] mx-auto pt-16 pb-32 px-6">
            
            {/* Close Button for Modal */}
            {onClose && (
                <button 
                    onClick={onClose}
                    className="fixed top-6 right-6 z-50 p-2 bg-zinc-900/80 backdrop-blur-md rounded-full text-zinc-400 hover:text-white border border-zinc-800 hover:border-zinc-700 transition-all"
                >
                    <X className="w-8 h-8" />
                </button>
            )}

            {/* Massive Header Section */}
            <div className="text-center mb-32 animate-on-scroll transition-all duration-1000 opacity-0 translate-y-10">
                <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-zinc-900 border border-zinc-800 text-[#00DC82] mb-8">
                    <HelpCircle className="w-5 h-5" />
                    <span className="font-bold tracking-[0.3em] text-xs uppercase">Instructional Guide</span>
                </div>

                <h2 className="text-5xl md:text-8xl font-black text-white mb-8 tracking-tighter leading-[0.9]">
                    Simple. Fast. <br/> <span className="text-[#00DC82]">Professional.</span>
                </h2>

                <p className="text-zinc-500 text-xl md:text-2xl max-w-3xl mx-auto font-medium">
                    Master the tool in less than 30 seconds with our streamlined workflow.
                </p>
            </div>

            {/* Large Card Stack */}
            <div className="space-y-40">
                {steps.map((step, index) => (
                    <div 
                        key={index}
                        className={`flex flex-col ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center gap-16 lg:gap-32 animate-on-scroll transition-all duration-1000 delay-100 opacity-0 translate-y-10`}
                    >
                        {/* Massive Image Container */}
                        <div className="w-full lg:w-[60%] relative group">
                            {/* Decorative Background Element */}
                            <div className="absolute -inset-4 bg-gradient-to-tr from-[#00DC82]/20 to-transparent rounded-[3rem] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                            
                            <div className="relative rounded-[2.5rem] overflow-hidden bg-zinc-900 border-4 border-zinc-800 transition-transform duration-500 group-hover:scale-[1.02] shadow-2xl">
                                <img 
                                    src={step.image} 
                                    alt={step.title}
                                    className="w-full h-auto object-cover"
                                />
                                
                                {/* Overlay Shadow */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />
                            </div>

                            {/* Large Floating Step Number */}
                            <div className={`absolute -top-12 ${index % 2 === 0 ? '-left-6' : '-right-6'} hidden md:block`}>
                                <span className="text-[14rem] font-black text-white/[0.03] leading-none select-none">
                                    {step.step}
                                </span>
                            </div>
                        </div>

                        {/* Content Container */}
                        <div className="w-full lg:w-[40%] space-y-8">
                            <div className="flex items-center gap-4">
                                <span className="h-[2px] w-12 bg-[#00DC82]" />
                                <span className="text-[#00DC82] font-black text-xl tracking-widest uppercase">Step {step.step}</span>
                            </div>
                            
                            <h3 className="text-4xl md:text-6xl font-bold text-white tracking-tight leading-tight">
                                {step.title}
                            </h3>

                            <p className="text-zinc-400 text-xl md:text-2xl leading-relaxed font-light">
                                {step.subtitle}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            {/* High Impact Footer */}
            <div className="mt-48 text-center animate-on-scroll transition-all duration-1000 opacity-0 translate-y-10">
                <div className="max-w-4xl mx-auto p-1 bg-gradient-to-r from-transparent via-zinc-800 to-transparent mb-12" />
                <p className="text-zinc-500 text-lg mb-8 uppercase tracking-[0.4em]">Ready to start?</p>
                <button 
                    onClick={onClose}
                    className="bg-[#00DC82] hover:bg-[#00ffa5] text-black font-black px-16 py-6 rounded-2xl text-2xl transition-all transform hover:scale-105 hover:shadow-[0_0_40px_rgba(0,220,130,0.4)]"
                >
                    GO TO DOWNLOADER
                </button>
            </div>
        </div>
    );
};

export default FreepikInstructions;