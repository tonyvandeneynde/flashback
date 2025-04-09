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
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth';
import { FolderService } from './folder.service';
import { Folder } from 'src/database/entities';
import { CreateFolderDto } from './create-folder.dto';
import { CreateGalleryDto } from '../gallery';
import { MapDataDto } from 'src/dto';

// TODO: Restrict access to folders based on account
// @UseGuards(JwtAuthGuard)
@Controller('folders')
export class FoldersController {
  constructor(private readonly folderService: FolderService) {}

  @Get()
  async getAllFolders(): Promise<Folder[]> {
    // @Request() req: { user: { accountId: number; email: string } },
    return this.folderService.getAllFolders(3);
  }

  @Get('map-data/:folderId')
  @ApiOperation({ summary: 'Get map data for a folder' })
  async getMapData(
    @Param('folderId', ParseIntPipe) folderId: number,
    // @Request() req: { user: { accountId: number; email: string } },
  ): Promise<MapDataDto[]> {
    return this.folderService.getMapData(3, folderId);
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
    // @Request() req: { user: { accountId: number; email: string } },
  ) {
    return this.folderService.createFolder({
      ...createUserDto,
      accountId: 3,
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
    // @Request() req: { user: { accountId: number; email: string } },
  ) {
    return this.folderService.addNewGalleryToFolder({
      folderId: createGalleryDto.parentId,
      galleryName: createGalleryDto.name,
      accountId: 3,
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
    // @Request() req: { user: { accountId: number; email: string } },
  ) {
    return this.folderService.updateFolder({
      id: updateFolderDto.id,
      name: updateFolderDto.name,
      parentId: updateFolderDto.parentId,
      showMapInFolder: updateFolderDto.showMapInFolder,
      accountId: 3,
    });
  }

  @Delete('delete')
  @ApiQuery({
    name: 'id',
    type: 'number',
    required: true,
  })
  async deleteFolder(@Query('id') id: number) {
    return this.folderService.deleteFolderWithSubFoldersAndGalleries({
      id,
      accountId: 3,
    });
  }

  @Delete('delete-gallery')
  @ApiQuery({
    name: 'id',
    type: 'number',
    required: true,
  })
  async deleteGallery(@Query('id') id: number) {
    return this.folderService.deleteGallery({
      id,
      accountId: 3,
    });
  }
}
