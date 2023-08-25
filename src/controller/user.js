const User = require('../models/user');
const bcrypt = require('bcrypt');
const message = require('../util/messages');
const sharp = require('sharp');
const multer = require('multer');
const { sendWelcomEmail } = require('../emails/account');
require('dotenv').config();

const userAdd = async (req, res) => {
  try {
    const { name, email, password, age } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ error: message.error_400 });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      password: hashPassword,
      age,
    });
    sendWelcomEmail(user.email, user.name);
    const token = await user.generateAuthToken();
    await user.save();
    res.status(201).json({ message: message.success_201, user, token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: message.error_500 });
  }
};

const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ error: message.error_401 });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ error: message.error_401 });
    }

    const token = await user.generateAuthToken();

    res.status(200).json({ user, token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: message.error_500 });
  }
};

const userLogout = async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token !== req.token;
    });

    await req.user.save();
    res.send();
  } catch (error) {
    res.status(500).send();
  }
};

const userLogoutAll = async (req, res) => {
  try {
    req.user.tokens = [];

    await req.user.save();
    res.send();
  } catch (error) {
    res.status(500).send();
  }
};

const allUsersList = async (req, res) => {
  try {
    const users = await User.find();

    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: message.error_500 });
  }
};

const userById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: message.error_404 });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: message.error_500 });
  }
};

const userUpdate = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: message.error_404 });
    }

    const { name, email, password, age } = req.body;

    if (name && email && password && age) {
      user.name = name;
      user.email = email;
      user.password = await bcrypt.hash(password, 10);
      user.age = age;
    }

    await user.save();

    res.status(200).json({ message: message.success_200, user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: message.error_500 });
  }
};

const userDelete = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({ message: message.error_404 });
    }

    res.status(200).json({ message: message.success_200, user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: message.error_500 });
  }
};

const upload = multer(
  {
    limits: {
      fieldSize: 100000000,
    },
    fileFilter(req, file, cb) {
      if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
        return cb(new Error(message.error_imageFileUpload));
      }

      cb(undefined, true);
    },
  },
  (error, res, req, next) => {
    res.status(400).send({ error: error.message });
  }
);

const uploadAvatar = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const buffer = await sharp(req.file.buffer)
      .resize({ width: 300, height: 300 })
      .png()
      .toBuffer();
    if (!user) {
      return res.status(404).json({ message: message.error_404 });
    }

    user.avatar = buffer;
    await user.save();
    res.status(200).json({ message: message.success_upload });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: message.error_500 });
  }
};

const deleteAvatar = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: message.error_404 });
    }
    user.avatar = undefined;
    await user.save();
    res.status(200).json({ message: message.success_200 });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: message.error_500 });
  }
};

const getUserAvatar = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user || !user.avatar) {
      return res.status(404).json({ message: message.error_404 });
    }
    res.set('Content-Type', 'image/jpeg');
    res.status(200).send(user.avatar);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: message.error_500 });
  }
};

module.exports = {
  userAdd,
  userLogin,
  userLogout,
  userLogoutAll,
  allUsersList,
  userById,
  userUpdate,
  userDelete,
  uploadAvatar,
  deleteAvatar,
  getUserAvatar,
  upload,
};
