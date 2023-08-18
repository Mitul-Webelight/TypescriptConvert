const express = require('express');
const router = express.Router();
const User = require('../models/user');

router.post('/users', async (req, res) => {
  try {
    const { name, email, password, age } = req.body;

    const user = new User({
      name,
      email,
      password,
      age,
    });

    await user.save();
    res.status(201).json({ message: 'User created!' });
  } catch (error) {
    res.status(500).json({ error: 'unable to create user!' });
    console.error(error);
  }
});

router.get('/alluser', async (req, res) => {
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
