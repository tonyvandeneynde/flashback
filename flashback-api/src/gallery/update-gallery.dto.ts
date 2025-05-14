import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateGalleryDto {
  @ApiProperty({
    example: 'New gallery name',
    description: 'New gallery name',
    required: false,
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({
    example: 1,
    description: 'New parent folder ID',
    required: false,
  })
  @IsNumber()
  @IsOptional()
  parentId?: number;

  @ApiProperty({
    example: 1,
    description: 'New cover image ID',
    required: false,
  })
  @IsNumber()
  @IsOptional()
  coverImageId?: number;

  @ApiProperty({
    example: true,
    description: 'New show map in gallery setting',
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  showMapInGallery?: boolean;

  @ApiProperty({
    example: true,
    description:
      'New show images in parent folder maps setting. Shows the images in the maps of ancestor folders if they display a map.',
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  showImagesOnParentFolderMaps?: boolean;
}
