import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateFolderDto {
  @ApiProperty({
    example: 1,
    description: 'New parent folder ID',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  parentId?: number;

  @ApiProperty({
    example: 'New Folder name',
    description: 'New folder name',
    required: false,
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({
    example: true,
    description: 'New show map in folder setting',
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  showMapInFolder?: boolean;
}
