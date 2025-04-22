import mongoose from "mongoose";

const drawingSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },
    json: {
      type: String,
      required: true
    },
    svg: {
      type: String
    }
  },
  {
    timestamps: true
  }
);

const Drawing = mongoose.model("Drawing", drawingSchema);

export default Drawing;
