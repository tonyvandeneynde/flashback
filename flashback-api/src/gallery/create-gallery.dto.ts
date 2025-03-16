import { IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateGalleryDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsUUID()
  parentId: number;

  @IsUUID()
  accountId: number;
}
