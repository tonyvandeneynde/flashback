import { Controller, Get, Post, Body, Delete, Query } from '@nestjs/common';
import { ApiBody, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth';
import { FolderService } from './folder.service';
import { Folder } from 'src/database/entities';
import { CreateFolderDto } from './create-folder.dto';
import { CreateGalleryDto } from '../gallery';

// TODO: Restrict access to folders based on account
// @UseGuards(JwtAuthGuard)
@Controller('folders')
export class FoldersController {
  constructor(private readonly folderService: FolderService) {}

  @Get()
  async getAllFolders(): Promise<Folder[]> {
    // @Request() req: { user: { accountId: number; email: string } },
    return this.folderService.getAllFolders();
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
