import { useMemo } from 'react';
import { useTaskStore } from '../../store/useTaskStore';
import TaskItem from './TaskItem';
import { Task } from '../../types';
import { motion, AnimatePresence } from 'motion/react';

interface TaskListProps {
  onEditTask: (task: Task) => void;
}

export default function TaskList({ onEditTask }: TaskListProps) {
  const { tasks, loading, filters } = useTaskStore();

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      // Filter by project
      if (filters.projectId && task.project_id !== filters.projectId) {
        return false;
      }
      
      // Filter by search
      if (filters.search) {
        const search = filters.search.toLowerCase();
        const matchesTitle = task.title.toLowerCase().includes(search);
        const matchesDescription = task.description?.toLowerCase().includes(search);
        const matchesTags = task.tags?.some(tag => tag.toLowerCase().includes(search));
        if (!matchesTitle && !matchesDescription && !matchesTags) {
          return false;
        }
      }

      // Filter by priority
      if (filters.priority && task.priority !== filters.priority) {
        return false;
      }

      // Filter by due date existence
      if (filters.hasDueDate && !task.due_date) {
        return false;
      }

      // Filter by completion status if set
      if (filters.completed !== undefined && task.completed !== filters.completed) {
        return false;
      }

      return true;
    });
  }, [tasks, filters]);

  if (loading && tasks.length === 0) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <motion.div 
            key={i} 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="h-20 bg-white/5 animate-pulse rounded-xl border border-white/5" 
          />
        ))}
      </div>
    );
  }

  if (filteredTasks.length === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-20 bg-white/[0.02] border border-dashed border-white/10 rounded-2xl"
      >
        <p className="text-slate-500">
          {filters.search || filters.projectId 
            ? 'No tasks match your filters.' 
            : 'No tasks found. Create one to get started!'}
        </p>
      </motion.div>
    );
  }

  return (
    <div className="space-y-4">
      <AnimatePresence mode="popLayout" initial={false}>
        {filteredTasks.map((task) => (
          <motion.div
            key={task.id}
            layout
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
            transition={{ type: 'spring', stiffness: 500, damping: 30, mass: 1 }}
          >
            <TaskItem task={task} onEdit={onEditTask} />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
