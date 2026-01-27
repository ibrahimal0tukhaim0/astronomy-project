import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { celestialObjects } from '../data/objects';
import { useTranslation } from 'react-i18next';

interface NavigationSidebarProps {
    onNavigate: (objectId: string) => void;
}

export function NavigationSidebar({ onNavigate }: NavigationSidebarProps) {
    const [isOpen, setIsOpen] = useState(false);
    const { t } = useTranslation();

    const toggleMenu = () => setIsOpen(!isOpen);

    const handleItemClick = (id: string) => {
        onNavigate(id);
        setIsOpen(false);
    };

    return (
        <>
            {/* 📱 Mobile Scaling & Safe Area Utilities */}
            <style>{`
                @media (max-width: 768px) {
                    .mobile-scaled-ui {
                        transform: scale(0.85);
                        transform-origin: top left;
                    }
                    .safe-area-top {
                        padding-top: env(safe-area-inset-top);
                    }
                }
            `}</style>

            {/* Hamburger Button (Top-Left for RTL Balance) */}
            <button
                onClick={toggleMenu}
                style={{ top: 'calc(1rem + env(safe-area-inset-top))' }}
                className="absolute left-6 z-50 p-3 bg-black/30 hover:bg-black/50 backdrop-blur-md rounded-full text-white transition-all duration-300 border border-white/10 hover:border-white/30 mobile-scaled-ui"
                aria-label="Menu"
                aria-expanded={isOpen}
                aria-controls="navigation-menu"
            >
                <div className="w-6 h-5 flex flex-col justify-between items-center">
                    <motion.span
                        animate={isOpen ? { rotate: 45, y: 8 } : { rotate: 0, y: 0 }}
                        className="w-full h-0.5 bg-white rounded-full origin-center transition-transform"
                    />
                    <motion.span
                        animate={isOpen ? { opacity: 0 } : { opacity: 1 }}
                        className="w-full h-0.5 bg-white rounded-full transition-opacity"
                    />
                    <motion.span
                        animate={isOpen ? { rotate: -45, y: -8 } : { rotate: 0, y: 0 }}
                        className="w-full h-0.5 bg-white rounded-full origin-center transition-transform"
                    />
                </div>
            </button>

            {/* Overlay Menu */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={toggleMenu}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm z-40"
                            aria-hidden="true"
                        />

                        {/* Sidebar (Left Side) */}
                        <motion.div
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="absolute top-0 left-0 h-full w-80 glass-menu border-r-0 z-50 overflow-y-auto mobile-scaled-ui origin-top-left"
                            id="navigation-menu"
                            role="dialog"
                            aria-modal="true"
                            aria-label="Celestial Navigation"
                        >
                            <div className="p-8 safe-area-top">
                                <h2 className="text-2xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-white mb-8 border-b border-white/10 pb-4">
                                    {t('app.title')}
                                </h2>

                                <div className="space-y-2">
                                    {celestialObjects.map((obj) => (
                                        <button
                                            key={obj.id}
                                            onClick={() => handleItemClick(obj.id)}
                                            className="w-full text-right group p-3 rounded-lg hover:bg-white/5 transition-all flex items-center justify-end gap-3 border border-transparent hover:border-white/5"
                                        >
                                            <span className="text-gray-300 group-hover:text-white font-medium transition-colors">
                                                {t(`objects.${obj.id}.name`)}
                                            </span>

                                            {/* Object Icon/Indicator */}
                                            <div
                                                className="w-8 h-8 rounded-full shadow-inner border border-white/10"
                                                style={{ backgroundColor: obj.science.color }}
                                            />
                                        </button>
                                    ))}
                                </div>

                                <div className="mt-12 pt-8 border-t border-white/10 text-center">
                                    <p className="text-xs text-gray-500">
                                        {t('app.subtitle')}
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
