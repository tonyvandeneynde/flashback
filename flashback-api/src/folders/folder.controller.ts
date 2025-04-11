import {
  Controller,
  Get,
  Post,
  Body,
  Delete,
  Query,
  Put,
  Param,
  Request,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth';
import { FolderService } from './folder.service';
import { Folder } from 'src/database/entities';
import { CreateFolderDto } from './create-folder.dto';
import { CreateGalleryDto } from '../gallery';
import { MapDataDto } from 'src/dto';

@UseGuards(JwtAuthGuard)
@Controller('folders')
export class FoldersController {
  constructor(private readonly folderService: FolderService) {}

  @Get()
  async getAllFolders(
    @Request() req: { user: { accountId: number; email: string } },
  ): Promise<Folder[]> {
    return this.folderService.getAllFolders(req.user.accountId);
  }

  @Get('map-data/:folderId')
  @ApiOperation({ summary: 'Get map data for a folder' })
  async getMapData(
    @Param('folderId', ParseIntPipe) folderId: number,
    @Request() req: { user: { accountId: number; email: string } },
  ): Promise<MapDataDto[]> {
    return this.folderService.getMapData(req.user.accountId, folderId);
  }

  @Post('create')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        parent: { type: 'number' },
      },
    },
  })
  async createFolder(
    @Body() createUserDto: CreateFolderDto,
    @Request() req: { user: { accountId: number; email: string } },
  ) {
    return this.folderService.createFolder({
      ...createUserDto,
      accountId: req.user.accountId,
    });
  }

  @Post('get-path')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        id: { type: 'number' },
      },
    },
  })
  async getFolderPath(@Body('id') id: number) {
    return this.folderService.getFolderPath(id);
  }

  @Post('add-new-gallery')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        parentId: { type: 'number' },
      },
    },
  })
  async addNewGallery(
    @Body() createGalleryDto: CreateGalleryDto,
    @Request() req: { user: { accountId: number; email: string } },
  ) {
    return this.folderService.addNewGalleryToFolder({
      folderId: createGalleryDto.parentId,
      galleryName: createGalleryDto.name,
      accountId: req.user.accountId,
    });
  }

  @Put('update')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        id: { type: 'number' },
        name: { type: 'string' },
        parentId: { type: 'number' },
        showMapInFolder: { type: 'boolean' },
      },
    },
  })
  async updateFolder(
    @Body()
    updateFolderDto: {
      id: number;
      parentId?: number;
      name?: string;
      showMapInFolder?: boolean;
    },
    @Request() req: { user: { accountId: number; email: string } },
  ) {
    return this.folderService.updateFolder({
      id: updateFolderDto.id,
      name: updateFolderDto.name,
      parentId: updateFolderDto.parentId,
      showMapInFolder: updateFolderDto.showMapInFolder,
      accountId: req.user.accountId,
    });
  }

  @Delete('delete')
  @ApiQuery({
    name: 'id',
    type: 'number',
    required: true,
  })
  async deleteFolder(
    @Query('id') id: number,
    @Request() req: { user: { accountId: number; email: string } },
  ) {
    return this.folderService.deleteFolderWithSubFoldersAndGalleries({
      id,
      accountId: req.user.accountId,
    });
  }

  @Delete('delete-gallery')
  @ApiQuery({
    name: 'id',
    type: 'number',
    required: true,
  })
  async deleteGallery(
    @Query('id') id: number,
    @Request() req: { user: { accountId: number; email: string } },
  ) {
    return this.folderService.deleteGallery({
      id: req.user.accountId,
      accountId: 3,
    });
  }
}
