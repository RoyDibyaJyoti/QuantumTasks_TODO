import { useState, useEffect, FormEvent } from 'react';
import { X } from 'lucide-react';
import { useTaskStore } from '../../store/useTaskStore';
import { Task } from '../../types';
import { motion, AnimatePresence } from 'motion/react';

interface TaskFormProps {
  isOpen: boolean;
  onClose: () => void;
  taskToEdit?: Task | null;
}

export default function TaskForm({ isOpen, onClose, taskToEdit }: TaskFormProps) {
  const { addTask, updateTask, projects } = useTaskStore();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Task['priority']>('medium');
  const [projectId, setProjectId] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [tags, setTags] = useState('');

  useEffect(() => {
    if (taskToEdit) {
      setTitle(taskToEdit.title);
      setDescription(taskToEdit.description || '');
      setPriority(taskToEdit.priority);
      setProjectId(taskToEdit.project_id || '');
      setDueDate(taskToEdit.due_date ? taskToEdit.due_date.split('T')[0] : '');
      setTags(taskToEdit.tags?.join(', ') || '');
    } else {
      resetForm();
    }
  }, [taskToEdit, isOpen]);

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setPriority('medium');
    setProjectId('');
    setDueDate('');
    setTags('');
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const taskData = {
      title,
      description,
      priority,
      project_id: projectId || undefined,
      due_date: dueDate || undefined,
      tags: tags.split(',').map(t => t.trim()).filter(t => t !== ''),
    };

    if (taskToEdit) {
      await updateTask(taskToEdit.id, taskData);
    } else {
      await addTask(taskData);
    }
    
    onClose();
    resetForm();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative bg-[#111111] border border-white/10 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden" 
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-6 border-b border-white/5">
              <h2 className="text-xl font-semibold text-white">
                {taskToEdit ? 'Edit Task' : 'New Task'}
              </h2>
              <button 
                onClick={onClose} 
                className="text-slate-500 hover:text-white transition-colors p-1"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 text-slate-100">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Title</label>
                <input
                  autoFocus
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="What needs to be done?"
                  className="w-full bg-white/5 border border-white/5 rounded-lg px-4 py-2 focus:ring-1 focus:ring-blue-500 outline-none transition-all placeholder:text-slate-600"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Add more details..."
                  rows={3}
                  className="w-full bg-white/5 border border-white/5 rounded-lg px-4 py-2 focus:ring-1 focus:ring-blue-500 outline-none transition-all placeholder:text-slate-600 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Priority</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as any)}
                    className="w-full bg-white/5 border border-white/5 rounded-lg px-4 py-2 focus:ring-1 focus:ring-blue-500 outline-none transition-all appearance-none"
                  >
                    <option value="low" className="bg-[#111111]">Low</option>
                    <option value="medium" className="bg-[#111111]">Medium</option>
                    <option value="high" className="bg-[#111111]">High</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Due Date</label>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full bg-white/5 border border-white/5 rounded-lg px-4 py-2 focus:ring-1 focus:ring-blue-500 outline-none transition-all [color-scheme:dark]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Project</label>
                  <select
                    value={projectId}
                    onChange={(e) => setProjectId(e.target.value)}
                    className="w-full bg-white/5 border border-white/5 rounded-lg px-4 py-2 focus:ring-1 focus:ring-blue-500 outline-none transition-all appearance-none"
                  >
                    <option value="" className="bg-[#111111]">No Project</option>
                    {projects.map((project) => (
                      <option key={project.id} value={project.id} className="bg-[#111111]">
                        {project.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Tags (comma separated)</label>
                  <input
                    type="text"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    placeholder="urgent, refactor..."
                    className="w-full bg-white/5 border border-white/5 rounded-lg px-4 py-2 focus:ring-1 focus:ring-blue-500 outline-none transition-all placeholder:text-slate-600"
                  />
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-4 py-2 border border-white/5 hover:bg-white/5 rounded-lg font-medium transition-all"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="flex-[2] px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium transition-all"
                >
                  {taskToEdit ? 'Save Changes' : 'Create Task'}
                </motion.button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
