import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X, Send, Bot, MessageSquare, Loader2 } from 'lucide-react';

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
    const isRTL = i18n.language === 'ar';

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
            const MODEL_NAME = "gemini-2.5-flash";
            const API_VERSION = "v1beta";
            const FULL_MODEL_PATH = `${API_VERSION}/models/${MODEL_NAME}`;

            const response = await fetch(
                `https://generativelanguage.googleapis.com/${FULL_MODEL_PATH}:generateContent?key=${apiKey}`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ contents: [{ parts: [{ text: userMsg }] }] })
                }
            );

            const data = await response.json();

            if (!response.ok || data.error) {
                // ... (Error handling remains same, kept concise for replace)
                const originalError = data.error?.message || `HTTP ${response.status}`;
                console.warn("Primary model failed.", originalError);
                throw new Error(originalError);
            }

            const aiText = data.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I couldn't understand that.";
            setMessages(prev => [...prev, { role: 'model', text: aiText }]);
        } catch (error: any) {
            console.error("Gemini Catch Block:", error);
            setMessages(prev => [...prev, { role: 'model', text: `System Error: ${error.message}` }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="relative z-50 flex flex-col items-center pointer-events-auto">

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="mb-4 w-80 md:w-96 bg-black/80 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col"
                        style={{ height: '500px' }}
                        dir={isRTL ? 'rtl' : 'ltr'}
                    >
                        {/* Header */}
                        <div className="p-4 bg-white/5 border-b border-white/10 flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <Sparkles className="w-5 h-5 text-yellow-400" />
                                <h3 className="text-white font-serif font-bold">{t('Gemini Assistant') || 'Gemini Assistant'}</h3>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="text-gray-400 hover:text-white transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            {messages.length === 0 && (
                                <div className="text-center text-gray-500 mt-10 flex flex-col items-center">
                                    <MessageSquare className="w-8 h-8 mb-2 opacity-50" />
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
                                    <div className="bg-white/10 p-3 rounded-2xl rounded-tl-sm flex gap-1 items-center">
                                        <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
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
                                    placeholder={t('Type your question...') || "Type your question..."}
                                    className={`flex-1 bg-black/50 border border-white/10 rounded-xl px-4 py-2 text-white text-sm focus:outline-none focus:border-blue-500/50 transition-colors ${isRTL ? 'text-right' : 'text-left'}`}
                                />
                                <button
                                    type="submit"
                                    disabled={isLoading || !input.trim()}
                                    className={`p-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl text-white transition-colors ${isRTL ? 'rotate-180' : ''}`}
                                >
                                    <Send className="w-4 h-4" />
                                </button>
                            </form>
                            {/* Version Debug Indicator */}
                            <div className="text-[10px] text-cyan-400 text-center mt-1 flex flex-col gap-0.5" dir="ltr">
                                <span>System: v5.1 (Lucide Icons)</span>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <button
                onClick={() => setIsOpen(!isOpen)}
                className="group flex items-center justify-center w-14 h-14 rounded-full text-white hover:scale-105 transition-all duration-300 backdrop-blur-md bg-white/10 border border-white/20 shadow-[0_0_15px_rgba(255,255,255,0.1)] hover:shadow-[0_0_25px_rgba(255,255,255,0.2)]"
            >
                {isOpen ? (
                    <X className="w-6 h-6" />
                ) : (
                    <Bot className="w-7 h-7 group-hover:rotate-12 transition-transform" />
                )}
            </button>
        </div>
    );
}
