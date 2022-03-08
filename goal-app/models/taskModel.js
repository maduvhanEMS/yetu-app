const mongoose = require("mongoose");

const taskSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    goal: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Goal",
    },
    text: {
      type: String,
      required: [true, "Please add a text value"],
    },
    outcomes: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Task", taskSchema);
