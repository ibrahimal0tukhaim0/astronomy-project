import type { CelestialData } from '../types'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { ContentDisclaimer } from './ContentDisclaimer'

interface InfoPanelProps {
    selectedObject: CelestialData | null
    onClose: () => void
}

export function InfoPanel({ selectedObject, onClose }: InfoPanelProps) {
    const { t, i18n } = useTranslation();

    if (!selectedObject) return null

    const objKey = `objects.${selectedObject.id}`;

    return (
        <AnimatePresence>
            <motion.div
                key={selectedObject.id}
                initial={{ x: i18n.language === 'ar' ? '-100%' : '100%', opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: i18n.language === 'ar' ? '-100%' : '100%', opacity: 0 }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                style={{
                    backgroundImage: selectedObject.science.realImage
                        ? `linear-gradient(to bottom, rgba(0,0,0,0.8), rgba(0,0,0,0.95)), url(${import.meta.env.BASE_URL}${selectedObject.science.realImage})`
                        : 'none',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                }}
                className={`absolute top-0 ${i18n.language === 'ar' ? 'left-0 border-r' : 'right-0 border-l'} h-full w-full md:w-[520px] bg-black/90 backdrop-blur-xl border-white/10 text-white overflow-y-auto z-50 shadow-2xl mobile-scaled-panel origin-top-right`}
                role="dialog"
                aria-modal="true"
                aria-labelledby="info-panel-title"
            >
                {/* 📱 Mobile Scaling Styles */}
                <style>{`
                    @media (max-width: 768px) {
                        .mobile-scaled-panel {
                            transform: scale(0.85);
                            transform-origin: top ${i18n.language === 'ar' ? 'left' : 'right'};
                        }
                        .safe-area-padding {
                            padding-top: calc(24px + env(safe-area-inset-top));
                            padding-bottom: calc(80px + env(safe-area-inset-bottom));
                        }
                    }
                `}</style>

                <div className="p-6 md:p-8 pb-20 space-y-6 md:space-y-8 safe-area-padding">
                    {/* Header - Object Name */}
                    <div className="flex justify-between items-start">
                        <div className="flex-1">
                            <h2
                                id="info-panel-title"
                                className="text-3xl md:text-5xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-white mb-2"
                            >
                                {t(`${objKey}.name`)}
                            </h2>
                            <p className="text-sm text-gray-400 italic">
                                {t(`${objKey}.historical_name`)}
                            </p>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-white/10 rounded-full transition-colors text-gray-400 hover:text-white flex-shrink-0"
                            aria-label="Close"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* Scientific Description */}
                    <section className="bg-white/5 p-5 rounded-xl border border-white/5">
                        <h3 className="text-xl font-semibold mb-4 flex items-center text-blue-300">
                            <span className="ml-2 rtl:mr-2">🔭</span> {t('ui.scientific_facts')}
                        </h3>
                        <div className="space-y-3 text-sm text-gray-300">
                            <div className="flex justify-between border-b border-white/5 pb-2">
                                <span className="text-gray-400">{t('ui.labels.type')}:</span>
                                <span className="text-white font-medium">{t(`${objKey}.science.type`)}</span>
                            </div>
                            <div className="flex justify-between border-b border-white/5 pb-2">
                                <span className="text-gray-400">{t('ui.labels.distance')}:</span>
                                <span className="text-white font-medium">{t(`${objKey}.science.distance`)}</span>
                            </div>
                            <div className="flex justify-between border-b border-white/5 pb-2">
                                <span className="text-gray-400">{t('ui.labels.size')}:</span>
                                <span className="text-white font-medium">{t(`${objKey}.science.size`)}</span>
                            </div>
                            <div className="flex justify-between border-b border-white/5 pb-2">
                                <span className="text-gray-400">{t('ui.labels.brightness')}:</span>
                                <span className="text-white font-medium">{t(`${objKey}.science.brightness`)}</span>
                            </div>

                            {/* New Extended Details */}
                            {t(`${objKey}.science.surface_temp`, { defaultValue: '' }) && (
                                <div className="flex justify-between border-b border-white/5 pb-2">
                                    <span className="text-gray-400">{t('ui.labels.surface_temp')}:</span>
                                    <span className="text-white font-medium text-right">{t(`${objKey}.science.surface_temp`)}</span>
                                </div>
                            )}
                            {t(`${objKey}.science.day_length`, { defaultValue: '' }) && (
                                <div className="flex justify-between border-b border-white/5 pb-2">
                                    <span className="text-gray-400">{t('ui.labels.day_length')}:</span>
                                    <span className="text-white font-medium text-right">{t(`${objKey}.science.day_length`)}</span>
                                </div>
                            )}
                            {t(`${objKey}.science.orbital_period`, { defaultValue: '' }) && (
                                <div className="flex justify-between border-b border-white/5 pb-2">
                                    <span className="text-gray-400">{t('ui.labels.orbital_period')}:</span>
                                    <span className="text-white font-medium text-right">{t(`${objKey}.science.orbital_period`)}</span>
                                </div>
                            )}
                            {t(`${objKey}.science.moons`, { defaultValue: '' }) && (
                                <div className="flex justify-between border-b border-white/5 pb-2">
                                    <span className="text-gray-400">{t('ui.labels.moons')}:</span>
                                    <span className="text-white font-medium text-right">{t(`${objKey}.science.moons`)}</span>
                                </div>
                            )}

                            {/* Deep Scientific Details: Composition & Unique Features */}
                            {(t(`${objKey}.science.atmosphere`, { defaultValue: '' }) || t(`${objKey}.science.structure`, { defaultValue: '' })) && (
                                <div className="mt-4 pt-4 border-t border-white/10">
                                    <h4 className="text-sm font-semibold text-blue-200 mb-3 flex items-center">
                                        <span className="ml-2">🪐</span> {t('ui.scientific_facts')} (التركيب)
                                    </h4>

                                    {t(`${objKey}.science.atmosphere`, { defaultValue: '' }) && (
                                        <div className="mb-2">
                                            <span className="text-gray-400 block text-xs mb-1">{t('ui.labels.atmosphere')}:</span>
                                            <span className="text-white text-sm leading-snug block bg-white/5 p-2 rounded border border-white/5">
                                                {t(`${objKey}.science.atmosphere`)}
                                            </span>
                                        </div>
                                    )}

                                    {t(`${objKey}.science.structure`, { defaultValue: '' }) && (
                                        <div className="mb-2">
                                            <span className="text-gray-400 block text-xs mb-1">{t('ui.labels.structure')}:</span>
                                            <span className="text-white text-sm leading-snug block bg-white/5 p-2 rounded border border-white/5">
                                                {t(`${objKey}.science.structure`)}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            )}

                            {t(`${objKey}.science.unique_feature`, { defaultValue: '' }) && (
                                <div className="mt-4 bg-blue-500/10 border border-blue-500/20 p-3 rounded-lg">
                                    <div className="flex items-start">
                                        <span className="text-lg ml-2">💡</span>
                                        <div>
                                            <span className="text-blue-300 text-xs font-bold block mb-1">{t('ui.labels.unique_feature')}:</span>
                                            <span className="text-gray-100 text-sm italic">
                                                "{t(`${objKey}.science.unique_feature`)}"
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            )}
                            <p className="mt-4 pt-4 leading-relaxed text-gray-200 border-t border-white/5">
                                {t(`${objKey}.description`)}
                            </p>
                        </div>
                    </section>

                    {/* Quranic Reference */}
                    <section className="bg-emerald-900/20 p-6 rounded-xl border border-emerald-500/20">
                        <h3 className="text-xl font-semibold mb-4 flex items-center text-emerald-300">
                            <span className="ml-2 rtl:mr-2">📖</span> {t('ui.quranic_reference')}
                        </h3>

                        {/* Quranic Verse - Arabic with special styling */}
                        <div className="text-center mb-5 p-4 bg-emerald-950/30 rounded-lg">
                            <p className="text-xl md:text-3xl leading-loose text-white mb-3 font-arabic" style={{ fontFamily: "'Amiri', 'Scheherazade New', serif" }}>
                                {t(`${objKey}.quran.text`)}
                            </p>
                            <p className="text-sm text-emerald-300 font-medium">
                                {t(`${objKey}.quran.reference`)}
                            </p>
                        </div>

                        {/* Tafsir Section */}
                        <div className="text-sm text-gray-300 border-t border-emerald-500/20 pt-4 mt-2">
                            <ContentDisclaimer type="tafsir" source={t(`${objKey}.tafsir.source`)} />
                            <div className="flex items-center gap-2 mb-2">
                                <span className="font-bold text-emerald-200">
                                    {t('ui.labels.tafsir')}
                                </span>
                                <span className="text-xs px-2 py-1 bg-emerald-500/20 text-emerald-300 rounded">
                                    {t(`${objKey}.tafsir.source`)}
                                </span>
                            </div>
                            <p className="leading-relaxed text-gray-200">
                                {t(`${objKey}.tafsir.text`)}
                            </p>
                        </div>
                    </section>

                    {/* Historical Context */}
                    <section className="bg-amber-900/20 p-5 rounded-xl border border-amber-500/20">
                        <h3 className="text-xl font-semibold mb-4 flex items-center text-amber-300">
                            <span className="ml-2 rtl:mr-2">📜</span> {t('ui.historical_beliefs')}
                        </h3>
                        <div className="text-sm space-y-3 text-gray-300">
                            <div>
                                <strong className="text-amber-200 block mb-1">
                                    {t('ui.labels.worshipped_by')}:
                                </strong>
                                <p className="text-gray-200">{t(`${objKey}.history.worshipped_by`)}</p>
                            </div>
                            <div>
                                <strong className="text-amber-200 block mb-1">
                                    {t('ui.labels.reason')}:
                                </strong>
                                <p className="text-gray-200">{t(`${objKey}.history.reason`)}</p>
                            </div>
                            <div className="mt-3 p-3 bg-red-900/20 border-r-4 border-red-500 rtl:border-r-0 rtl:border-l-4 rounded">
                                <p className="text-red-200 font-medium italic">
                                    "{t(`${objKey}.history.verdict`)}"
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Monotheistic Message - Reflection */}
                    <section className="text-center p-6 bg-gradient-to-b from-blue-900/30 to-purple-900/20 rounded-xl border border-blue-400/20">
                        <ContentDisclaimer type="reflection" />
                        <h3 className="text-2xl font-serif text-blue-200 mb-4">
                            {t('ui.reflection')}
                        </h3>
                        <p className="text-lg text-blue-50 font-serif leading-relaxed" style={{ lineHeight: '2' }}>
                            <span className="text-2xl text-blue-300">"</span>
                            {t(`${objKey}.monotheism_message`)}
                            <span className="text-2xl text-blue-300">"</span>
                        </p>
                    </section>

                    {/* 🌟 New Custom Sections for ISS (and others) */}

                    {/* Custom Scientific Facts */}
                    {selectedObject.science.facts && (
                        <section className="bg-white/5 p-5 rounded-xl border border-white/5">
                            <h3 className="text-xl font-semibold mb-4 flex items-center text-blue-300">
                                <span className="ml-2 rtl:mr-2">🔭</span> {t('ui.scientific_facts')}
                            </h3>
                            <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-line">
                                {selectedObject.science.facts}
                            </p>
                        </section>
                    )}

                    {/* Custom Quranic Reference */}
                    {selectedObject.science.quranse && (
                        <section className="bg-emerald-900/20 p-6 rounded-xl border border-emerald-500/20">
                            <h3 className="text-xl font-semibold mb-4 flex items-center text-emerald-300">
                                <span className="ml-2 rtl:mr-2">📖</span> {t('ui.quranic_reference')}
                            </h3>
                            <p className="text-lg text-white leading-loose whitespace-pre-line font-serif" style={{ fontFamily: "'Amiri', serif" }}>
                                {selectedObject.science.quranse}
                            </p>
                        </section>
                    )}

                    {/* Custom Historical Context */}
                    {selectedObject.science.history && (
                        <section className="bg-amber-900/20 p-5 rounded-xl border border-amber-500/20">
                            <h3 className="text-xl font-semibold mb-4 flex items-center text-amber-300">
                                <span className="ml-2 rtl:mr-2">📜</span> {t('ui.historical_beliefs')}
                            </h3>
                            <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-line">
                                {selectedObject.science.history}
                            </p>
                        </section>
                    )}

                    {/* Custom Reflection Note */}
                    {selectedObject.science.note && (
                        <section className="text-center p-6 bg-gradient-to-b from-blue-900/30 to-purple-900/20 rounded-xl border border-blue-400/20">
                            <h3 className="text-2xl font-serif text-blue-200 mb-4">
                                {t('ui.reflection')}
                            </h3>
                            <p className="text-lg text-blue-50 font-serif leading-relaxed whitespace-pre-line">
                                {selectedObject.science.note}
                            </p>
                        </section>
                    )}

                    {/* Arabic Poetry Section */}
                    {selectedObject.science.poetry && (
                        <section className="text-center p-6 bg-gradient-to-b from-amber-900/30 to-orange-900/20 rounded-xl border border-amber-400/20">
                            <h3 className="text-xl font-serif text-amber-200 mb-4 flex items-center justify-center">
                                <span className="ml-2">📜</span> الشعر العربي
                            </h3>
                            <p className="text-lg text-amber-50 font-serif leading-loose whitespace-pre-line" style={{ fontFamily: "'Amiri', serif", lineHeight: '2.5' }}>
                                {selectedObject.science.poetry}
                            </p>
                        </section>
                    )}

                </div>
            </motion.div>
        </AnimatePresence >
    )
}
