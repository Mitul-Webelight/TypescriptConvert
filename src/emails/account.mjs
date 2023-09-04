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
export const _sendWelcomEmail = void 0;
export { _sendWelcomEmail as sendWelcomEmail };
const form_data_1 = __importDefault(require("form-data"));
const mailgun_js_1 = __importDefault(require("mailgun.js"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const mailgun = new mailgun_js_1.default(form_data_1.default);
const mg = mailgun.client({
    username: process.env.USER_NAME,
    key: process.env.API_KEY,
});
const sendWelcomEmail = (email, name) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        mg.messages.create(process.env.MG_DOMAIN, {
            from: 'mitulk@webelight.co.in',
            to: email,
            subject: 'Thanks for Joining!',
            text: 'Joining Email',
            html: `<h1>Welcome to the app ${name}. Let me know you're get along with app. </h1>`,
        });
    }
    catch (error) {
        console.log(error);
    }
});
const _sendWelcomEmail = sendWelcomEmail;
export { _sendWelcomEmail as sendWelcomEmail };
