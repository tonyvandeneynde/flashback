import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class GetImagesDto {
  @ApiProperty({
    description: 'Gallery ID to get images of a specific gallery',
    example: 1,
  })
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  galleryId?: number;

  @ApiProperty({
    description: 'Status of the images (e.g. deleted)',
    example: 'deleted',
    required: false,
  })
  @IsOptional()
  @IsString()
  status?: string;
}
