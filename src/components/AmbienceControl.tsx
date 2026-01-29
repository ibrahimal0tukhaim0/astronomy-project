import { useState, useEffect } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

// 🎛️ AMBIENCE UI CONTROL - LIVES OUTSIDE CANVAS
// This is a pure HTML Overlay, guaranteed to be fixed.
export function AmbienceControl() {
    const [muted, setMuted] = useState(false);

    // Sync with global event bus
    useEffect(() => {
        const handleMuteChange = (e: CustomEvent) => {
            setMuted(e.detail.muted);
        };
        window.addEventListener('ambience-mute-changed', handleMuteChange as EventListener);
        return () => window.removeEventListener('ambience-mute-changed', handleMuteChange as EventListener);
    }, []);

    const toggleMute = () => {
        const newState = !muted;
        setMuted(newState);
        // Dispatch event for SpaceLightning to hear
        window.dispatchEvent(new CustomEvent('ambience-toggle', { detail: { muted: newState } }));
    };

    return (
        <div style={{
            position: 'fixed',
            bottom: '30px',
            right: '30px',
            zIndex: 50, // High enough but below modals
            pointerEvents: 'auto',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontFamily: 'system-ui, -apple-system, sans-serif'
        }}>
            <button
                onClick={toggleMute}
                onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.05)';
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
                    e.currentTarget.style.boxShadow = '0 8px 32px 0 rgba(31, 38, 135, 0.37)';
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                    e.currentTarget.style.boxShadow = '0 4px 16px 0 rgba(0, 0, 0, 0.2)';
                }}
                style={{
                    // Glassmorphism Base
                    background: 'rgba(255, 255, 255, 0.05)',
                    backdropFilter: 'blur(16px)',
                    WebkitBackdropFilter: 'blur(16px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '12px',

                    // Typography & Layout (SCALED DOWN)
                    color: 'white',
                    padding: '6px 10px',
                    cursor: 'pointer',
                    fontSize: '11px',
                    fontWeight: 500,
                    letterSpacing: '0.5px',

                    // Transitions & Flex
                    transition: 'all 0.3s ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    boxShadow: '0 4px 16px 0 rgba(0, 0, 0, 0.2)',
                    fontFamily: '"Cairo", "SF Pro Display", sans-serif'
                }}
            >
                <span className="flex items-center justify-center w-5 h-5">{muted ? <VolumeX size={18} /> : <Volume2 size={18} />}</span>
                <span style={{
                    opacity: 0.9,
                    textShadow: '0 2px 4px rgba(0,0,0,0.2)'
                }}>
                    {muted ? "الصوت مكتوم" : "صوت المحيط"}
                </span>
            </button>


            <style>{`
              @keyframes bounce {
                0%, 100% { transform: translateY(0); }
                50% { transform: translateY(-5px); }
              }
            `}</style>
        </div>
    );
}
