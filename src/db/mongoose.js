const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.mongodbURL, {
  useNewUrlParser: true,
});

console.log('Database connected!');
