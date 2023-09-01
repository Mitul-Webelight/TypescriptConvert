import Task from '../models/task';
import { constant, messages, statusCode } from '../util/messages';
import { successRes, errorRes } from '../util/response';
import dotenv from 'dotenv';
dotenv.config();

interface Filtertypes {
  completed?: boolean;
}

export const taskAdd = async (req: any, res: any) => {
  try {
    const { description, completed } = req.body;

    const task = new Task({
      description,
      completed,
      owner: req.user._id,
    });

    await task.save();
    successRes(res, task, statusCode.Ok, messages.Created);
  } catch (error) {
    errorRes(res, statusCode.Internal_Server_Error, messages.Server_Error);
    console.error(error);
  }
}

export const allTaskList = async (req: any, res: any) => {
  try {
    const completed = req.query.completed;

    const filter: Filtertypes = {};

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

    successRes(res, task, statusCode.Ok, messages.Ok);
  } catch (error) {
    console.error(error);
    errorRes(res, statusCode.Internal_Server_Error, messages.Server_Error);
  }
};

export const taskById = async (req: any, res: any) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return errorRes(
        res,
        statusCode.Not_Found,
        messages.notFound(constant.task)
      );
    }
    successRes(res, task, statusCode.Ok, messages.Ok);
  } catch (error) {
    console.error(error);
    errorRes(res, statusCode.Internal_Server_Error, messages.Server_Error);
  }
};

export const taskUpdate = async (req: any, res: any) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id);

    if (!task) {
      return errorRes(
        res,
        statusCode.Not_Found,
        messages.notFound(constant.task)
      );
    }

    const { description, completed } = req.body;

    if (description || completed) {
      task.description = description;
      task.completed = completed;
    }

    await task.save();

    successRes(res, task, statusCode.Ok, messages.Ok);
  } catch (error) {
    console.error(error);
    errorRes(res, statusCode.Internal_Server_Error, messages.Server_Error);
  }
};

export const updateMultipleTasks = async (req: any, res: any) => {
  try {
    const { description, completed } = req.body;

    const task = await Task.findByIdAndUpdate({ _id: req.body });

    if (!task) {
      return errorRes(
        res,
        statusCode.Not_Found,
        messages.notFound(constant.task)
      );
    }

    if (description || completed) {
      task.description = task.description;
      task.completed = task.completed;
    }

    await task.save();

    successRes(res, task, statusCode.Ok, messages.Ok);
  } catch (error) {
    console.error(error);
    errorRes(res, statusCode.Internal_Server_Error, messages.Server_Error);
  }
};

export const taskDelete = async (req: any, res: any) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);

    if (!task) {
      return errorRes(
        res,
        statusCode.Not_Found,
        messages.notFound(constant.task)
      );
    }

    successRes(res, task, statusCode.Ok, messages.Ok);
  } catch (error) {
    console.error(error);
    errorRes(res, statusCode.Internal_Server_Error, messages.Server_Error);
  }
};