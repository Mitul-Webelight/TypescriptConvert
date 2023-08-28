const express = require('express');
const router = express.Router();
const {
  taskAdd,
  allTaskList,
  taskById,
  taskUpdate,
  taskDelete,
  updateMultipleTasks,
} = require('../controller/task');
const auth = require('../middleware/auth');

router.post('/tasks', auth, taskAdd);

router.get('/alltasks', auth, allTaskList);

router.get('/task/:id', auth, taskById);

router.put('/task/:id', auth, taskUpdate);

router.put('/multipletask', auth, updateMultipleTasks);

router.delete('/task/:id', auth, taskDelete);

module.exports = router;
