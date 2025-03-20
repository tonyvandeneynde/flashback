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

export const getTreeNodeById = (
  nodes: (Folder | Gallery)[],
  id: number,
  type: "Folder" | "Gallery"
): Folder | Gallery | null => {
  for (const node of nodes) {
    if (node.id === id) {
      if (type === "Folder" && isFolder(node)) return node;
      if (type === "Gallery" && isGallery(node)) return node;
    }

    if (type === "Gallery" && isFolder(node)) {
      const found = getTreeNodeById(node.galleries, id, type);
      if (found) return found;
    }

    if (isFolder(node) && node.subfolders) {
      const found = getTreeNodeById(node.subfolders, id, type);
      if (found) return found;
    }
  }

  return null;
};
