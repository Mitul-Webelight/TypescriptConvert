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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_1 = __importDefault(require("../models/user"));
const messages_1 = require("../util/messages");
const response_1 = require("../util/response");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.default = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const tokenHeader = req.header('Authorization');
        if (!tokenHeader) {
            throw new Error('Authorization header is missing');
        }
        const token = tokenHeader.replace('Bearer ', '');
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET_KEY);
        const user = yield user_1.default.findOne({
            _id: decoded._id,
            'tokens.token': token,
        });
        if (!user) {
            throw new Error();
        }
        req.token = token;
        req.user = user;
        next();
    }
    catch (error) {
        console.log(error);
        (0, response_1.errorRes)(res, messages_1.statusCode.Unauthorized, messages_1.messages.Unauthorized);
    }
});
