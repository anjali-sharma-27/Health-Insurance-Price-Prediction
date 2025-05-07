import express from "express";
import dotenv from "dotenv";

import authRoutes from "./routes/auth.routes.js"
import PredictRoutes from "./routes/predict.routes.js"
import connectDB from "./db/index.js";
import cors from "cors";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors({
  origin: "http://127.0.0.1:5500",
  credentials: true, // needed for cookies
}));

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/predict", PredictRoutes)


connectDB()
.then(()=>{
  app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });
})
.catch((error) => {
  console.error("Mongoose connection error: ", error);
  process.exit(1);
});


