import { create } from 'zustand';
import { Task, Project } from '../types';
import { taskApi, projectApi } from '../services/api';
import { useNotificationStore } from './useNotificationStore';

interface TaskState {
  tasks: Task[];
  projects: Project[];
  loading: boolean;
  error: string | null;
  filters: {
    projectId?: string;
    priority?: string;
    search: string;
    completed?: boolean;
    hasDueDate?: boolean;
  };

  // Actions
  fetchTasks: (projectId?: string) => Promise<void>;
  fetchProjects: () => Promise<void>;
  addTask: (task: Partial<Task>) => Promise<void>;
  updateTask: (id: string, updates: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  setFilters: (filters: Partial<TaskState['filters']>) => void;
  
  // Project Actions
  addProject: (name: string) => Promise<void>;
  removeProject: (id: string) => Promise<void>;
  reset: () => void;
}

export const useTaskStore = create<TaskState>((set, get) => ({
  tasks: [],
  projects: [],
  loading: false,
  error: null,
  filters: {
    search: '',
  },

  reset: () => {
    set({ tasks: [], projects: [], loading: false, error: null, filters: { search: '' } });
  },

  fetchTasks: async (projectId) => {
    set({ loading: true, error: null });
    const response = await taskApi.getTasks(projectId);
    if (response.success) {
      set({ tasks: response.data || [], loading: false });
    } else {
      set({ error: response.error || 'Failed to fetch tasks', loading: false });
      useNotificationStore.getState().addNotification(response.error || 'Failed to fetch tasks', 'error');
    }
  },

  fetchProjects: async () => {
    const response = await projectApi.getProjects();
    if (response.success) {
      set({ projects: response.data || [] });
    }
  },

  addTask: async (taskData) => {
    set({ loading: true, error: null });
    const response = await taskApi.createTask(taskData);
    if (response.success && response.data) {
      set((state) => ({ 
        tasks: [response.data!, ...state.tasks],
        loading: false 
      }));
      useNotificationStore.getState().addNotification('Task created successfully', 'success');
    } else {
      set({ error: response.error || 'Failed to add task', loading: false });
      useNotificationStore.getState().addNotification(response.error || 'Failed to add task', 'error');
    }
  },

  updateTask: async (id, updates) => {
    const response = await taskApi.updateTask(id, updates);
    if (response.success && response.data) {
      set((state) => ({
        tasks: state.tasks.map((t) => (t.id === id ? response.data! : t)),
      }));
      // Only notify if explicit update, not background (like marking complete)
      // but the user wants notifications to work
      if (Object.keys(updates).length > 0) {
        if ('completed' in updates) {
          useNotificationStore.getState().addNotification(
            updates.completed ? 'Task completed' : 'Task reopened', 
            'success'
          );
        } else {
          useNotificationStore.getState().addNotification('Task updated successfully', 'success');
        }
      }
    } else {
      set({ error: response.error || 'Failed to update task' });
      useNotificationStore.getState().addNotification(response.error || 'Failed to update task', 'error');
    }
  },

  deleteTask: async (id) => {
    const response = await taskApi.deleteTask(id);
    if (response.success) {
      set((state) => ({
        tasks: state.tasks.filter((t) => t.id !== id),
      }));
      useNotificationStore.getState().addNotification('Task deleted', 'success');
    } else {
      set({ error: response.error || 'Failed to delete task' });
      useNotificationStore.getState().addNotification(response.error || 'Failed to delete task', 'error');
    }
  },

  setFilters: (newFilters) => {
    set((state) => {
      const mergedFilters = { ...state.filters, ...newFilters };
      // If we are setting something like project, maybe clear others or handle mutually exclusive
      return { filters: mergedFilters };
    });
  },

  addProject: async (name) => {
    const response = await projectApi.createProject(name);
    if (response.success && response.data) {
      set((state) => ({
        projects: [response.data!, ...state.projects],
      }));
      useNotificationStore.getState().addNotification('Project added', 'success');
    } else {
       useNotificationStore.getState().addNotification('Failed to add project', 'error');
    }
  },

  removeProject: async (id) => {
    const response = await projectApi.deleteProject(id);
    if (response.success) {
      set((state) => ({
        projects: state.projects.filter((p) => p.id !== id),
        filters: state.filters.projectId === id ? { ...state.filters, projectId: undefined } : state.filters
      }));
      useNotificationStore.getState().addNotification('Project removed', 'success');
    } else {
      useNotificationStore.getState().addNotification('Failed to remove project', 'error');
    }
  }
}));
