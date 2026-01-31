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
        <div style={{ fontFamily: '"Cairo", sans-serif' }}>
            {/* Hamburger Button - Standardized Touch Target */}
            <button
                onClick={toggleMenu}
                style={{ top: 'calc(1.25rem + env(safe-area-inset-top))' }}
                className="fixed left-6 z-[60] touch-target p-4 bg-black/40 hover:bg-black/60 backdrop-blur-xl rounded-2xl text-white transition-all duration-300 border border-white/10 active:scale-95 flex items-center justify-center shadow-lg"
                aria-label="Menu"
                aria-expanded={isOpen}
                aria-controls="navigation-menu"
            >
                <div className="w-6 h-5 flex flex-col justify-between items-center transition-all">
                    <motion.span
                        animate={isOpen ? { rotate: 45, y: 9 } : { rotate: 0, y: 0 }}
                        className="w-full h-0.5 bg-white rounded-full bg-gradient-to-r from-blue-200 to-white"
                    />
                    <motion.span
                        animate={isOpen ? { opacity: 0, x: -10 } : { opacity: 1, x: 0 }}
                        className="w-full h-0.5 bg-white rounded-full"
                    />
                    <motion.span
                        animate={isOpen ? { rotate: -45, y: -9 } : { rotate: 0, y: 0 }}
                        className="w-full h-0.5 bg-white rounded-full bg-gradient-to-r from-white to-blue-200"
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
                            className="fixed inset-0 bg-black/70 backdrop-blur-md z-[70]"
                            aria-hidden="true"
                        />

                        {/* Sidebar */}
                        <motion.div
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{ type: 'spring', damping: 28, stiffness: 220 }}
                            className="fixed top-0 left-0 h-full w-[min(85vw,360px)] glass-panel border-r border-white/10 z-[80] overflow-y-auto"
                            id="navigation-menu"
                            role="dialog"
                            aria-modal="true"
                        >
                            <div className="p-8 pt-safe flex flex-col h-full">
                                <div className="mb-10">
                                    <h2 className="text-3xl font-bold text-white mb-2">
                                        {t('app.title')}
                                    </h2>
                                    <p className="text-xs text-blue-300/60 font-medium tracking-widest uppercase">
                                        {t('app.subtitle')}
                                    </p>
                                </div>

                                <nav className="space-y-3 flex-1">
                                    {celestialObjects.map((obj) => (
                                        <button
                                            key={obj.id}
                                            onClick={() => handleItemClick(obj.id)}
                                            className="w-full touch-target text-right group p-4 rounded-2xl bg-white/5 hover:bg-white/10 transition-all flex items-center justify-end gap-5 border border-white/5 active:scale-[0.98]"
                                        >
                                            <span className="text-gray-300 group-hover:text-white font-bold text-sm tracking-wide transition-colors">
                                                {t(`objects.${obj.id}.name`)}
                                            </span>

                                            <div
                                                className="w-8 h-8 rounded-full shadow-lg border-2 border-white/20 ring-2 ring-black/20"
                                                style={{
                                                    backgroundColor: obj.science.color,
                                                    boxShadow: `0 0 15px ${obj.science.color}44`
                                                }}
                                            />
                                        </button>
                                    ))}
                                </nav>

                                <div className="mt-8 pt-6 border-t border-white/10 text-center opacity-40">
                                    <p className="text-[10px] uppercase tracking-widest">
                                        جميع الحقوق محفوظة © 2026
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
