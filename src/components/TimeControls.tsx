import { useTranslation } from 'react-i18next';

interface TimeControlsProps {
    isPaused: boolean;
    currentDate: Date;
    onPauseToggle: () => void;
}


export function TimeControls({
    isPaused,
    currentDate,
    onPauseToggle,
}: TimeControlsProps) {
    const { t, i18n } = useTranslation();

    const formatDate = (date: Date) => {
        return date.toLocaleString(i18n.language === 'ar' ? 'ar-SA' : 'en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-black/80 backdrop-blur-xl border border-white/20 rounded-2xl p-4 shadow-2xl z-40 pointer-events-auto transform scale-80 origin-bottom">
            <div className="flex flex-col gap-3">
                {/* Date Display */}
                <div className="text-center text-white font-mono text-sm border-b border-white/10 pb-2">
                    {formatDate(currentDate)}
                </div>

                <div className="flex items-center gap-3">
                    {/* Pause/Play Button */}
                    <button
                        onClick={onPauseToggle}
                        className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/40 text-white transition-all"
                        title={isPaused ? t('ui.controls.play') || 'Play' : t('ui.controls.pause') || 'Pause'}
                    >
                        {isPaused ? (
                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M8 5v14l11-7z" />
                            </svg>
                        ) : (
                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                            </svg>
                        )}
                    </button>

                </div>
            </div>
        </div>
    );
}
