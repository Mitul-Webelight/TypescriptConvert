import express from 'express';
import userRouter from './router/user';
import taskRouter from './router/task';
import './db/mongoose';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
const port = process.env.PORT as string;

app.use(express.json());

app.use(userRouter);
app.use(taskRouter);

app.listen(port, () => {
  console.log(`Server is runing on ${port}`);
});
