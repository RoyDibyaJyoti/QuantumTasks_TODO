import { Response, NextFunction } from 'express';
import * as TaskModel from '../models/taskModel.js';
import * as TagModel from '../models/tagModel.js';
import crypto from 'node:crypto';
import { AuthRequest } from '../middleware/authMiddleware.js';

export const getTasks = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.userId;
    const projectId = req.query.projectId as string;
    const tasks = TaskModel.getTasks(userId, { projectId });
    res.json({ success: true, data: tasks });
  } catch (error) {
    next(error);
  }
};

export const getTaskById = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.userId;
    const { id } = req.params;
    const tasks = TaskModel.getTasks(userId);
    const task = tasks.find(t => t.id === id);
    if (!task) {
      return res.status(404).json({ success: false, error: 'Task not found' });
    }
    res.json({ success: true, data: task });
  } catch (error) {
    next(error);
  }
};

export const createTask = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.userId;
    const { title, description, priority, due_date, project_id, tags } = req.body;

    if (!title) {
      return res.status(400).json({ success: false, error: 'Title is required' });
    }

    const id = crypto.randomUUID();
    TaskModel.createTask({
      id,
      title,
      description,
      priority: priority || 'medium',
      due_date,
      project_id,
      completed: 0,
      user_id: userId
    });

    if (tags && Array.isArray(tags)) {
      for (const tagName of tags) {
        // Find or create tag
        let tag = TagModel.getTags().find(t => t.name === tagName);
        let tagId;
        if (!tag) {
          tagId = crypto.randomUUID();
          TagModel.createTag(tagId, tagName);
        } else {
          tagId = tag.id;
        }
        TagModel.addTaskTag(id, tagId);
      }
    }

    const tasks = TaskModel.getTasks(userId);
    const newTask = tasks.find(t => t.id === id);
    res.status(201).json({ success: true, data: newTask });
  } catch (error) {
    next(error);
  }
};

export const updateTask = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.userId;
    const { id } = req.params;
    const { tags, ...updates } = req.body;

    const result = TaskModel.updateTask(id, userId, updates);
    if (result && result.changes === 0) {
      return res.status(404).json({ success: false, error: 'Task not found' });
    }

    if (tags && Array.isArray(tags)) {
      TagModel.removeTaskTags(id);
      for (const tagName of tags) {
        const trimmedTag = tagName.trim();
        if (trimmedTag) {
          const tagId = crypto.randomUUID();
          try {
            TagModel.createTag(tagId, trimmedTag);
          } catch (e) {}
          
          const allTags = TagModel.getTags();
          const tag = allTags.find(t => t.name.toLowerCase() === trimmedTag.toLowerCase());
          if (tag) {
            TagModel.addTaskTag(id, tag.id);
          }
        }
      }
    }

    const tasks = TaskModel.getTasks(userId);
    const updatedTask = tasks.find(t => t.id === id);
    res.json({ success: true, data: updatedTask });
  } catch (error) {
    next(error);
  }
};

export const deleteTask = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.userId;
    const { id } = req.params;
    const result = TaskModel.deleteTask(id, userId);
    if (result.changes === 0) {
      return res.status(404).json({ success: false, error: 'Task not found' });
    }
    res.json({ success: true, message: 'Task deleted successfully' });
  } catch (error) {
    next(error);
  }
};
