import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
    role: 'user' | 'model';
    text: string;
}

export function GeminiChat() {
    const { t, i18n } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMsg = input;
        setInput('');
        setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
        setIsLoading(true);

        try {
            const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

            // MULTI-MODEL FALBACK SYSTEM (The "Shotgun" Approach)
            const MODELS = [
                "v1beta/models/gemini-1.5-flash",
                "v1beta/models/gemini-1.5-flash-001",
                "v1beta/models/gemini-1.0-pro",
                "v1/models/gemini-pro"
            ];

            let lastError = null;
            let successData = null;

            for (const modelPath of MODELS) {
                try {
                    console.log(`Trying model: ${modelPath}...`);
                    const response = await fetch(
                        `https://generativelanguage.googleapis.com/${modelPath}:generateContent?key=${apiKey}`,
                        {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ contents: [{ parts: [{ text: userMsg }] }] })
                        }
                    );

                    const data = await response.json();

                    if (!response.ok || data.error) {
                        throw new Error(data.error?.message || `HTTP ${response.status}`);
                    }

                    // If we get here, it worked!
                    successData = data;
                    break; // Stop the loop
                } catch (e: any) {
                    console.warn(`Model ${modelPath} failed:`, e.message);
                    lastError = e;
                    // Continue to next model
                }
            }

            if (!successData) {
                throw lastError || new Error("All models failed.");
            }

            const aiText = successData.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I couldn't understand that.";

            // Append success note for debug
            const finalText = aiText; // + `\n\n(Generated with ${workedModel})`;

            setMessages(prev => [...prev, { role: 'model', text: finalText }]);
        } catch (error: any) {
            console.error("Gemini Catch Block:", error);
            setMessages(prev => [...prev, { role: 'model', text: `System Error: ${error.message}` }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={`fixed bottom-20 ${i18n.language === 'ar' ? 'left-6' : 'right-6'} z-50 flex flex-col items-end pointer-events-auto`}>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="mb-4 w-80 md:w-96 bg-black/80 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col"
                        style={{ height: '500px' }}
                    >
                        {/* Header */}
                        <div className="p-4 bg-white/5 border-b border-white/10 flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <span className="text-xl">✨</span>
                                <h3 className="text-white font-serif font-bold">Gemini Assistant</h3>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="text-gray-400 hover:text-white transition-colors"
                            >
                                ✕
                            </button>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            {messages.length === 0 && (
                                <div className="text-center text-gray-500 mt-10">
                                    <p className="mb-2">👋</p>
                                    <p className="text-sm">{t('Ask me anything about space!') || "Ask me anything about space!"}</p>
                                </div>
                            )}

                            {messages.map((msg, idx) => (
                                <div
                                    key={idx}
                                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div
                                        className={`max-w-[80%] p-3 rounded-2xl text-sm leading-relaxed ${msg.role === 'user'
                                            ? 'bg-blue-600 text-white rounded-tr-sm'
                                            : 'bg-white/10 text-gray-200 rounded-tl-sm'
                                            }`}
                                    >
                                        {msg.text}
                                    </div>
                                </div>
                            ))}

                            {isLoading && (
                                <div className="flex justify-start">
                                    <div className="bg-white/10 p-3 rounded-2xl rounded-tl-sm flex gap-1">
                                        <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                        <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                        <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input */}
                        <div className="p-4 bg-white/5 border-t border-white/10">
                            <form
                                className="flex gap-2"
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    handleSend();
                                }}
                            >
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder="Type your question..."
                                    className="flex-1 bg-black/50 border border-white/10 rounded-xl px-4 py-2 text-white text-sm focus:outline-none focus:border-blue-500/50 transition-colors"
                                />
                                <button
                                    type="submit"
                                    disabled={isLoading || !input.trim()}
                                    className="p-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl text-white transition-colors"
                                >
                                    ➤
                                </button>
                            </form>
                            {/* Version Debug Indicator */}
                            <div className="text-[10px] text-cyan-400 text-center mt-1">
                                System: v3.0 (Robust Check)
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <button
                onClick={() => setIsOpen(!isOpen)}
                className="group flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-[0_0_20px_rgba(0,255,255,0.4)] hover:shadow-[0_0_30px_rgba(0,255,255,0.6)] hover:scale-105 transition-all duration-300"
            >
                {isOpen ? (
                    <span className="text-xl">✕</span>
                ) : (
                    <span className="text-2xl group-hover:rotate-12 transition-transform">🤖</span>
                )}
            </button>
        </div>
    );
}
