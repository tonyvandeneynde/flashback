import {
  Controller,
  Get,
  Param,
  UseGuards,
  Request,
  Put,
  Body,
  ParseIntPipe,
} from '@nestjs/common';
import { GalleryService } from './gallery.service';
import { MapDataDto } from '../dto';
import { JwtAuthGuard } from 'src/auth';
import { ApiBody, ApiOperation } from '@nestjs/swagger';

@UseGuards(JwtAuthGuard)
@Controller('gallery')
export class GalleryController {
  constructor(private readonly galleryService: GalleryService) {}

  @Put(':id')
  @ApiOperation({ summary: 'Update a gallery' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string', nullable: true },
        parentId: { type: 'number', nullable: true },
        coverImageId: { type: 'number', nullable: true },
        showMapInGallery: { type: 'boolean', nullable: true },
        showImagesOnParentFolderMaps: { type: 'boolean', nullable: true },
      },
    },
    examples: {
      'Update Gallery': {
        summary: 'Update a gallery',
        value: {
          name: 'Updated Gallery Name',
          parentId: 1,
          coverImageId: 2,
          showMapInGallery: true,
          showImagesOnParentFolderMaps: false,
        },
      },
    },
  })
  async updateGallery(
    @Param('id', ParseIntPipe) id: number,
    @Body()
    updateGalleryDto: {
      name?: string;
      parentId?: number;
      coverImageId?: number;
      showMapInGallery?: boolean;
      showImagesOnParentFolderMaps?: boolean;
    },
    @Request() req: { user: { accountId: number; email: string } },
  ) {
    return this.galleryService.updateGallery({
      accountId: req.user.accountId,
      id,
      ...updateGalleryDto,
    });
  }

  @Get('map-data/:galleryId')
  @ApiOperation({ summary: 'Get map data for a gallery' })
  async getMapData(
    @Param('galleryId', ParseIntPipe) galleryId: number,
    @Request() req: { user: { accountId: number; email: string } },
  ): Promise<MapDataDto[]> {
    return this.galleryService.getMapDataByGalleryId(
      req.user.accountId,
      galleryId,
    );
  }
}
