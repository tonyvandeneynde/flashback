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

  @Put()
  @ApiOperation({ summary: 'Update a gallery' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        id: { type: 'number' },
        name: { type: 'string', nullable: true },
        parentId: { type: 'number', nullable: true },
        coverImageId: { type: 'number', nullable: true },
        showMapInGallery: { type: 'boolean', nullable: true },
        showImagesOnParentFolderMaps: { type: 'boolean', nullable: true },
      },
      required: ['id'],
    },
  })
  async updateGallery(
    @Body()
    updateGalleryDto: {
      id: number;
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
