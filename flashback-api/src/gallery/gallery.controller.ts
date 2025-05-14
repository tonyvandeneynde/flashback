import {
  Controller,
  Get,
  Param,
  UseGuards,
  Put,
  Body,
  ParseIntPipe,
} from '@nestjs/common';
import { GalleryService } from './gallery.service';
import { MapDataResponseDto } from '../mapData';
import { JwtAuthGuard } from 'src/auth';
import { ApiOperation } from '@nestjs/swagger';
import { AccountId } from 'src/auth/decorators/accountId.decorator';
import { UpdateGalleryDto } from 'src/gallery/update-gallery.dto';
import { GALLERY_ROUTES } from './gallery.routes';

@UseGuards(JwtAuthGuard)
@Controller(GALLERY_ROUTES.BASE)
export class GalleryController {
  constructor(private readonly galleryService: GalleryService) {}

  @Put(GALLERY_ROUTES.UPDATE)
  @ApiOperation({ summary: 'Update a gallery' })
  async updateGallery(
    @Param('id', ParseIntPipe) id: number,
    @Body()
    updateGalleryDto: UpdateGalleryDto,
    @AccountId() accountId: number,
  ) {
    return this.galleryService.updateGallery({
      accountId,
      id,
      ...updateGalleryDto,
    });
  }

  @Get(GALLERY_ROUTES.MAP_DATA)
  @ApiOperation({ summary: 'Get map data for a gallery' })
  async getMapData(
    @Param('galleryId', ParseIntPipe) galleryId: number,
    @AccountId() accountId: number,
  ): Promise<MapDataResponseDto[]> {
    return this.galleryService.getMapDataByGalleryId(accountId, galleryId);
  }
}
