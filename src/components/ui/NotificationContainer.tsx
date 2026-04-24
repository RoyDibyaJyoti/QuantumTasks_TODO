import { useNotificationStore } from '../../store/useNotificationStore';
import { motion, AnimatePresence } from 'motion/react';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

export default function NotificationContainer() {
  const { toasts, removeToast } = useNotificationStore();

  return (
    <div className="fixed bottom-8 right-8 z-[100] flex flex-col gap-3 pointer-events-none">
      <AnimatePresence mode="popLayout">
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            layout
            initial={{ opacity: 0, x: 20, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 20, scale: 0.9 }}
            className={`pointer-events-auto min-w-[300px] flex items-center justify-between p-4 rounded-xl shadow-2xl border ${
              t.type === 'success' 
                ? 'bg-green-500/10 border-green-500/20 text-green-500' 
                : t.type === 'error'
                ? 'bg-red-500/10 border-red-500/20 text-red-500'
                : 'bg-blue-500/10 border-blue-500/20 text-blue-500'
            }`}
          >
            <div className="flex items-center gap-3">
              {t.type === 'success' && <CheckCircle size={18} />}
              {t.type === 'error' && <AlertCircle size={18} />}
              {t.type === 'info' && <Info size={18} />}
              <p className="text-sm font-medium">{t.message}</p>
            </div>
            <button 
              onClick={() => removeToast(t.id)}
              className="p-1 hover:bg-white/10 rounded-md transition-colors"
            >
              <X size={14} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
