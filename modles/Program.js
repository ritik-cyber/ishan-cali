// Dependencies
const mongoose = require("mongoose");

const ProgramSchema = new mongoose.Schema(
  {
    name: String,
    imageLink: String,
    videoLink: {
      type: String,
      select: false,
    },
    description: String,
    price: Number,
    discountPercent: Number,
    content: {
      type: String,
      select: false,
    },
  },
  { timestamps: true }
);

const Program = mongoose.model("Program", ProgramSchema);
module.exports = Program;
