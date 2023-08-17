const express = require('express');
const User = require('./models/user');
const Task = require('./models/task');
require('./db/mongoose');

const app = express();
const port = 8000;

app.use(express.json());

app.post('/users', async (req, res) => {
  try {
    const user = new User(req.body);

    await user.save();
    res.status(201).json({ message: 'User created!' });
  } catch (e) {
    res.status(500).json({ Error: 'unable to create user!' });
    console.log(e);
  }
});

app.get('/alluser', async (req, res) => {
  try {
    const getUser = await User.find();

    res.status(200).json(getUser);
  } catch (e) {
    console.log(e);
    res.status(500).json({ Error: 'unable to get!' });
  }
});

app.post('/tasks', async (req, res) => {
  try {
    const task = new Task(req.body);

    await task.save();
    res.status(201).json({ message: 'Task created!' });
  } catch (e) {
    res.status(500).json({ Error: 'unable to create task!' });
    console.log(e);
  }
});

app.listen(port, () => {
  console.log(`Server is runing on ${port}`);
});
