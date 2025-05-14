import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateGalleryDto {
  @ApiProperty({
    example: 'New gallery',
    description: 'New gallery name',
  })
  @IsString()
  name: string;

  @ApiProperty({
    example: 1,
    description: 'Gallery parent folder ID (optional)',
  })
  @IsOptional()
  @IsNumber()
  parentId: number;
}
