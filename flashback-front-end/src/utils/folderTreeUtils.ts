import { Folder, Gallery, isFolder, isGallery } from "../apiConstants";

export const getFolderTreeItemId = (folder: Folder | Gallery | null) => {
  if (!folder) return "";

  if (isFolder(folder)) {
    return `folder-${folder.id}`;
  }

  if (isGallery(folder)) {
    return `gallery-${folder.id}`;
  }

  return "";
};
