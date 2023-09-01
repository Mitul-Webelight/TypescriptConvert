import User from '../models/user';
import bcrypt from 'bcrypt';
import { messages, statusCode, constant } from '../util/messages';
import sharp from 'sharp';
import multer from 'multer';
import { sendWelcomEmail } from '../emails/account';
import { successRes, errorRes } from '../util/response';
import dotenv from 'dotenv';
dotenv.config();

const hashedPassword = async (password: string) => {
  const hashed = await bcrypt.hash(password, 10);
  return hashed;
};

export const userAdd = async (req: any, res: any) => {
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

    sendWelcomEmail(user.email, user.name);
    const token = await user.generateAuthToken();
    await user.save();
    successRes(res, { user, token }, statusCode.Ok, messages.Created);
  } catch (error) {
    console.error(error);
    errorRes(res, statusCode.Internal_Server_Error, messages.Server_Error);
  }
};

export const userLogin = async (req: any, res: any) => {
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

export const userLogout = async (req: any, res: any) => {
  try {
    req.user.tokens = req.user.tokens.filter((token: any) => {
      return token.token !== req.token;
    });

    await req.user.save();
    res.send();
  } catch (error) {
    res.status(500).send();
  }
};

export const userLogoutAll = async (req: any, res: any) => {
  try {
    req.user.tokens = [];

    await req.user.save();
    res.send();
  } catch (error) {
    res.status(500).send();
  }
};

export const allUsersList = async (req: any, res: any) => {
  try {
    const users = await User.find();

    successRes(res, { users }, statusCode.Ok, messages.Ok);
  } catch (error) {
    console.error(error);
    errorRes(res, statusCode.Internal_Server_Error, messages.Server_Error);
  }
};

export const userById = async (req: any, res: any) => {
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

export const userUpdate = async (req: any, res: any) => {
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

export const userDelete = async (req: any, res: any) => {
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
  fileFilter(req: any, file: any, cb: any) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return cb(new Error());
    }

    cb(undefined, true);
  },
});

export const uploadAvatar = async (req: any, res: any) => {
  try {
    const user = await User.findById(req.params.id);
    const buffer = await sharp(req.file.buffer)
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

export const deleteAvatar = async (req: any, res: any) => {
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

export const getUserAvatar = async (req: any, res: any) => {
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
