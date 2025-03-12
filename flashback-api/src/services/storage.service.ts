import { Injectable } from '@nestjs/common';
import { join } from 'path';
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

    const originalPath = join(uploadDir, file.originalname);
    const mediumPath = join(uploadDir, `medium-${file.originalname}`);
    const thumbnailPath = join(uploadDir, `thumbnail-${file.originalname}`);

    fs.writeFileSync(originalPath, file.buffer);

    await sharp(originalPath).resize(800).toFile(mediumPath);
    await sharp(originalPath).resize(200).toFile(thumbnailPath);

    return { originalPath, mediumPath, thumbnailPath };
  }
}
