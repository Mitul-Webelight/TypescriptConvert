import express from 'express';
const router = express.Router();
import {
  taskAdd,
  allTaskList,
  taskById,
  taskUpdate,
  taskDelete,
  updateMultipleTasks,
} from '../controller/task.js';
import auth from '../middleware/auth.js';

router.post('/tasks', auth, taskAdd);

router.get('/alltasks', auth, allTaskList);

router
  .route('/task/:id')
  .get(auth, taskById)
  .put(auth, taskUpdate)
  .delete(auth, taskDelete);

router.put('/multipletask', auth, updateMultipleTasks);

export default router;
