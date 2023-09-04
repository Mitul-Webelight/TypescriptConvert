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
export const _getUserAvatar = exports.deleteAvatar = exports.uploadAvatar = exports.upload = exports.userDelete = exports.userUpdate = exports.userById = exports.allUsersList = exports.userLogoutAll = exports.userLogout = exports.userLogin = exports.userAdd = void 0;
export { _getUserAvatar as getUserAvatar };
const user_1 = __importDefault(require("../models/user"));
const bcrypt_1 = __importDefault(require("bcrypt"));
import { statusCode, messages, constant } from "../util/messages";
const sharp_1 = __importDefault(require("sharp"));
const multer_1 = __importDefault(require("multer"));
import { sendWelcomEmail } from "../emails/account";
import { errorRes, successRes } from "../util/response";
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const hashedPassword = (password) => __awaiter(void 0, void 0, void 0, function* () {
    const hashed = yield bcrypt_1.default.hash(password, 10);
    return hashed;
});
const userAdd = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, age, password } = req.body;
        const existingUser = yield user_1.default.findOne({ email });
        if (existingUser) {
            return (0, errorRes)(res, statusCode.Bad_Request, messages.Bad_Request);
        }
        const hashed = yield hashedPassword(password);
        const user = new user_1.default({
            name,
            email,
            password: hashed,
            age,
        });
        (0, sendWelcomEmail)(user.email, user.name);
        const token = yield user.generateAuthToken();
        yield user.save();
        (0, successRes)(res, { user, token }, statusCode.Ok, messages.Created);
    }
    catch (error) {
        console.error(error);
        (0, errorRes)(res, statusCode.Internal_Server_Error, messages.Server_Error);
    }
});
const _userAdd = userAdd;
export { _userAdd as userAdd };
const userLogin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const user = yield user_1.default.findOne({ email });
        if (!user) {
            return (0, errorRes)(res, statusCode.Bad_Request, messages.Invalid_Credentials);
        }
        const passwordMatch = yield bcrypt_1.default.compare(password, user.password);
        if (!passwordMatch) {
            return (0, errorRes)(res, statusCode.Bad_Request, messages.Invalid_Credentials);
        }
        const token = yield user.generateAuthToken();
        (0, successRes)(res, { user, token }, statusCode.Ok, messages.Ok);
    }
    catch (error) {
        console.error(error);
        (0, errorRes)(res, statusCode.Internal_Server_Error, messages.Server_Error);
    }
});
const _userLogin = userLogin;
export { _userLogin as userLogin };
const userLogout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token;
        });
        yield req.user.save();
        res.send();
    }
    catch (error) {
        res.status(500).send();
    }
});
const _userLogout = userLogout;
export { _userLogout as userLogout };
const userLogoutAll = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        req.user.tokens = [];
        yield req.user.save();
        res.send();
    }
    catch (error) {
        res.status(500).send();
    }
});
const _userLogoutAll = userLogoutAll;
export { _userLogoutAll as userLogoutAll };
const allUsersList = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield user_1.default.find();
        (0, successRes)(res, { users }, statusCode.Ok, messages.Ok);
    }
    catch (error) {
        console.error(error);
        (0, errorRes)(res, statusCode.Internal_Server_Error, messages.Server_Error);
    }
});
const _allUsersList = allUsersList;
export { _allUsersList as allUsersList };
const userById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield user_1.default.findById(req.params.id);
        if (!user) {
            return (0, errorRes)(res, statusCode.Not_Found, messages.notFound(constant.user));
        }
        (0, successRes)(res, user, statusCode.Ok, messages.Ok);
    }
    catch (error) {
        console.error(error);
        (0, errorRes)(res, statusCode.Internal_Server_Error, messages.Server_Error);
    }
});
const _userById = userById;
export { _userById as userById };
const userUpdate = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield user_1.default.findById(req.params.id);
        if (!user) {
            return (0, errorRes)(res, statusCode.Not_Found, messages.notFound(constant.user));
        }
        const { name, email, password, age } = req.body;
        const hashed = yield hashedPassword(password);
        if (name && email && password && age) {
            user.name = name;
            user.email = email;
            user.password = hashed;
            user.age = age;
        }
        yield user.save();
        (0, successRes)(res, user, statusCode.Ok, messages.Ok);
    }
    catch (error) {
        console.error(error);
        (0, errorRes)(res, statusCode.Internal_Server_Error, messages.Server_Error);
    }
});
const _userUpdate = userUpdate;
export { _userUpdate as userUpdate };
const userDelete = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield user_1.default.findByIdAndDelete(req.params.id);
        if (!user) {
            return (0, errorRes)(res, statusCode.Not_Found, messages.notFound(constant.user));
        }
        (0, successRes)(res, user, statusCode.Ok, messages.Ok);
    }
    catch (error) {
        console.error(error);
        (0, errorRes)(res, statusCode.Internal_Server_Error, messages.Server_Error);
    }
});
const _userDelete = userDelete;
export { _userDelete as userDelete };
export const upload = (0, multer_1.default)({
    limits: {
        fieldSize: 100000000,
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error());
        }
        cb(undefined, true);
    },
});
const uploadAvatar = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield user_1.default.findById(req.params.id);
        const buffer = yield (0, sharp_1.default)(req.file.buffer)
            .resize({ width: 300, height: 300 })
            .png()
            .toBuffer();
        if (!user) {
            return (0, errorRes)(res, statusCode.Not_Found, messages.notFound(constant.user));
        }
        user.avatar = buffer;
        yield user.save();
        (0, successRes)(res, user, statusCode.Ok, messages.Ok);
    }
    catch (error) {
        console.log(error);
        (0, errorRes)(res, statusCode.Internal_Server_Error, messages.Server_Error);
    }
});
const _uploadAvatar = uploadAvatar;
export { _uploadAvatar as uploadAvatar };
const deleteAvatar = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield user_1.default.findById(req.params.id);
        if (!user) {
            return (0, errorRes)(res, statusCode.Not_Found, messages.notFound(constant.user));
        }
        user.avatar = undefined;
        yield user.save();
        (0, successRes)(res, user, statusCode.Ok, messages.Ok);
    }
    catch (error) {
        console.log(error);
        (0, errorRes)(res, statusCode.Internal_Server_Error, messages.Server_Error);
    }
});
const _deleteAvatar = deleteAvatar;
export { _deleteAvatar as deleteAvatar };
const getUserAvatar = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield user_1.default.findById(req.params.id);
        if (!user || !user.avatar) {
            return (0, errorRes)(res, statusCode.Not_Found, messages.notFound(constant.user));
        }
        res.set('Content-Type', 'image/jpeg');
        (0, successRes)(res, user.avatar, statusCode.Ok, messages.Ok);
    }
    catch (error) {
        console.error(error);
        (0, errorRes)(res, statusCode.Internal_Server_Error, messages.Server_Error);
    }
});
const _getUserAvatar = getUserAvatar;
export { _getUserAvatar as getUserAvatar };
