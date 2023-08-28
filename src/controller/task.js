const Task = require('../models/task');
const {
  success_200,
  success_201,
  error_400,
  error_404,
  error_500,
} = require('../util/messages');
const { successRes, errorRes } = require('../util/response');
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
    successRes(res, { task }, 201, success_201);
  } catch (error) {
    errorRes(res, 500, error_500);
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

    const { limit, skip, sortBy: sort } = req.query;

    const task = await Task.find(filter)
      .limit(limit)
      .skip(skip)
      .sort(sort)
      .exec();

    successRes(res, { task }, 200, success_200);
  } catch (error) {
    console.error(error);
    errorRes(res, 500, error_500);
  }
};

const taskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return errorRes(res, 404, error_404);
    }
    successRes(res, { task }, 200, success_200);
  } catch (error) {
    console.error(error);
    errorRes(res, 500, error_500);
  }
};

const taskUpdate = async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id);

    if (!task) {
      return errorRes(res, 404, error_404);
    }

    const { description, completed } = req.body;

    if (description && completed) {
      task.description = description;
      task.completed = completed;
    }

    await task.save();

    successRes(res, { task }, 200, success_200);
  } catch (error) {
    console.error(error);
    errorRes(res, 500, error_500);
  }
};

const updateMultipleTasks = async (req, res) => {
  try {
    const { tasks } = req.body;

    if (tasks.length === 0) {
      return errorRes(res, 400, error_400);
    }

    const updatedTasks = [];

    for (const taskData of tasks) {
      const task = await Task.findById(taskData.id);

      if (!task) {
        return errorRes(res, 404, error_404);
      }

      if (taskData.description !== undefined) {
        task.description = taskData.description;
      }

      if (taskData.completed !== undefined) {
        task.completed = taskData.completed;
      }

      await task.save();
      updatedTasks.push(task);
    }
    successRes(res, { updatedTasks }, 200, success_200);
  } catch (error) {
    console.error(error);
    errorRes(res, 500, error_500);
  }
};

const taskDelete = async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);

    if (!task) {
      return errorRes(res, 404, error_404);
    }

    successRes(res, { task }, 200, success_200);
  } catch (error) {
    console.error(error);
    errorRes(res, 500, error_500);
  }
};

module.exports = {
  taskAdd,
  allTaskList,
  taskById,
  taskUpdate,
  taskDelete,
  updateMultipleTasks,
};
