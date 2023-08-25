const express = require('express');
const router = express.Router();
const {
  taskAdd,
  allTaskList,
  taskById,
  taskUpdate,
  taskDelete,
} = require('../controller/task');
const auth = require('../middleware/auth');

router.post('/tasks', auth, taskAdd);

router.get('/alltasks', allTaskList);

router.get('/task/:id', auth, taskById);

router.put('/task/:id', auth, taskUpdate);

router.delete('/task/:id', auth, taskDelete);

module.exports = router;
