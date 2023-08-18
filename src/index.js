const express = require('express');
const userRouter = require('./router/user')
const taskRouter = require('./router/task')
require('./db/mongoose');

const app = express();
const port = 8000;

app.use(express.json());

app.use(userRouter)
app.use(taskRouter)

app.listen(port, () => {
  console.log(`Server is runing on ${port}`);
});
