import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class MapDataResponseDto {
  @ApiProperty({
    example: 1,
    description: 'Image ID',
  })
  @IsString()
  id: number;

  @ApiProperty({
    example: '50.43',
    description: 'Image latitude',
  })
  @IsString()
  latitude: string;

  @ApiProperty({
    example: '30.45',
    description: 'Image longitude',
  })
  @IsString()
  longitude: string;

  @ApiProperty({
    example: 'https://example.com/image.jpg',
    description: 'Image URL',
  })
  @IsString()
  imageUrl: string;

  @ApiProperty({
    example: 12,
    description: 'Gallery ID',
  })
  @IsNumber()
  galleryId: number;
}
