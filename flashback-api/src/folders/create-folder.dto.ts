import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateFolderDto {
  @ApiProperty({ example: 'New Folder', description: 'Name of the folder' })
  @IsString()
  name: string;

  @ApiProperty({
    example: 1,
    description: 'Parent folder ID (optional)',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  parentId?: number;
}
