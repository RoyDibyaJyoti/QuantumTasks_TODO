import { LayoutDashboard, CheckSquare, Calendar, Folder, LogOut, Plus, Info } from 'lucide-react';
import { useTaskStore } from '../../store/useTaskStore';
import { useAuthStore } from '../../store/useAuthStore';
import { authApi } from '../../services/api';
import { motion, AnimatePresence } from 'motion/react';
import { useState } from 'react';

export default function Sidebar() {
  const { projects, addProject, filters, setFilters, reset: resetTasks } = useTaskStore();
  const { user, logout } = useAuthStore();
  const [isAddingProject, setIsAddingProject] = useState(false);
  const [showAbout, setShowAbout] = useState(false);

  const handleLogout = async () => {
    const refreshToken = localStorage.getItem('refreshToken');
    if (refreshToken) {
      await authApi.logout(refreshToken);
    }
    logout();
    resetTasks();
  };

  const navItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard', filter: { completed: undefined, hasDueDate: undefined, projectId: undefined } },
    { id: 'tasks', icon: CheckSquare, label: 'My Tasks', filter: { completed: false, hasDueDate: undefined, projectId: undefined } },
    { id: 'calendar', icon: Calendar, label: 'Calendar', filter: { hasDueDate: true, projectId: undefined } },
  ];

  const statusItems = [
    { id: 'all', label: 'All Tasks', filter: { completed: undefined } },
    { id: 'completed', label: 'Completed', filter: { completed: true } },
    { id: 'incomplete', label: 'Incomplete', filter: { completed: false } },
  ];

  return (
    <aside className="w-64 bg-[#111111] border-r border-white/5 flex flex-col h-screen sticky top-0 overflow-y-auto">
      <div className="p-6">
        <motion.div 
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="flex items-center justify-between mb-10"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-white shadow-lg shadow-blue-600/20">Q</div>
            <span className="text-white font-semibold tracking-tight text-lg">Quantum Tasks</span>
          </div>
          <button
            onClick={() => setShowAbout(true)}
            className="p-2 text-slate-500 hover:text-blue-400 transition-colors rounded-lg hover:bg-blue-400/10"
            title="About Developer"
          >
            <Info size={18} />
          </button>
        </motion.div>

        <nav className="space-y-1">
          <div className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-bold mb-4 ml-2">Navigation</div>
          {navItems.map((item, idx) => {
            const isActive = 
              (item.id === 'dashboard' && filters.completed === undefined && filters.hasDueDate === undefined && !filters.projectId) ||
              (item.id === 'tasks' && filters.completed === false && filters.hasDueDate === undefined && !filters.projectId) ||
              (item.id === 'calendar' && filters.hasDueDate === true && !filters.projectId);

            return (
              <motion.button
                key={item.id}
                initial={{ x: -10, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                whileHover={{ x: 4 }}
                transition={{ delay: idx * 0.05 }}
                onClick={() => setFilters(item.filter)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-all ${
                  isActive 
                    ? 'bg-blue-600/10 text-blue-400 shadow-[inset_0_0_0_1px_rgba(59,130,246,0.2)]' 
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <item.icon size={16} />
                {item.label}
              </motion.button>
            );
          })}
        </nav>

        <div className="mt-10">
          <div className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-bold mb-4 ml-2">Status</div>
          <div className="space-y-1">
            {statusItems.map((item, idx) => (
              <motion.button
                key={item.id}
                initial={{ x: -10, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                whileHover={{ x: 4 }}
                transition={{ delay: 0.2 + idx * 0.05 }}
                onClick={() => setFilters(item.filter)}
                className={`w-full flex items-center gap-3 px-3 py-1.5 text-sm transition-all rounded-md ${
                  filters.completed === item.filter.completed && !filters.hasDueDate && !filters.projectId
                    ? 'bg-white/5 text-white' 
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <div className={`w-1.5 h-1.5 rounded-full ${
                  item.id === 'completed' ? 'bg-green-500' : item.id === 'incomplete' ? 'bg-amber-500' : 'bg-slate-500'
                }`}></div>
                <span>{item.label}</span>
              </motion.button>
            ))}
          </div>
        </div>

        <div className="mt-10">
          <div className="flex items-center justify-between mb-4 ml-2">
            <div className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-bold">Projects</div>
            <button 
              onClick={() => setIsAddingProject(!isAddingProject)}
              className="p-1 hover:bg-white/5 rounded text-slate-500 hover:text-white transition-colors"
            >
              <Plus size={12} />
            </button>
          </div>
          <div className="space-y-1">
            <AnimatePresence>
              {isAddingProject && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="px-2 mb-2"
                >
                  <input
                    autoFocus
                    placeholder="Project name..."
                    className="w-full bg-black/40 border border-white/10 rounded-md py-1.5 px-3 text-xs text-white outline-none focus:border-blue-500/50"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        const val = e.currentTarget.value.trim();
                        if (val) {
                          addProject(val);
                          setIsAddingProject(false);
                        }
                      }
                      if (e.key === 'Escape') setIsAddingProject(false);
                    }}
                  />
                </motion.div>
              )}
            </AnimatePresence>
            {projects.map((project, idx) => (
              <motion.button
                key={project.id}
                initial={{ x: -10, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                whileHover={{ x: 4 }}
                transition={{ delay: 0.4 + idx * 0.05 }}
                onClick={() => setFilters({ projectId: project.id, completed: undefined, hasDueDate: undefined })}
                className={`w-full flex items-center justify-between group px-3 py-1.5 text-sm transition-all rounded-md ${
                  filters.projectId === project.id ? 'bg-white/5 text-white' : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-3 truncate">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                  <span className="truncate">{project.name}</span>
                </div>
              </motion.button>
            ))}
            {projects.length === 0 && (
              <p className="px-3 text-xs text-slate-600 italic">No projects yet</p>
            )}
          </div>
        </div>
      </div>

      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-auto p-6 border-t border-white/5 space-y-4"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 border border-white/10 flex items-center justify-center text-white font-bold">
              {(user?.name?.[0] || user?.email?.[0])?.toUpperCase()}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-medium text-white truncate max-w-[100px]">{user?.name || user?.email.split('@')[0]}</p>
              <p className="text-[10px] text-slate-500 truncate max-w-[100px]">{user?.email}</p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="p-2 text-slate-500 hover:text-red-500 transition-colors"
            title="Logout"
          >
            <LogOut size={18} />
          </button>
        </div>
      </motion.div>

      <AnimatePresence>
        {showAbout && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAbout(false)}
              className="absolute inset-0 backdrop-blur-sm bg-black/60"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="bg-slate-900 border border-white/10 p-8 rounded-2xl max-w-sm w-full shadow-2xl text-center relative z-10"
            >
              <button 
                onClick={() => setShowAbout(false)}
                className="absolute top-4 right-4 p-2 text-slate-500 hover:text-white hover:bg-white/5 rounded-full transition-all"
              >
                <Plus size={20} className="rotate-45" />
              </button>
              <div className="w-20 h-20 bg-blue-600/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-blue-500/20">
                <span className="text-2xl font-bold text-blue-500">DR</span>
              </div>
              <h3 className="text-white text-xl font-bold mb-1 uppercase tracking-tight">DIBYA JYOTI ROY</h3>
              <p className="text-blue-500 font-medium text-xs mb-6 px-3 py-1 bg-blue-500/10 rounded-full inline-block">AU CSE-29</p>
              <div className="h-px bg-white/5 w-full mb-6"></div>
              <p className="text-slate-400 text-sm leading-relaxed px-2">
                Developer of <span className="text-white">Quantum Tasks</span>. Built with passion for seamless task management and performance.
              </p>
              <button
                onClick={() => setShowAbout(false)}
                className="mt-8 w-full py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-500 transition-all shadow-lg shadow-blue-600/20"
              >
                Got it
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </aside>
  );
}
