'use strict';
import express from 'express';
import userRouter from './router/user.mjs';
import taskRouter from './router/task.mjs';
import './db/mongoose.mjs';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT;

app.use(express.json());
app.use(userRouter);
app.use(taskRouter);

app.listen(port, () => {
  console.log(`Server is running on ${port}`);
});
