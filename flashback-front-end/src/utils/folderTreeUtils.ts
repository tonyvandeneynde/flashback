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
  const { node } = getTreeNodeByIdOrName(nodes, type, [], id);
  return node;
};

export const getTreeNodeByName = (
  nodes: (Folder | Gallery)[],
  name: string,
  type: NodeType
): Folder | Gallery | null => {
  const { node } = getTreeNodeByIdOrName(nodes, type, [], undefined, name);
  return node;
};

export const getTreePathById = (
  nodes: (Folder | Gallery)[],
  id: number,
  type: NodeType
): (Folder | Gallery)[] => {
  const { path } = getTreeNodeByIdOrName(nodes, type, [], id);
  return path;
};

export const getTreePathByName = (
  nodes: (Folder | Gallery)[],
  name: string,
  type: NodeType
): (Folder | Gallery)[] => {
  const { path } = getTreeNodeByIdOrName(nodes, type, [], undefined, name);
  return path;
};

const getTreeNodeByIdOrName = (
  nodes: (Folder | Gallery)[],
  type: NodeType,
  path: (Folder | Gallery)[] = [],
  id?: number,
  name?: string
): { node: Folder | Gallery | null; path: (Folder | Gallery)[] } => {
  for (const node of nodes) {
    if ((id !== undefined && node.id === id) || (name && node.name === name)) {
      if (type === "folder" && isFolder(node))
        return { node, path: [...path, node] };
      if (type === "gallery" && isGallery(node))
        return { node, path: [...path, node] };
    }

    if (type === "gallery" && isFolder(node) && node.galleries.length > 0) {
      const found = getTreeNodeByIdOrName(
        node.galleries,
        type,
        [...path, node],
        id,
        name
      );
      if (found.node) return found;
    }

    if (isFolder(node) && node.subfolders.length > 0) {
      const found = getTreeNodeByIdOrName(
        node.subfolders,
        type,
        [...path, node],
        id,
        name
      );
      if (found.node) return found;
    }
  }

  return { node: null, path: [] };
};

export const getTreeNodeType = (node: Folder | Gallery): NodeType => {
  if (isFolder(node)) {
    return "folder";
  } else {
    return "gallery";
  }
};

export const getTreeNodesFromUrlPath = (folders: Folder[], path: string[]) => {
  const treeNodePath = path.reduce(
    (acc, item) => {
      if (!acc) {
        return null;
      }

      item = decodeURIComponent(item);
      const itemName = item.substring(item.indexOf("-") + 1);
      const lastNode = acc[acc.length - 1];

      if (item.startsWith("g-") && isFolder(lastNode)) {
        const node = lastNode?.galleries.find(
          (gallery) =>
            gallery.name.toLocaleLowerCase() === itemName.toLocaleLowerCase()
        );
        if (node) {
          return [...acc, node];
        }
      } else if (item.startsWith("f-") && isFolder(lastNode)) {
        const node = lastNode?.subfolders.find(
          (folder) =>
            folder.name.toLocaleLowerCase() === itemName.toLocaleLowerCase()
        );
        if (node) {
          return [...acc, node];
        }
      }

      return null;
    },
    [folders[0]] as (Folder | Gallery)[] | null
  );

  return treeNodePath;
};

export const getUrlPathForNode = (
  folders: Folder[],
  node: Folder | Gallery
) => {
  const path = getTreePathById(folders, node.id, getTreeNodeType(node));
  const pathWithoutRoot = path.slice(1);
  const urlPath = pathWithoutRoot.map((item) => {
    if (isFolder(item)) {
      return `f-${encodeURIComponent(item.name)}`;
    } else {
      return `g-${encodeURIComponent(item.name)}`;
    }
  });

  return urlPath.join("/");
};
