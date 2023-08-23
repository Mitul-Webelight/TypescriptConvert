const express = require('express');
const userRouter = require('./router/user');
const taskRouter = require('./router/task');
require('./db/mongoose');
require('dotenv').config();

const app = express();
const port = process.env.PORT;

app.use(express.json());

app.use(userRouter);
app.use(taskRouter);

app.listen(port, () => {
  console.log(`Server is runing on ${port}`);
});

// const Task = require('./models/task')
// const User = require('./models/user')

// const main = async () => {
//     const task = await Task.findById('5c2e505a3253e18a43e612e6')
//     await task.populate('owner').execPopulate()
//     console.log(task.owner)

//     // const user = await User.findById('5c2e4dcb5eac678a23725b5b')
//     // await user.populate('tasks').execPopulate()
//     // console.log(user.tasks)
// }

// main()