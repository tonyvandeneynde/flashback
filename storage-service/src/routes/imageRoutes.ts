import { Router } from "express";
import { downloadImage } from "../controllers/imageController";

const router = Router();

/**
 * @route POST /download
 * @desc Get pre-signed download links for images
 * @body { fileNames: string[] } - An array of file names to download
 * @returns { downloadUrls: { fileName: string, downloadUrl: string }[] }
 */
router.post("/link", downloadImage);

export default router;
