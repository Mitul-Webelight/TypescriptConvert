import mongoose from 'mongoose';

interface Ttask {
  description: string;
  completed: boolean;
  owner: mongoose.Schema.Types.ObjectId;
}

const taskschema = new mongoose.Schema<Ttask>(
  {
    description: {
      type: String,
      // required: true,
      trim: true,
    },
    completed: {
      type: Boolean,
      default: false,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);
export default mongoose.model('Task', taskschema);
