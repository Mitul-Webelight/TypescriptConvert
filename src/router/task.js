const express = require('express');
const router = express.Router();
const taskController = require('../controller/task');
const auth = require('../middleware/auth');

router.post('/tasks', auth, taskController.taskAdd);

router.get('/alltasks', taskController.allTaskList);

router.get('/task/:id', auth, taskController.taskById);

router.put('/task/:id', auth, taskController.taskUpdate);

router.delete('/task/:id', auth, taskController.taskDelete);

module.exports = router;
