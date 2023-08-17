const mongoose = require('mongoose');

const taskschema = mongoose.Schema(
  {
    description: {
      type: String,
      required: true,
      trim: true,
    },
    completed: {
      type: Boolean,
      default: false,
    },
  },
  {
    versionKey: false,
  }
);
const Task = mongoose.model('Task', taskschema);

module.exports = Task;
