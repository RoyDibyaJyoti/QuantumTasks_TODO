import db from '../database.js';
import { Project } from '../../types.js';

export type { Project };

export const createProject = (id: string, name: string, userId: string) => {
  const stmt = db.prepare('INSERT INTO projects (id, name, user_id) VALUES (?, ?, ?)');
  return stmt.run(id, name, userId);
};

export const getProjects = (userId: string) => {
  return db.prepare('SELECT * FROM projects WHERE user_id = ? ORDER BY created_at DESC').all(userId) as Project[];
};

export const deleteProject = (id: string, userId: string) => {
  return db.prepare('DELETE FROM projects WHERE id = ? AND user_id = ?').run(id, userId);
};
