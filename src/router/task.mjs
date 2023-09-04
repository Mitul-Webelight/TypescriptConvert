"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
import { taskAdd, allTaskList, taskById, taskUpdate, taskDelete, updateMultipleTasks } from "../controller/task.mjs";
const auth_1 = __importDefault(require("../middleware/auth"));
router.post('/tasks', auth_1.default, taskAdd);
router.get('/alltasks', auth_1.default, allTaskList);
router
    .route('/task/:id')
    .get(auth_1.default, taskById)
    .put(auth_1.default, taskUpdate)
    .delete(auth_1.default, taskDelete);
router.put('/multipletask', auth_1.default, updateMultipleTasks);
const _default = router;
export { _default as default };
