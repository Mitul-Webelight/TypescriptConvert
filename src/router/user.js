const express = require('express');
const router = express.Router();
const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth')

router.post('/users', async (req, res) => {
  try {
    const { name, email, password, age } = req.body;

    const hashPassword = await bcrypt.hash(password, 8);

    const user = new User({
      name,
      email,
      password: hashPassword,
      age,
    });

    const token = await user.generateAuthToken();
    await user.save();
    res.status(201).json({ message: 'User created!', user, token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unable to create user!' });
  }
});

router.post('/user/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials!' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid credentials!' });
    }

    const token = jwt.sign({ userId: user._id }, 'your-secret-key', {
      expiresIn: '1h',
    });

    res.status(200).json({ user, token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error while logging in!' });
  }
});

router.get('/alluser',auth, async (req, res) => {
  try {
    const user = await User.find();

    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'unable to get!' });
  }
});

router.get('/user/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found!' });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unable to get user!' });
  }
});

router.put('/user/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found!' });
    }

    const { name, email, password, age } = req.body;

    if (name && email && password && age) {
      user.name = name;
      user.email = email;
      user.password = password;
      user.age = age;
    }

    await user.save();

    res.status(200).json({ message: 'User updated successfully', user });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: 'Error updating user' });
  }
});

router.delete('/user/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found!' });
    }

    res.status(200).json({ message: 'Following User is deleted!', user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error deleting user' });
  }
});

module.exports = router;
