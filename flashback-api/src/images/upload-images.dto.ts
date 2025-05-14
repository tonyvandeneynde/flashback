import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsString } from 'class-validator';

export class UploadImagesDto {
  @ApiProperty({ description: 'Gallery ID', example: 1 })
  @Type(() => Number)
  @IsNumber()
  galleryId: number;

  @ApiProperty({
    description: 'Optional upload ID',
    example: 'abc123',
    required: false,
  })
  @IsString()
  uploadId: string;
}
