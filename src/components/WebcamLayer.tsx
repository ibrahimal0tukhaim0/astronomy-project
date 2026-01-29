import { useEffect, useRef, useState } from 'react';

// 🎥 AR Webcam Overlay (HTML Video Background)
export function WebcamLayer() {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [error, setError] = useState<string | null>(null);
    const [logs, setLogs] = useState<string[]>([]);

    const addLog = (msg: string) => {
        console.log(`AR: ${msg}`);
        setLogs(prev => [...prev.slice(-4), msg]); // Keep last 5 logs
    };

    const startWebcam = async (attemptLevel: 'hd-rear' | 'simple-rear' | 'any' = 'hd-rear') => {
        const video = videoRef.current;
        if (!video) return;

        addLog(`Attempting: ${attemptLevel}...`);

        let constraints: MediaStreamConstraints = { audio: false };

        if (attemptLevel === 'hd-rear') {
            constraints.video = { facingMode: 'environment', width: { ideal: 1920 }, height: { ideal: 1080 } };
        } else if (attemptLevel === 'simple-rear') {
            constraints.video = { facingMode: 'environment' };
        } else {
            constraints.video = true;
        }

        try {
            addLog("Requesting stream...");

            // Watchdog: If stream takes > 5s, throw error
            const streamPromise = navigator.mediaDevices.getUserMedia(constraints);
            const timeoutPromise = new Promise((_, reject) =>
                setTimeout(() => reject(new Error("Timeout: Stream took too long")), 5000)
            );

            const stream = await Promise.race([streamPromise, timeoutPromise]) as MediaStream;

            addLog("Stream acquired. Attaching...");
            video.srcObject = stream;

            // 🛡️ ANTI-FLICKER: Force Playback Logic
            const forcePlay = () => {
                if (video.paused) {
                    video.play().catch(e => console.warn("Auto-resume failed", e));
                }
            };

            video.onloadedmetadata = () => {
                addLog("Metadata loaded. Playing...");
                video.play()
                    .then(() => {
                        addLog("✅ Video Playing!");
                        setLogs([]);
                    })
                    .catch(e => {
                        addLog(`❌ Play failed: ${e.message}`);
                        console.error(e);
                    });
            };

            // 🛡️ ANTI-FLICKER: Event Listeners
            video.onpause = () => { console.warn("AR: Paused! Resuming..."); forcePlay(); };
            video.onsuspend = () => { console.warn("AR: Suspended! Resuming..."); forcePlay(); };

            setError(null);
        } catch (err: any) {
            addLog(`⚠️ Attempt failed: ${err.message}`);

            // Try next level
            if (attemptLevel === 'hd-rear') {
                startWebcam('simple-rear');
            } else if (attemptLevel === 'simple-rear') {
                startWebcam('any');
            } else {
                const errorMsg = err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError'
                    ? "تم رفض إذن الكاميرا. يرجى تفعيل الإذن من إعدادات المتصفح."
                    : `فشل تشغيل الكاميرا: ${err.name || 'Unknown'} - ${err.message}`;

                setError(errorMsg);
            }
        }
    };

    useEffect(() => {
        startWebcam('hd-rear');

        // 🛡️ ANTI-FLICKER: Persistent Watchdog
        const interval = setInterval(() => {
            const video = videoRef.current;
            if (video && video.paused && video.srcObject) {
                console.log("AR Watchdog: Forcing Playback");
                video.play().catch(() => { });
            }
        }, 1000);

        return () => {
            clearInterval(interval);
            if (videoRef.current && videoRef.current.srcObject) {
                const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
                tracks.forEach(track => track.stop());
            }
        };
    }, []);

    if (error) {
        return (
            <div className="fixed inset-0 z-[-10] bg-black flex flex-col items-center justify-center text-white text-center p-4">
                <div className="bg-red-900/50 p-6 rounded-xl border border-red-500/30 max-w-md">
                    <h3 className="text-xl font-bold mb-2">⚠️ مشكلة في الكاميرا</h3>
                    <p className="mb-4 text-red-100">{error}</p>
                    <div className="text-left bg-black/50 p-2 rounded text-xs font-mono mb-4 text-gray-400">
                        {logs.map((l, i) => <div key={i}>{l}</div>)}
                    </div>
                    <button
                        onClick={() => { setError(null); setLogs([]); startWebcam('hd-rear'); }}
                        className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-full font-bold transition-colors"
                    >
                        إعادة المحاولة
                    </button>
                </div>
            </div>
        );
    }

    return (
        <>
            {/* Debug Logs Overlay - Visible while loading */}
            {logs.length > 0 && (
                <div className="fixed top-20 left-4 z-50 pointer-events-none text-left">
                    {logs.map((log, i) => (
                        <div key={i} className="text-green-400 text-xs font-mono bg-black/50 px-2 py-1 mb-1 rounded backdrop-blur-sm border border-green-500/20">
                            {log}
                        </div>
                    ))}
                </div>
            )}

            <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="fixed inset-0 w-full h-full object-cover z-[1] pointer-events-none"
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    zIndex: 1,
                    pointerEvents: 'none',
                    // 🛡️ ANTI-FLICKER: Force GPU Layer
                    willChange: 'transform',
                    transform: 'translateZ(0)'
                }}
            />
        </>
    );
}
