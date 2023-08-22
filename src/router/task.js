const express = require('express');
const router = express.Router();
const taskController = require('../controller/task');

router.post('/tasks', taskController.taskAdd);

router.get('/alltasks', taskController.allTaskList);

router.get('/task/:id', taskController.taskById);

router.put('/task/:id', taskController.taskUpdate);

router.delete('/task/:id', taskController.taskDelete);

module.exports = router;
