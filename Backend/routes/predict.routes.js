import { Router } from "express";
import { getPredictionsByUserId, prediction } from "../controllers/predict.controller.js";

const router = Router();

router.post("/:userId", prediction);
router.get("/getPrediction/:userId",getPredictionsByUserId)

export default router;