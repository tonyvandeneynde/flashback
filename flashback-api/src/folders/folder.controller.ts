import {
  Controller,
  Get,
  Post,
  Body,
  Delete,
  Put,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth';
import { FolderService } from './folder.service';
import { Folder } from 'src/database/entities';
import { CreateFolderDto } from './create-folder.dto';
import { CreateGalleryDto } from '../gallery';
import { MapDataResponseDto } from 'src/mapData';
import { UpdateFolderDto } from './update-folder.dto';
import { AccountId } from 'src/auth/decorators/accountId.decorator';

@UseGuards(JwtAuthGuard)
@Controller('folders')
export class FoldersController {
  constructor(private readonly folderService: FolderService) {}

  @Get()
  @ApiOperation({ summary: 'Get all folders' })
  async getAllFolders(@AccountId() accountId: number): Promise<Folder[]> {
    return this.folderService.getAllFolders(accountId);
  }

  @Get('map-data/:id')
  @ApiOperation({ summary: 'Get map data for a folder' })
  async getMapData(
    @Param('id', ParseIntPipe) id: number,
    @AccountId() accountId: number,
  ): Promise<MapDataResponseDto[]> {
    return this.folderService.getMapData(accountId, id);
  }

  @Get(':id/path')
  @ApiOperation({ summary: 'Get the folder tree path of a folder' })
  async getFolderPath(@Param('id', ParseIntPipe) id: number) {
    return this.folderService.getFolderPath(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new folder' })
  async createFolder(
    @Body() createFolderDto: CreateFolderDto,
    @AccountId() accountId: number,
  ) {
    return this.folderService.createFolder({
      ...createFolderDto,
      accountId,
    });
  }

  @Post('/galleries')
  @ApiOperation({
    summary:
      'Create a new gallery and associate it with a folder using parentId',
  })
  async addNewGallery(
    @Body() createGalleryDto: CreateGalleryDto,
    @AccountId() accountId: number,
  ) {
    return this.folderService.addNewGalleryToFolder({
      folderId: createGalleryDto.parentId,
      galleryName: createGalleryDto.name,
      accountId,
    });
  }

  @Put(':id')
  @ApiOperation({
    summary:
      'Update a folder by modifying its name, parentId, or showMapInFolder flag',
  })
  async updateFolder(
    @Param('id', ParseIntPipe) id: number,
    @Body()
    updateFolderDto: UpdateFolderDto,
    @AccountId() accountId: number,
  ) {
    return this.folderService.updateFolder({
      id,
      name: updateFolderDto.name,
      parentId: updateFolderDto.parentId,
      showMapInFolder: updateFolderDto.showMapInFolder,
      accountId,
    });
  }

  @Delete(':id')
  @ApiOperation({
    summary:
      'Delete a folder along with its subfolders and associated galleries',
  })
  async deleteFolder(
    @Param('id', ParseIntPipe) id: number,
    @AccountId() accountId: number,
  ) {
    return this.folderService.deleteFolderWithSubFoldersAndGalleries({
      id,
      accountId,
    });
  }

  @Delete('/galleries/:id')
  @ApiOperation({ summary: 'Delete a gallery and remove it from a folder' })
  async deleteGallery(
    @Param('id', ParseIntPipe) id: number,
    @AccountId() accountId: number,
  ) {
    return this.folderService.deleteGallery({
      id: id,
      accountId,
    });
  }
}
