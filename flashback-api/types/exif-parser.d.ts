declare module 'exif-parser' {
  interface ExifTags {
    [key: string]: any;
  }

  interface ExifData {
    tags: ExifTags;
    imageSize: {
      width: number;
      height: number;
    };
    thumbnailOffset: number;
    thumbnailLength: number;
    thumbnailType: number;
    app1Offset: number;
    exifOffset: number;
  }

  interface ExifParser {
    parse(): ExifData;
  }

  function create(buffer: Buffer): ExifParser;

  export { create, ExifParser, ExifData, ExifTags };
}
