import * as ExifParser from 'exif-parser';
import { Image } from 'src/database/entities';

interface ExifData {
  date: Date;
  latitude: number | null;
  longitude: number | null;
  latitudeRef: string | null;
  longitudeRef: string | null;
  orientation: number | null;
  width: number | null;
  height: number | null;
}

export const getExifData = ({
  fileBuffer,
}: {
  fileBuffer: Buffer;
}): ExifData => {
  const parser = ExifParser.create(fileBuffer);
  const result = parser.parse();

  const exifData = {
    date: new Date(result.tags.CreateDate * 1000),
    latitude: result.tags.GPSLatitude,
    longitude: result.tags.GPSLongitude,
    latitudeRef: result.tags.GPSLatitudeRef,
    longitudeRef: result.tags.GPSLongitudeRef,
    orientation: result.tags.Orientation,
    width: result.imageSize.width,
    height: result.imageSize.height,
  };

  return exifData;
};

export const getImageSizeNames = (originalFilename: string) => {
  const suffix = `__flashback__${Date.now()}`;

  const parts = originalFilename.split('.');
  const filenameWithoutExtension = parts.slice(0, -1).join('.');
  const fileExtension = parts[parts.length - 1];

  const filename = `${filenameWithoutExtension}${suffix}.${fileExtension}`;
  const mediumFilename = `${filenameWithoutExtension}-medium${suffix}.${fileExtension}`;
  const thumbnailFilename = `${filenameWithoutExtension}-thumbnail${suffix}.${fileExtension}`;

  return { filename, mediumFilename, thumbnailFilename };
};

export const createImageFromImageFile = (imageFile: Express.Multer.File) => {
  const { filename, mediumFilename, thumbnailFilename } = getImageSizeNames(
    imageFile.originalname,
  );

  const image = new Image();
  image.name = imageFile.originalname;
  image.originalPath = filename;
  image.mediumPath = mediumFilename;
  image.thumbnailPath = thumbnailFilename;

  // Extract EXIF metadata
  const exifData = getExifData({ fileBuffer: imageFile.buffer });
  console.log('exifData:', exifData);

  image.date = exifData.date;
  image.latitude = exifData.latitude?.toString();
  image.longitude = exifData.longitude?.toString();
  image.latitudeRef = exifData.latitudeRef?.toString();
  image.longitudeRef = exifData.longitudeRef?.toString();
  image.orientation = exifData.orientation ?? undefined;
  image.width = exifData.width ?? undefined;
  image.height = exifData.height ?? undefined;

  return image;
};
