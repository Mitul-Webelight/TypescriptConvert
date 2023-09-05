import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const mongodbUrl = process.env.MONGODB_URL as string;

if (!mongodbUrl) {
  throw new Error('MONGODB_URL environment variable is not defined');
}

mongoose
  .connect(mongodbUrl)
  .then(() => {
    console.log(process.env.MONGODB_CONNECTION as string);
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });
