import { Task, Project, ApiResponse } from '../types';

const API_BASE = '/api';

async function request<T>(url: string, options?: RequestInit): Promise<ApiResponse<T>> {
  let accessToken = localStorage.getItem('accessToken');
  try {
    let response = await fetch(`${API_BASE}${url}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(accessToken ? { 'Authorization': `Bearer ${accessToken}` } : {}),
        ...options?.headers,
      },
    });

    // If 401, try to refresh
    if (response.status === 401 && !url.includes('/auth/refresh') && !url.includes('/auth/login')) {
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        const refreshResponse = await fetch(`${API_BASE}/auth/refresh`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refreshToken }),
        });

        if (refreshResponse.ok) {
          const refreshData = await refreshResponse.json();
          accessToken = refreshData.accessToken;
          localStorage.setItem('accessToken', accessToken!);
          
          // Retry original request with new token
          response = await fetch(`${API_BASE}${url}`, {
            ...options,
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${accessToken}`,
              ...options?.headers,
            },
          });
        } else {
          // Refresh failed, clear storage
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('user');
          window.location.reload(); // Force re-login
        }
      }
    }

    const rawData = await response.json();
    
    if (!response.ok) {
      return {
        success: false,
        error: rawData.error || 'Something went wrong',
      };
    }

    // If backend already returned {success, data}, use that data
    if (rawData && typeof rawData === 'object' && 'success' in rawData && 'data' in rawData) {
      return { success: true, data: rawData.data };
    }

    return { success: true, data: rawData };
  } catch (error) {
    console.error('API Request Error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Network error',
    };
  }
}

export const taskApi = {
  getTasks: (projectId?: string) => 
    request<Task[]>(projectId ? `/tasks?projectId=${projectId}` : '/tasks'),
  
  getTask: (id: string) => 
    request<Task>(`/tasks/${id}`),
  
  createTask: (data: Partial<Task>) => 
    request<Task>('/tasks', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  
  updateTask: (id: string, data: Partial<Task>) => 
    request<Task>(`/tasks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  
  deleteTask: (id: string) => 
    request<void>(`/tasks/${id}`, {
      method: 'DELETE',
    }),
};

export const projectApi = {
  getProjects: () => 
    request<Project[]>('/projects'),
  
  createProject: (name: string) => 
    request<Project>('/projects', {
      method: 'POST',
      body: JSON.stringify({ name }),
    }),
  
  deleteProject: (id: string) => 
    request<void>(`/projects/${id}`, {
      method: 'DELETE',
    }),
};

export const authApi = {
  login: (data: any) => 
    request<{ user: any, accessToken: string, refreshToken: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  
  register: (data: any) => 
    request<{ user: any, accessToken: string, refreshToken: string }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  
  logout: (refreshToken: string) =>
    request<void>('/auth/logout', {
      method: 'POST',
      body: JSON.stringify({ refreshToken }),
    }),

  updateProfile: (data: { name: string }) =>
    request<{ user: any }>('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
};
