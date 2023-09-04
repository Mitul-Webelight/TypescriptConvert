"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _errorRes = exports.successRes = void 0;
export { _errorRes as errorRes };
const successRes = (res, data, statusCode, message) => {
    res.status(statusCode).json({ message: message, data });
};
const _successRes = successRes;
export { _successRes as successRes };
const errorRes = (res, statusCode, message) => {
    res.status(statusCode).json({ error: message });
};
var _errorRes = errorRes;
export { _errorRes as errorRes };
