import { Folder, Gallery, isFolder, isGallery } from "../apiConstants";
import { NodeType } from "../services";

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
  type: NodeType
): Folder | Gallery | null => {
  for (const node of nodes) {
    if (node.id === id) {
      if (type === "folder" && isFolder(node)) return node;
      if (type === "gallery" && isGallery(node)) return node;
    }

    if (type === "gallery" && isFolder(node)) {
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

export const getTreeNodeType = (
  node: Folder | Gallery | null
): NodeType | null => {
  if (!node) return null;

  if (isFolder(node)) {
    return "folder";
  } else {
    return "gallery";
  }
};
