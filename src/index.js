import express from 'express';
import userRouter from './router/user.js';
import taskRouter from './router/task.js';
import './db/mongoose.js';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
const port = process.env.PORT;

app.use(express.json());

app.use(userRouter);
app.use(taskRouter);

app.listen(port, () => {
  console.log(`Server is runing on ${port}`);
});
