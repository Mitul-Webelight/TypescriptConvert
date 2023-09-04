"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const auth_1 = __importDefault(require("../middleware/auth"));
import { userAdd, userLogin, userLogout, userLogoutAll, allUsersList, userById, userUpdate, userDelete, upload, uploadAvatar, deleteAvatar, getUserAvatar } from "../controller/user.mjs";
router.post('/users', userAdd);
router.post('/user/login', userLogin);
router.post('/user/logout', auth_1.default, userLogout);
router.post('/user/logoutAll', auth_1.default, userLogoutAll);
router.get('/allusers', auth_1.default, allUsersList);
router
    .route('/user/:id')
    .get(auth_1.default, userById)
    .put(auth_1.default, userUpdate)
    .delete(auth_1.default, userDelete);
router
    .route('/user/:id/avatar')
    .post(auth_1.default, upload.single('avatar'), uploadAvatar)
    .delete(auth_1.default, deleteAvatar)
    .get(auth_1.default, getUserAvatar);
const _default = router;
export { _default as default };
