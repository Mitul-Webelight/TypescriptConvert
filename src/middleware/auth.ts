// import jwt from 'jsonwebtoken';
// import User from '../models/user';
// import { messages, statusCode } from '../util/messages';
// import { errorRes } from '../util/response';
// import dotenv from 'dotenv';
// dotenv.config();

// export default async (req:any, res:any, next:any) => {
//   try {
//     const token = req.header('Authorization').replace('Bearer ', '');
//     const decoded= jwt.verify(token, process.env.JWT_SECRET_KEY);
//     const user = await User.findOne({
//       _id: decoded._id,
//       'tokens.token': token,
//     });

//     if (!user) {
//       throw new Error();
//     }

//     req.token = token;
//     req.user = user;
//     next();
//   } catch (error) {
//     console.log(error);
//     errorRes(res, statusCode.Unauthorized, messages.Unauthorized);
//   }
// };
import jwt, { Secret, JwtPayload } from 'jsonwebtoken';
import User from '../models/user';
import { messages, statusCode } from '../util/messages';
import { errorRes } from '../util/response';
import dotenv from 'dotenv';
dotenv.config();

interface DecodedJwtPayload extends JwtPayload {
  _id: string;
}

export default async (req: any, res: any, next: any) => {
  try {
    const tokenHeader = req.header('Authorization');

    if (!tokenHeader) {
      throw new Error('Authorization header is missing');
    }

    const token = tokenHeader.replace('Bearer ', '');
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

    req.token = token;
    req.user = user;
    next();
  } catch (error) {
    console.log(error);
    errorRes(res, statusCode.Unauthorized, messages.Unauthorized);
  }
};
