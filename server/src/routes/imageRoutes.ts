import { Router } from "express";
import express from "express";
import { formatImage, uploadImages, getImages } from "../controllers/imageController";
import { upload } from "../middlewares/uploadMiddleware";

const router = Router();

router.post("/api/format-image", upload.array("images"), formatImage);
router.post("api/upload-images", upload.array("images"), uploadImages);
router.get("/api/images", getImages);

export default router;
