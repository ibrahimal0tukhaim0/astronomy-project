import { motion } from 'framer-motion';

interface ContentDisclaimerProps {
    type: 'tafsir' | 'reflection';
    source?: string;
}

/**
 * Component to display content disclaimers
 * Ensures users understand the nature of the content they're reading
 */
export function ContentDisclaimer({ type, source }: ContentDisclaimerProps) {
    if (type === 'tafsir') {
        return (
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 mb-3 p-2 bg-amber-900/20 border border-amber-500/30 rounded-lg"
            >
                <svg className="w-4 h-4 text-amber-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <p className="text-xs text-amber-200">
                    <span className="font-semibold">تنبيه:</span> تفسير مختصر من مصادر كلاسيكية
                    {source && ` (${source})`}
                </p>
            </motion.div>
        );
    }

    if (type === 'reflection') {
        return (
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 mb-3 p-2 bg-blue-900/20 border border-blue-500/30 rounded-lg"
            >
                <svg className="w-4 h-4 text-blue-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <p className="text-xs text-blue-200">
                    <span className="font-semibold">ملاحظة:</span> رأي تعليمي تأملي - يُراجع من مختص
                </p>
            </motion.div>
        );
    }

    return null;
}
