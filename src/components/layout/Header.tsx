import { Search, Bell, Plus, User, Trash2 } from 'lucide-react';
import { useTaskStore } from '../../store/useTaskStore';
import { useNotificationStore } from '../../store/useNotificationStore';
import { motion, AnimatePresence } from 'motion/react';
import { useState } from 'react';
import ProfileModal from '../profile/ProfileModal';

interface HeaderProps {
  onAddTask: () => void;
}

export default function Header({ onAddTask }: HeaderProps) {
  const { filters, setFilters } = useTaskStore();
  const { notifications, removeNotification } = useNotificationStore();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  return (
    <header className="h-16 flex items-center justify-between px-8 border-b border-white/5 bg-bg-base/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="flex items-center gap-4 flex-1 max-w-xl">
        <Search className="w-5 h-5 text-slate-500" />
        <input
          type="text"
          placeholder="Search tasks, tags, or projects..."
          value={filters.search}
          onChange={(e) => setFilters({ search: e.target.value })}
          className="bg-transparent border-none text-sm text-slate-300 w-full focus:ring-0 outline-none placeholder:text-slate-600"
        />
      </div>
      <div className="flex items-center gap-6">
        <div className="relative">
          <motion.button 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 text-slate-400 hover:text-white transition-colors relative"
          >
            <Bell className="w-5 h-5" />
            {notifications.length > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-600 rounded-full border-2 border-bg-base"></span>
            )}
          </motion.button>

          <AnimatePresence>
            {showNotifications && (
              <>
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={() => setShowNotifications(false)} 
                />
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 mt-2 w-80 bg-slate-900 border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden"
                >
                  <div className="p-4 border-b border-white/5 flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Notifications</span>
                    {notifications.length > 0 && (
                      <span className="text-[10px] bg-blue-600/20 text-blue-400 px-1.5 py-0.5 rounded font-bold">
                        {notifications.length} New
                      </span>
                    )}
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="p-8 text-center">
                        <Bell className="w-8 h-8 text-slate-700 mx-auto mb-3 opacity-20" />
                        <p className="text-sm text-slate-500">No new notifications</p>
                      </div>
                    ) : (
                      <div className="divide-y divide-white/5">
                        {notifications.map((n) => (
                          <div key={n.id} className="p-4 flex gap-3 hover:bg-white/5 transition-colors group">
                            <div className={`mt-1 w-2 h-2 rounded-full shrink-0 ${
                              n.type === 'success' ? 'bg-green-500' : n.type === 'error' ? 'bg-red-500' : 'bg-blue-500'
                            }`} />
                            <div className="flex-1">
                              <p className="text-sm text-slate-300 leading-snug">{n.message}</p>
                              <p className="text-[10px] text-slate-600 mt-1 uppercase font-bold tracking-tight">Just now</p>
                            </div>
                            <button 
                              onClick={() => removeNotification(n.id)}
                              className="opacity-0 group-hover:opacity-100 p-1 text-slate-600 hover:text-red-500 transition-all"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>

        <motion.button 
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setShowProfile(true)}
          className="p-1.5 border border-white/10 rounded-full text-slate-400 hover:text-white hover:border-white/20 transition-all"
        >
          <User className="w-5 h-5" />
        </motion.button>

        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onAddTask}
          className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-4 py-2 rounded transition-all shadow-lg shadow-blue-600/20 flex items-center gap-2"
        >
          <Plus size={16} />
          New Task
        </motion.button>
      </div>

      <ProfileModal isOpen={showProfile} onClose={() => setShowProfile(false)} />
    </header>
  );
}
