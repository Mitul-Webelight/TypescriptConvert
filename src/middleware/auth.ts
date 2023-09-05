import jwt, { Secret, JwtPayload } from 'jsonwebtoken';
import User from '../models/user';
import { messages, statusCode } from '../util/messages';
import { errorRes } from '../util/response';
import { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
dotenv.config();

interface DecodedJwtPayload extends JwtPayload {
  _id: string;
}

export default async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tokenHeader = req.header('Authorization') as string;

    if (!tokenHeader) {
      throw new Error('Authorization header is missing');
    }

    const token = tokenHeader.replace('Bearer ', '') as string;
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET_KEY as Secret
    ) as DecodedJwtPayload;
    const user = await User.findOne({
      _id: decoded._id,
      'tokens.token': token,
    });

    if (!user) {
      throw new Error();
    }
    let storeToken = req.body;
    let storeUser = req.body;

    storeToken.token = token;
    storeUser.user = user;

    next();
  } catch (error) {
    console.log(error);
    errorRes(res, statusCode.Unauthorized, messages.Unauthorized);
  }
};
