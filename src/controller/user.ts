import User from '../models/user';
import bcrypt from 'bcrypt';
import { messages, statusCode, constant } from '../util/messages';
import sharp from 'sharp';
import multer from 'multer';
// import { sendWelcomEmail } from '../emails/account';
import { successRes, errorRes } from '../util/response';
import dotenv from 'dotenv';
import { Request, Response } from 'express';
dotenv.config();

const hashedPassword = async (password: string): Promise<string> => {
  const hashed = await bcrypt.hash(password, 10);
  return hashed;
};

export const userAdd = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, age, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return errorRes(res, statusCode.Bad_Request, messages.Bad_Request);
    }

    const hashed = await hashedPassword(password);

    const user = new User({
      name,
      email,
      password: hashed,
      age,
    });

    // sendWelcomEmail(user.email, user.name);
    const token = await user.generateAuthToken();
    await user.save();
    successRes(res, { user, token }, statusCode.Ok, messages.Created);
  } catch (error) {
    console.error(error);
    errorRes(res, statusCode.Internal_Server_Error, messages.Server_Error);
  }
};

export const userLogin = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return errorRes(
        res,
        statusCode.Bad_Request,
        messages.Invalid_Credentials
      );
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return errorRes(
        res,
        statusCode.Bad_Request,
        messages.Invalid_Credentials
      );
    }

    const token = await user.generateAuthToken();

    successRes(res, { user, token }, statusCode.Ok, messages.Ok);
  } catch (error) {
    console.error(error);
    errorRes(res, statusCode.Internal_Server_Error, messages.Server_Error);
  }
};

export const userLogout = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { user, token } = req.body;
    user.tokens = user.tokens.filter((userToken: string) => {
      return userToken !== token;
    });

    await user.save();
    res.send();
  } catch (error) {
    res.status(500).send();
  }
};

export const userLogoutAll = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { user } = req.body;
    user.tokens = [];

    await user.save();
    res.send();
  } catch (error) {
    res.status(500).send();
  }
};

export const allUsersList = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const users = await User.find();

    successRes(res, { users }, statusCode.Ok, messages.Ok);
  } catch (error) {
    console.error(error);
    errorRes(res, statusCode.Internal_Server_Error, messages.Server_Error);
  }
};

export const userById = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return errorRes(
        res,
        statusCode.Not_Found,
        messages.notFound(constant.user)
      );
    }
    successRes(res, user, statusCode.Ok, messages.Ok);
  } catch (error) {
    console.error(error);
    errorRes(res, statusCode.Internal_Server_Error, messages.Server_Error);
  }
};

export const userUpdate = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return errorRes(
        res,
        statusCode.Not_Found,
        messages.notFound(constant.user)
      );
    }

    const { name, email, password, age } = req.body;

    const hashed = await hashedPassword(password);

    if (name && email && password && age) {
      user.name = name;
      user.email = email;
      user.password = hashed;
      user.age = age;
    }

    await user.save();

    successRes(res, user, statusCode.Ok, messages.Ok);
  } catch (error) {
    console.error(error);
    errorRes(res, statusCode.Internal_Server_Error, messages.Server_Error);
  }
};

export const userDelete = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return errorRes(
        res,
        statusCode.Not_Found,
        messages.notFound(constant.user)
      );
    }

    successRes(res, user, statusCode.Ok, messages.Ok);
  } catch (error) {
    console.error(error);
    errorRes(res, statusCode.Internal_Server_Error, messages.Server_Error);
  }
};

export const upload = multer({
  limits: {
    fieldSize: 100000000,
  },
  fileFilter(
    req: Request,
    file: Express.Multer.File,
    cb: multer.FileFilterCallback
  ) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return cb(new Error());
    }

    cb(null, true);
  },
});

export const uploadAvatar = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const user = await User.findById(req.params.id);
    const buffer = await sharp(req.file?.buffer)
      .resize({ width: 300, height: 300 })
      .png()
      .toBuffer();
    if (!user) {
      return errorRes(
        res,
        statusCode.Not_Found,
        messages.notFound(constant.user)
      );
    }

    user.avatar = buffer;
    await user.save();
    successRes(res, user, statusCode.Ok, messages.Ok);
  } catch (error) {
    console.log(error);
    errorRes(res, statusCode.Internal_Server_Error, messages.Server_Error);
  }
};

export const deleteAvatar = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return errorRes(
        res,
        statusCode.Not_Found,
        messages.notFound(constant.user)
      );
    }
    user.avatar = undefined;
    await user.save();
    successRes(res, user, statusCode.Ok, messages.Ok);
  } catch (error) {
    console.log(error);
    errorRes(res, statusCode.Internal_Server_Error, messages.Server_Error);
  }
};

export const getUserAvatar = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const user = await User.findById(req.params.id);

    if (!user || !user.avatar) {
      return errorRes(
        res,
        statusCode.Not_Found,
        messages.notFound(constant.user)
      );
    }
    res.set('Content-Type', 'image/jpeg');
    successRes(res, user.avatar, statusCode.Ok, messages.Ok);
  } catch (error) {
    console.error(error);
    errorRes(res, statusCode.Internal_Server_Error, messages.Server_Error);
  }
};
