import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

export class FolderResponseDto {
  @ApiProperty({ example: 1, description: 'Unique identifier of the folder' })
  @Expose()
  id: number;

  @ApiProperty({ example: 'My Folder', description: 'Name of the folder' })
  @Expose()
  name: string;

  @ApiProperty({
    example: true,
    description: 'Flag indicating if the folder shows a map',
  })
  @Expose()
  showMapInFolder: boolean;

  @Exclude() // Exclude any additional properties not explicitly defined
  otherProperties?: any;
}
