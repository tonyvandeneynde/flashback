import {
  Controller,
  Post,
  Body,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { B2Service } from 'src/b2/b2.service';
import { LINK_ROUTES } from './link.routes';
import { LinkRequestDto, LinkResponseDto } from './link-request.dto';
import { ApiResponse } from '@nestjs/swagger';

@Controller(LINK_ROUTES.BASE)
export class LinkController {
  constructor(private readonly b2Service: B2Service) {}

  @Post()
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved download links',
    type: LinkResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid request payload',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  async getDownloadLink(
    @Body() body: LinkRequestDto,
  ): Promise<LinkResponseDto> {
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
