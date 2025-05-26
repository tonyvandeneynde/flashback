import {
  Controller,
  Post,
  Body,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { B2Service } from 'src/b2/b2.service';
import { LINK_ROUTES } from './link.routes';

export interface DownloadImageRequest {
  filenames: string[];
}

@Controller(LINK_ROUTES.BASE)
export class LinkController {
  constructor(private readonly b2Service: B2Service) {}

  @Post()
  async getDownloadLink(@Body() body: DownloadImageRequest) {
    const { filenames } = body;

    if (!Array.isArray(filenames) || filenames.length === 0) {
      throw new BadRequestException('fileNames must be a non-empty array');
    }

    try {
      const downloadUrls = await Promise.all(
        filenames.map(async (filename) => {
          const downloadUrl =
            await this.b2Service.getDownloadUrlForFile(filename);
          return { filename, downloadUrl };
        }),
      );
      return { downloadUrls };
    } catch (err) {
      console.error('Error getting download URLs:', err);
      throw new InternalServerErrorException('Failed to get download URLs');
    }
  }
}
