const express = require('express');
const router = express.Router();
const Task = require('../models/task');

router.post('/tasks', async (req, res) => {
  try {
    const { description, completed } = req.body;

    const task = new Task({
      description,
      completed,
    });

    await task.save();
    res.status(201).json({ message: 'Task created!' });
  } catch (error) {
    res.status(500).json({ error: 'unable to create task!' });
    console.error(error);
  }
});

router.get('/alltasks', async (req, res) => {
  try {
    const task = await Task.find();

    res.status(200).json(task);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'unable to get!' });
  }
});

router.get('/task/:id', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'User not found!' });
    }
    res.status(200).json(task);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unable to get user!' });
  }
});

router.put('/task/:id', async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found!' });
    }

    const { description, completed } = req.body;

    if (description && completed) {
      task.description = description;
      task.completed = completed;
    }

    await task.save();

    res.status(200).json({ message: 'Task updated successfuly', task });
  } catch (error) {
    console.error('error update task', error);
    res.status(500).json({ error: 'Error updating task!' });
  }
});

router.delete('/task/:id', async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found!' });
    }

    res.status(200).json({ message: 'Following Task is deleted!', task });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error deleting task' });
  }
});

module.exports = router;
