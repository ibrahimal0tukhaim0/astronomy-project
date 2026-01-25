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

            // SIMPLIFIED: Using the single most stable model
            const MODEL_NAME = "gemini-2.5-flash"; // 2026 Standard
            const API_VERSION = "v1beta"; // 2.5 might require beta or v1. Diagnostic showed v1beta in error, so safe to use v1beta.beta";
            const FULL_MODEL_PATH = `${API_VERSION}/models/${MODEL_NAME}`;

            console.log(`Attempting Gemini with: ${FULL_MODEL_PATH}`);

            let response = await fetch(
                `https://generativelanguage.googleapis.com/${FULL_MODEL_PATH}:generateContent?key=${apiKey}`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ contents: [{ parts: [{ text: userMsg }] }] })
                }
            );

            let data = await response.json();

            // Step 2: Critical Failure Handling - Run Diagnostics
            if (!response.ok || data.error) {
                const originalError = data.error?.message || `HTTP ${response.status}`;
                console.warn("Primary model failed. Running Diagnostics...", originalError);

                // Diagnostic: List available models
                try {
                    const listResponse = await fetch(
                        `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`
                    );
                    const listData = await listResponse.json();

                    if (listData.models) {
                        const availableModels = listData.models
                            .map((m: any) => m.name.replace('models/', ''))
                            .filter((n: string) => n.includes('gemini'));

                        throw new Error(
                            `Model '${MODEL_NAME}' failed. Available models for your key:\n` +
                            availableModels.join(', ')
                        );
                    } else {
                        throw new Error(`Failed: ${originalError} (And could not list models: ${listData.error?.message})`);
                    }
                } catch (diagError: any) {
                    // If listing fails, throw original error + diag error
                    throw new Error(`${originalError} || Diag failed: ${diagError.message}`);
                }
            }

            // If we get here, it worked!
            const successData = data;

            const aiText = successData.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I couldn't understand that.";
            const finalText = aiText;

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
                            <div className="text-[10px] text-cyan-400 text-center mt-1 flex flex-col gap-0.5">
                                <span>System: v4.4 (Final Key Check)</span>
                                <span className="opacity-70">
                                    Key Ends: {import.meta.env.VITE_GEMINI_API_KEY ? `...${import.meta.env.VITE_GEMINI_API_KEY.slice(-5)}` : 'NONE'}
                                </span>
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
