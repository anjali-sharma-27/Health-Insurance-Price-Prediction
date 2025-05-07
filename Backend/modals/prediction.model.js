import mongoose, { Schema } from "mongoose";

const predictionSchema = new mongoose.Schema({
    userId: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true,
  },
  username:{
    type:String,
    required :true
  },
  email: String,
  age: Number,
  gender: String,
  height:Number,
  weight:Number,
  bmi: Number,
  children: Number,
  smoker: String,
  region: String,
  predicted_price: Number
}, { timestamps: true });

export const PredictionSchema = mongoose.model("PredictionSchema", predictionSchema);
