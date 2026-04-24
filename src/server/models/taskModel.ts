import db from '../database.js';
import { Task } from '../../types.js';

export type { Task };

export const createTask = (task: Omit<Task, 'created_at' | 'completed'> & { completed?: number; user_id: string }) => {
  const stmt = db.prepare(`
    INSERT INTO tasks (id, title, description, completed, priority, due_date, project_id, user_id)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);
  return stmt.run(task.id, task.title, task.description, task.completed || 0, task.priority, task.due_date, task.project_id, task.user_id);
};

export const getTasks = (userId: string, filter?: { projectId?: string }) => {
  let query = 'SELECT * FROM tasks WHERE user_id = ?';
  const params: any[] = [userId];
  
  if (filter?.projectId) {
    query += ' AND project_id = ?';
    params.push(filter.projectId);
  }
  
  query += ' ORDER BY created_at DESC';
  
  const tasks = db.prepare(query).all(...params) as any[];
  
  // Attach tags for each task
  return tasks.map(task => {
    const tags = db.prepare(`
      SELECT t.name FROM tags t
      JOIN task_tags tt ON t.id = tt.tag_id
      WHERE tt.task_id = ?
    `).all(task.id) as { name: string }[];
    return { 
      ...task, 
      completed: !!task.completed,
      tags: tags.map(t => t.name) 
    };
  });
};

export const updateTask = (id: string, userId: string, updates: Partial<Task>) => {
  const keys = Object.keys(updates).filter(k => k !== 'id' && k !== 'created_at' && k !== 'tags' && k !== 'user_id');
  if (keys.length === 0) return;

  const setClause = keys.map(k => `${k} = ?`).join(', ');
  const params = keys.map(k => {
    const val = (updates as any)[k];
    if (typeof val === 'boolean') return val ? 1 : 0;
    return val;
  });
  params.push(id);
  params.push(userId);

  const stmt = db.prepare(`UPDATE tasks SET ${setClause} WHERE id = ? AND user_id = ?`);
  return stmt.run(...params);
};

export const deleteTask = (id: string, userId: string) => {
  return db.prepare('DELETE FROM tasks WHERE id = ? AND user_id = ?').run(id, userId);
};
