import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsString, ArrayNotEmpty } from 'class-validator';

export class LinkRequestDto {
  @ApiProperty({
    example: ['file1', 'file2', 'file3'],
    description: 'Array of file names to get their download links',
  })
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  filenames: string[];
}

export class DownloadUrlDto {
  @ApiProperty({
    example: 'file1.jpg',
    description: 'Name of the file',
  })
  filename: string;
  downloadUrl: string;
}

export class LinkResponseDto {
  @ApiProperty({
    type: [DownloadUrlDto],
    description: 'Array of download URLs for the requested files',
  })
  downloadUrls: DownloadUrlDto[];
}
