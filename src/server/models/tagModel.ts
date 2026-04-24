import db from '../database.js';
import { Tag } from '../../types.js';

export type { Tag };

export const createTag = (id: string, name: string) => {
  const stmt = db.prepare('INSERT INTO tags (id, name) VALUES (?, ?)');
  return stmt.run(id, name);
};

export const getTags = () => {
  return db.prepare('SELECT * FROM tags').all() as Tag[];
};

export const addTaskTag = (taskId: string, tagId: string) => {
  const stmt = db.prepare('INSERT OR IGNORE INTO task_tags (task_id, tag_id) VALUES (?, ?)');
  return stmt.run(taskId, tagId);
};

export const removeTaskTags = (taskId: string) => {
  const stmt = db.prepare('DELETE FROM task_tags WHERE task_id = ?');
  return stmt.run(taskId);
};
