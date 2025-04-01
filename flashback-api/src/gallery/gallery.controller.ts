import { Controller, Get, Param, UseGuards, Request } from '@nestjs/common';
import { GalleryService } from './gallery.service';
import { MapDataDto } from '../dto';
import { JwtAuthGuard } from 'src/auth';

@UseGuards(JwtAuthGuard)
@Controller('gallery')
export class GalleryController {
  constructor(private readonly galleryService: GalleryService) {}

  @Get('map-data/:galleryId')
  async getMapData(
    @Param('galleryId') galleryId: number,
    @Request() req: { user: { accountId: number; email: string } },
  ): Promise<MapDataDto[]> {
    return this.galleryService.getMapDataByGalleryId(
      req.user.accountId,
      galleryId,
    );
  }
}
