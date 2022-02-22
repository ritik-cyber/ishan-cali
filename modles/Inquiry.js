// Dependencies
const mongoose = require("mongoose");

const InquirySchema = new mongoose.Schema(
  {
    program: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Program",
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    status: {
      type: String,
      enum: ["ACCEPTED", "REJECTED", "PENDING"],
      default: "PENDING",
    },
  },
  { timestamps: true }
);

const Inquiry = mongoose.model("Inquiry", InquirySchema);
module.exports = Inquiry;
