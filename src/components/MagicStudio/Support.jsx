import React from 'react';
import { HelpCircle, Mail, MessageSquare, BookOpen, ExternalLink, ChevronRight, Sparkles, Eraser, Wand2 } from 'lucide-react'; // LINT_MARKER_SUPPORT

const Support = () => {
    const faqs = [
        {
            q: "How does the AI Object Remover work?",
            a: "Our AI uses advanced inpainting technology (LaMa) to analyze the surrounding pixels and mathematically reconstruct the background behind the removed object for a seamless look."
        },
        {
            q: "What's the difference between Brush and Lasso selection?",
            a: "The Brush tool is for painting over specific areas manually. The Lasso tool allows you to 'circle' an object, and the AI will automatically fill the interior for you."
        },
        {
            q: "Is image quality preserved during watermark removal?",
            a: "Yes! We use a bit-perfect surgical replacement technique that preserves every single original pixel outside the watermark area, ensuring zero loss in clarity."
        },
        {
            q: "How do I download high-res images from Freepik?",
            a: "Just paste the Freepik link into our downloader. We resolve the highest possible resolution available and save it directly to your projects."
        }
    ];

    const guides = [
        {
            title: "Professional Watermark Removal",
            icon: Eraser,
            desc: "Learn how to use surgical precision for stock photo grids.",
            color: "text-violet-400"
        },
        {
            title: "AI Image Enhancement",
            icon: Wand2,
            desc: "Upscale low-resolution photos to 4K with deep learning.",
            color: "text-fuchsia-400"
        },
        {
            title: "Lasso Selection Tips",
            icon: Sparkles,
            desc: "Best practices for circling objects for the best AI results.",
            color: "text-amber-400"
        }
    ];

    return (
        <div className="max-w-4xl mx-auto space-y-12 animate-fade-in pb-20">
            {/* Hero Section */}
            <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-violet-600/20 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-violet-500/30">
                    <HelpCircle className="w-8 h-8 text-violet-500" />
                </div>
                <h2 className="text-4xl font-bold text-white uppercase tracking-tight">How can we help?</h2>
                <p className="text-zinc-500 text-lg max-w-xl mx-auto">
                    Explore our guides, find answers to frequent questions, or get in touch with our expert team.
                </p>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="glass-card p-6 rounded-2xl hover:border-white/20 transition-all group cursor-pointer">
                    <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center mb-4 text-blue-400 group-hover:scale-110 transition-transform">
                        <MessageSquare className="w-5 h-5" />
                    </div>
                    <h4 className="text-white font-bold mb-1">Live Chat</h4>
                    <p className="text-zinc-500 text-xs">Typical response time: 5 mins</p>
                </div>
                <div className="glass-card p-6 rounded-2xl hover:border-white/20 transition-all group cursor-pointer">
                    <div className="w-10 h-10 bg-green-500/10 rounded-xl flex items-center justify-center mb-4 text-green-400 group-hover:scale-110 transition-transform">
                        <Mail className="w-5 h-5" />
                    </div>
                    <h4 className="text-white font-bold mb-1">Email Support</h4>
                    <p className="text-zinc-500 text-xs">support@toolshub.ai</p>
                </div>
                <div className="glass-card p-6 rounded-2xl hover:border-white/20 transition-all group cursor-pointer">
                    <div className="w-10 h-10 bg-amber-500/10 rounded-xl flex items-center justify-center mb-4 text-amber-400 group-hover:scale-110 transition-transform">
                        <BookOpen className="w-5 h-5" />
                    </div>
                    <h4 className="text-white font-bold mb-1">Documentation</h4>
                    <p className="text-zinc-500 text-xs">Read full API & User docs</p>
                </div>
            </div>

            {/* Guides */}
            <div className="space-y-6">
                <h3 className="text-xl font-bold text-white px-2">Featured Guides</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {guides.map((guide, idx) => (
                        <div key={idx} className="flex items-center gap-4 bg-white/5 border border-white/5 p-4 rounded-xl hover:bg-white/10 transition-all cursor-pointer group">
                            <div className={`w-12 h-12 bg-white/5 rounded-lg flex items-center justify-center ${guide.color}`}>
                                <guide.icon className="w-6 h-6" />
                            </div>
                            <div className="flex-1">
                                <h5 className="text-white font-bold text-sm mb-0.5">{guide.title}</h5>
                                <p className="text-zinc-500 text-[11px]">{guide.desc}</p>
                            </div>
                            <ChevronRight className="w-4 h-4 text-zinc-600 group-hover:text-white transition-colors" />
                        </div>
                    ))}
                </div>
            </div>

            {/* FAQ */}
            <div className="space-y-6">
                <h3 className="text-xl font-bold text-white px-2">Frequently Asked Questions</h3>
                <div className="grid grid-cols-1 gap-4">
                    {faqs.map((faq, idx) => (
                        <div key={idx} className="glass-card p-6 rounded-2xl border-white/5 space-y-3">
                            <h5 className="text-white font-bold text-sm flex items-center gap-3">
                                <div className="w-2 h-2 bg-violet-500 rounded-full shadow-[0_0_8px_rgba(139,92,246,0.6)]" />
                                {faq.q}
                            </h5>
                            <p className="text-zinc-400 text-sm leading-relaxed pl-5 border-l border-white/5 ml-1">
                                {faq.a}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            {/* CTA */}
            <div className="bg-gradient-to-r from-violet-600 to-fuchsia-600 p-8 rounded-3xl text-center space-y-4 shadow-2xl shadow-violet-500/20">
                <h4 className="text-2xl font-bold text-white">Still have questions?</h4>
                <p className="text-white/80 max-w-md mx-auto">
                    We're here to help you get the most out of our AI tools. Contact us anytime.
                </p>
                <button className="bg-white text-black font-bold px-8 py-3 rounded-full hover:scale-105 transition-transform flex items-center gap-2 mx-auto">
                    Contact Specialist <ExternalLink className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
};

export default Support;
