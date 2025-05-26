import { Request, Response } from "express";
import { DownloadImageRequest } from "../interfaces";
import b2ServiceInstance from "../services/b2Service";

export async function downloadImage(
  req: Request<{}, {}, DownloadImageRequest>,
  res: Response
) {
  const { filenames } = req.body;

  if (!Array.isArray(filenames) || filenames.length === 0) {
    res.status(400).json({ error: "fileNames must be a non-empty array" });
    return;
  }

  try {
    const downloadUrls = await Promise.all(
      filenames.map(async (filename) => {
        const downloadUrl = await b2ServiceInstance.getDownloadUrlForFile(
          filename
        );
        return { filename, downloadUrl };
      })
    );
    res.json({ downloadUrls });
  } catch (err) {
    console.error("Error getting download URLs:", err);
    res.status(500).json({ error: "Failed to get download URLs" });
  }
}
