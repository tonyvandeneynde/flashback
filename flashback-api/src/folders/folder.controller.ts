import {
  Controller,
  Get,
  Post,
  Body,
  Delete,
  Put,
  Param,
  Request,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { ApiBody, ApiOperation } from '@nestjs/swagger';
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
  @ApiOperation({ summary: 'Get all images' })
  async getAllFolders(
    @Request() req: { user: { accountId: number; email: string } },
  ): Promise<Folder[]> {
    return this.folderService.getAllFolders(req.user.accountId);
  }

  @Get('map-data/:id')
  @ApiOperation({ summary: 'Get map data for a folder' })
  async getMapData(
    @Param('id', ParseIntPipe) id: number,
    @Request() req: { user: { accountId: number; email: string } },
  ): Promise<MapDataDto[]> {
    return this.folderService.getMapData(req.user.accountId, id);
  }

  @Get(':id/path')
  @ApiOperation({ summary: 'Get the folder tree path of a folder' })
  async getFolderPath(@Param('id', ParseIntPipe) id: number) {
    return this.folderService.getFolderPath(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new folder' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        parentId: { type: 'number' },
      },
    },
    examples: {
      'Create Folder': {
        value: {
          name: 'New Folder',
          parentId: 1,
        },
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

  @Post('/galleries')
  @ApiOperation({
    summary:
      'Create a new gallery and associate it with a folder using parentId',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        parentId: { type: 'number' },
      },
    },
    examples: {
      'Create Gallery': {
        value: {
          name: 'New Gallery',
          parentId: 1,
        },
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

  @Put(':id')
  @ApiOperation({
    summary:
      'Update a folder by modifying its name, parentId, or showMapInFolder flag',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        parentId: { type: 'number' },
        showMapInFolder: { type: 'boolean' },
      },
    },
    examples: {
      'Update Folder': {
        value: {
          name: 'Updated Folder',
          parentId: 1,
          showMapInFolder: true,
        },
      },
    },
  })
  async updateFolder(
    @Param('id', ParseIntPipe) id: number,
    @Body()
    updateFolderDto: {
      parentId?: number;
      name?: string;
      showMapInFolder?: boolean;
    },
    @Request() req: { user: { accountId: number; email: string } },
  ) {
    return this.folderService.updateFolder({
      id,
      name: updateFolderDto.name,
      parentId: updateFolderDto.parentId,
      showMapInFolder: updateFolderDto.showMapInFolder,
      accountId: req.user.accountId,
    });
  }

  @Delete(':id')
  @ApiOperation({
    summary:
      'Delete a folder along with its subfolders and associated galleries',
  })
  async deleteFolder(
    @Param('id', ParseIntPipe) id: number,
    @Request() req: { user: { accountId: number; email: string } },
  ) {
    return this.folderService.deleteFolderWithSubFoldersAndGalleries({
      id,
      accountId: req.user.accountId,
    });
  }

  @Delete('/galleries/:id')
  @ApiOperation({ summary: 'Delete a gallery and remove it from a folder' })
  async deleteGallery(
    @Param('id', ParseIntPipe) id: number,
    @Request() req: { user: { accountId: number; email: string } },
  ) {
    return this.folderService.deleteGallery({
      id: id,
      accountId: req.user.accountId,
    });
  }
}
