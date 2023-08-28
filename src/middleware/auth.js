import jwt from 'jsonwebtoken';
import User from '../models/user.js';
import { messages, statusCode } from '../util/messages.js';
import { errorRes } from '../util/response.js';
import dotenv from 'dotenv';
dotenv.config();

export default async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const user = await User.findOne({
      _id: decoded._id,
      'tokens.token': token,
    });

    if (!user) {
      throw new Error();
    }

    req.token = token;
    req.user = user;
    next();
  } catch (error) {
    console.log(error);
    errorRes(res, statusCode.Unauthorized, messages.Unauthorized);
  }
};
