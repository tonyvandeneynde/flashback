import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateImagesDto {
  @ApiProperty({
    description: 'Array of image IDs to update',
    example: [1, 2, 3],
  })
  @IsArray()
  @IsNumber({}, { each: true })
  ids: number[];

  @ApiProperty({ description: 'Parent ID of the images', example: 10 })
  @Type(() => Number)
  @IsNumber()
  parentId: number;

  @ApiProperty({
    description: 'New name for the images',
    example: 'Updated Image Name',
  })
  @IsOptional()
  @IsString()
  name?: string;
}
