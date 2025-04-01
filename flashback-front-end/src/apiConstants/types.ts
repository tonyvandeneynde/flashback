export interface Image {
  id: number;
  name: string;
  originalPath: string;
  mediumPath: string;
  thumbnailPath: string;
  tags: string[];
  width: number;
  height: number;
  orientation: number;
  latitude: string;
  longitude: string;
  latitudeRef: string;
  longitudeRef: string;
}

export interface Gallery {
  id: number;
  name: string;
  parentId: number;
}

export interface MapData {
  id: number;
  latitude: string;
  longitude: string;
  imageUrl: string;
  galleryId: number;
}

export interface Folder {
  id: number;
  name: string;
  parentId: number;
  subfolders: Folder[];
  galleries: Gallery[];
}

export function isGallery(
  FolderOrGallery: Folder | Gallery
): FolderOrGallery is Gallery {
  return !("subfolders" in FolderOrGallery);
}

export function isFolder(
  FolderOrGallery: Folder | Gallery
): FolderOrGallery is Folder {
  return "subfolders" in FolderOrGallery;
}
