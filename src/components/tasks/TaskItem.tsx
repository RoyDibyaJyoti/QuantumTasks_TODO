import { Trash2, Edit2, Calendar, Tag } from 'lucide-react';
import { Task } from '../../types';
import { useTaskStore } from '../../store/useTaskStore';
import { motion } from 'motion/react';

interface TaskItemProps {
  task: Task;
  onEdit: (task: Task) => void;
}

export default function TaskItem({ task, onEdit }: TaskItemProps) {
  const { deleteTask, updateTask } = useTaskStore();

  const getPriorityClasses = (priority: Task['priority'], type: 'border' | 'bg' | 'text') => {
    const colors = {
      high: { border: 'border-red-500', bg: 'bg-red-500', text: 'text-red-400' },
      medium: { border: 'border-amber-500', bg: 'bg-amber-500', text: 'text-amber-500' },
      low: { border: 'border-blue-500', bg: 'bg-blue-500', text: 'text-blue-500' },
    };
    return colors[priority][type];
  };

  const handleToggle = () => {
    updateTask(task.id, { completed: !task.completed });
  };

  const priorityClasses = getPriorityClasses(task.priority, 'border');
  const accentBg = getPriorityClasses(task.priority, 'bg');
  const accentText = getPriorityClasses(task.priority, 'text');

  return (
    <motion.div 
      whileHover={{ scale: 1.005, backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
      whileTap={{ scale: 0.995 }}
      className={`group bg-white/[0.03] border border-white/5 rounded-xl p-4 flex items-center justify-between transition-colors cursor-pointer ${task.completed ? 'opacity-50 grayscale' : ''}`}
    >
      <div className="flex items-center gap-4 flex-1">
        <button 
          onClick={(e) => {
            e.stopPropagation();
            handleToggle();
          }}
          className={`w-5 h-5 border-2 rounded-full flex items-center justify-center transition-colors ${
            task.completed 
              ? 'bg-emerald-500 border-emerald-500' 
              : `${priorityClasses}/40 group-hover:${priorityClasses}`
          }`}
        >
          {task.completed && (
            <motion.svg 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="w-3 h-3 text-white" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
            </motion.svg>
          )}
          {!task.completed && (
            <div className={`w-2 h-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity ${accentBg}`} />
          )}
        </button>

        <div className="flex-1" onClick={() => onEdit(task)}>
          <h3 className={`text-sm font-medium ${task.completed ? 'text-slate-400 line-through' : 'text-slate-100'}`}>
            {task.title}
          </h3>
          <div className="flex items-center gap-3 mt-1">
            {task.due_date && (
              <span className="text-[11px] text-slate-500 flex items-center gap-1">
                <Calendar size={12} />
                {new Date(task.due_date).toLocaleDateString()}
              </span>
            )}
            <span className={`text-[11px] font-bold uppercase tracking-widest ${accentText}`}>
              {task.priority}
            </span>
            {task.tags && task.tags.length > 0 && (
              <div className="flex gap-2">
                {task.tags.map(tag => (
                  <span key={tag} className="text-[10px] bg-white/5 px-1.5 py-0.5 rounded text-slate-400 flex items-center gap-1">
                    <Tag size={10} />
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onEdit(task);
          }}
          className="p-1.5 text-slate-500 hover:text-white hover:bg-white/5 rounded transition-colors"
        >
          <Edit2 size={14} />
        </button>
        <button 
          onClick={(e) => {
            e.stopPropagation();
            deleteTask(task.id);
          }}
          className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded transition-colors"
        >
          <Trash2 size={14} />
        </button>
      </div>
      
      {task.completed && (
        <div className="text-right ml-4">
          <p className="text-[11px] text-slate-500 font-mono italic">DONE</p>
        </div>
      )}
    </motion.div>
  );
}
