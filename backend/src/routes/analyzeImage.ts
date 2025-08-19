import express from "express";
import { analyzeImageController } from "../controllers/analyzeImageController";

const router = express.Router();

router.post("/", analyzeImageController);

export default router;
