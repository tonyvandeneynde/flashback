import { Request, Response } from "express";
import { authorizeAccount, getDownloadUrl } from "../services/b2Service";
import { DownloadImageRequest } from "../interfaces";

export async function downloadImage(
  req: Request<{}, {}, DownloadImageRequest>,
  res: Response
) {
  const { fileNames } = req.body;

  if (!Array.isArray(fileNames) || fileNames.length === 0) {
    res.status(400).json({ error: "fileNames must be a non-empty array" });
    return;
  }

  try {
    const auth = await authorizeAccount();
    const downloadUrls = await Promise.all(
      fileNames.map(async (fileName) => {
        const downloadUrl = await getDownloadUrl(auth, fileName);
        return { fileName, downloadUrl };
      })
    );
    res.json({ downloadUrls });
  } catch (err) {
    console.error("Error getting download URLs:", err);
    res.status(500).json({ error: "Failed to get download URLs" });
  }
}
