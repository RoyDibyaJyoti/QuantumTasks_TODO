/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState } from 'react';
import { useTaskStore } from './store/useTaskStore';
import { useAuthStore } from './store/useAuthStore';
import MainLayout from './components/layout/MainLayout';
import TaskList from './components/tasks/TaskList';
import TaskForm from './components/tasks/TaskForm';
import NotificationContainer from './components/ui/NotificationContainer';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import { Task } from './types';

export default function App() {
  const { fetchTasks, fetchProjects, loading, error, tasks } = useTaskStore();
  const { user } = useAuthStore();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [authView, setAuthView] = useState<'login' | 'register'>('login');

  useEffect(() => {
    if (user) {
      fetchTasks();
      fetchProjects();
    }
  }, [fetchTasks, fetchProjects, user]);

  if (!user) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center p-4">
        {authView === 'login' ? (
          <Login onToggleForm={() => setAuthView('register')} />
        ) : (
          <Register onToggleForm={() => setAuthView('login')} />
        )}
        <NotificationContainer />
      </div>
    );
  }

  const handleAddTask = () => {
    setSelectedTask(null);
    setIsFormOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setSelectedTask(task);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setSelectedTask(null);
  };

  return (
    <MainLayout onAddTask={handleAddTask}>
      <div className="flex flex-col">
        <div className="flex items-baseline justify-between mb-8">
          <h1 className="text-3xl font-bold text-white">Upcoming Tasks</h1>
          <p className="text-slate-500 text-sm">{tasks.length} remaining</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-xl mb-6">
            {error}
          </div>
        )}

        <TaskList onEditTask={handleEditTask} />
      </div>

      <TaskForm 
        isOpen={isFormOpen} 
        onClose={handleCloseForm} 
        taskToEdit={selectedTask} 
      />
      <NotificationContainer />
    </MainLayout>
  );
}

