import { Response, NextFunction } from 'express';
import * as ProjectModel from '../models/projectModel.js';
import crypto from 'node:crypto';
import { AuthRequest } from '../middleware/authMiddleware.js';

export const getProjects = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.userId;
    const projects = ProjectModel.getProjects(userId);
    res.json({ success: true, data: projects });
  } catch (error) {
    next(error);
  }
};

export const createProject = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.userId;
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ success: false, error: 'Project name is required' });
    }
    const id = crypto.randomUUID();
    ProjectModel.createProject(id, name, userId);
    res.status(201).json({ success: true, data: { id, name } });
  } catch (error) {
    next(error);
  }
};

export const deleteProject = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.userId;
    const { id } = req.params;
    ProjectModel.deleteProject(id, userId);
    res.json({ success: true, message: 'Project deleted successfully' });
  } catch (error) {
    next(error);
  }
};
