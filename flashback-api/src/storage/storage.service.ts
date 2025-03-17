import { Injectable } from '@nestjs/common';
import * as sharp from 'sharp';
import * as fs from 'fs';

@Injectable()
export class StorageService {
  private storageType: string;

  constructor() {
    this.storageType = process.env.STORAGE_TYPE || 'local';
  }

  async storeFile(file: Express.Multer.File): Promise<{
    originalPath: string;
    mediumPath: string;
    thumbnailPath: string;
  }> {
    if (this.storageType === 'local') {
      return this.storeFileLocally(file);
    } else {
      // TODO: Implement cloud storage logic for dev / production here (e.g., AWS S3)
      throw new Error('Cloud storage not implemented');
    }
  }

  private async storeFileLocally(file: Express.Multer.File): Promise<{
    originalPath: string;
    mediumPath: string;
    thumbnailPath: string;
  }> {
    const uploadDir = './uploads';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }

    const dateSuffix = Date.now();

    // New unique filename
    const fileExtension = file.originalname.split('.').pop();
    const fileName = `${file.originalname.replace(/\.[^/.]+$/, '')}-${dateSuffix}.${fileExtension}`;

    const originalPath = `${uploadDir}/${fileName}`;
    const mediumPath = `${uploadDir}/medium-${fileName}`;
    const thumbnailPath = `${uploadDir}/thumbnail-${fileName}`;

    fs.writeFileSync(originalPath, file.buffer);

    await sharp(originalPath).resize(800).keepExif().toFile(mediumPath);
    await sharp(originalPath).resize(200, 200).keepExif().toFile(thumbnailPath);

    const localImageServerUrl =
      process.env.LOCAL_URL || 'http://localhost:8080/';
    const originalUrl = `${localImageServerUrl}/${originalPath}`;
    const mediumUrl = `${localImageServerUrl}/${mediumPath}`;
    const thumbnailUrl = `${localImageServerUrl}/${thumbnailPath}`;

    return {
      originalPath: originalUrl,
      mediumPath: mediumUrl,
      thumbnailPath: thumbnailUrl,
    };
  }
}
