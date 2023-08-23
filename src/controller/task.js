const Task = require('../models/task');
const message = require('../util/messages');
require('dotenv').config();

const taskAdd = async (req, res) => {
  try {
    const { description, completed } = req.body;

    const task = new Task({
      description,
      completed,
      owner: req.user._id,
    });

    await task.save();
    res.status(201).json({ message: message.success_201, task });
  } catch (error) {
    res.status(500).json({ error: message.error_500 });
    console.error(error);
  }
};

const allTaskList = async (req, res) => {
  try {
    const completed = req.query.completed;

    const filter = {};

    if (completed === 'true') {
      filter.completed = true;
    } else if (completed === 'false') {
      filter.completed = false;
    }

    const limit = parseInt(req.query.limit);
    const skip = parseInt(req.query.skip);
    const sort = req.query.sortBy

    const taskResult = Task.find(filter).limit(limit).skip(skip).sort(sort);
    const task = await taskResult.exec();


    res.status(200).json(task);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: message.error_500 });
  }
};

const taskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: message.error_404 });
    }
    res.status(200).json(task);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: message.error_500 });
  }
};

const taskUpdate = async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id);

    if (!task) {
      return res.status(404).json({ message: message.error_404 });
    }

    const { description, completed } = req.body;

    if (description && completed) {
      task.description = description;
      task.completed = completed;
    }

    await task.save();

    res.status(200).json(task);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: message.error_500 });
  }
};

const taskDelete = async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);

    if (!task) {
      return res.status(404).json({ message: message.error_404 });
    }

    res.status(200).json({ message: message.success_200, task });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: message.error_500 });
  }
};

module.exports = {
  taskAdd,
  allTaskList,
  taskById,
  taskUpdate,
  taskDelete,
};
