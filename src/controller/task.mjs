"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
export const _taskDelete = exports.updateMultipleTasks = exports.taskUpdate = exports.taskById = exports.allTaskList = exports.taskAdd = void 0;
export { _taskDelete as taskDelete };
const task_1 = __importDefault(require("../models/task"));
import { statusCode, messages, constant } from "../util/messages";
import { successRes, errorRes } from "../util/response";
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const taskAdd = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { description, completed } = req.body;
        const task = new task_1.default({
            description,
            completed,
            owner: req.user._id,
        });
        yield task.save();
        (0, successRes)(res, task, statusCode.Ok, messages.Created);
    }
    catch (error) {
        (0, errorRes)(res, statusCode.Internal_Server_Error, messages.Server_Error);
        console.error(error);
    }
});
const _taskAdd = taskAdd;
export { _taskAdd as taskAdd };
const allTaskList = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const completed = req.query.completed;
        const filter = {};
        if (completed === 'true') {
            filter.completed = true;
        }
        else if (completed === 'false') {
            filter.completed = false;
        }
        const { limit, skip, sortBy: sort } = req.query;
        const task = yield task_1.default.find(filter)
            .limit(limit)
            .skip(skip)
            .sort(sort)
            .exec();
        (0, successRes)(res, task, statusCode.Ok, messages.Ok);
    }
    catch (error) {
        console.error(error);
        (0, errorRes)(res, statusCode.Internal_Server_Error, messages.Server_Error);
    }
});
const _allTaskList = allTaskList;
export { _allTaskList as allTaskList };
const taskById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const task = yield task_1.default.findById(req.params.id);
        if (!task) {
            return (0, errorRes)(res, statusCode.Not_Found, messages.notFound(constant.task));
        }
        (0, successRes)(res, task, statusCode.Ok, messages.Ok);
    }
    catch (error) {
        console.error(error);
        (0, errorRes)(res, statusCode.Internal_Server_Error, messages.Server_Error);
    }
});
const _taskById = taskById;
export { _taskById as taskById };
const taskUpdate = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const task = yield task_1.default.findByIdAndUpdate(req.params.id);
        if (!task) {
            return (0, errorRes)(res, statusCode.Not_Found, messages.notFound(constant.task));
        }
        const { description, completed } = req.body;
        if (description || completed) {
            task.description = description;
            task.completed = completed;
        }
        yield task.save();
        (0, successRes)(res, task, statusCode.Ok, messages.Ok);
    }
    catch (error) {
        console.error(error);
        (0, errorRes)(res, statusCode.Internal_Server_Error, messages.Server_Error);
    }
});
const _taskUpdate = taskUpdate;
export { _taskUpdate as taskUpdate };
const updateMultipleTasks = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { description, completed } = req.body;
        const task = yield task_1.default.findByIdAndUpdate({ _id: req.body });
        if (!task) {
            return (0, errorRes)(res, statusCode.Not_Found, messages.notFound(constant.task));
        }
        if (description || completed) {
            task.description = task.description;
            task.completed = task.completed;
        }
        yield task.save();
        (0, successRes)(res, task, statusCode.Ok, messages.Ok);
    }
    catch (error) {
        console.error(error);
        (0, errorRes)(res, statusCode.Internal_Server_Error, messages.Server_Error);
    }
});
const _updateMultipleTasks = updateMultipleTasks;
export { _updateMultipleTasks as updateMultipleTasks };
const taskDelete = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const task = yield task_1.default.findByIdAndDelete(req.params.id);
        if (!task) {
            return (0, errorRes)(res, statusCode.Not_Found, messages.notFound(constant.task));
        }
        (0, successRes)(res, task, statusCode.Ok, messages.Ok);
    }
    catch (error) {
        console.error(error);
        (0, errorRes)(res, statusCode.Internal_Server_Error, messages.Server_Error);
    }
});
const _taskDelete = taskDelete;
export { _taskDelete as taskDelete };
