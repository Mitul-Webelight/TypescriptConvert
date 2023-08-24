const express = require('express');
const userRouter = require('./router/user');
const taskRouter = require('./router/task');
const multer = require('multer');
const message = require('./util/messages');
require('./db/mongoose');
require('dotenv').config();

const app = express();
const port = process.env.PORT;

const upload = multer({
  dest: 'images',
  limits: {
    fieldSize: 1000000,
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(doc|docx)$/)) {
      return cb(new Error(message.error_wordFileUpload));
    }

    cb(undefined, true);
  },
});

app.post('/upload', upload.single('upload'), (req, res) => {
  try {
    res.send(message.success_upload);
  } catch (error) {
    res.send(error);
  }
});

app.use(express.json());

app.use(userRouter);
app.use(taskRouter);

app.listen(port, () => {
  console.log(`Server is runing on ${port}`);
});
