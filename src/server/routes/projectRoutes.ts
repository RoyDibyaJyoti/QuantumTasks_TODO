import { Router } from 'express';
import * as ProjectController from '../controllers/projectController.js';

const router = Router();

router.get('/', ProjectController.getProjects);
router.post('/', ProjectController.createProject);
router.delete('/:id', ProjectController.deleteProject);

export default router;
