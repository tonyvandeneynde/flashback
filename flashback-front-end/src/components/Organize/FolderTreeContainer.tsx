import { Folder, Gallery } from "../../apiConstants";
import { useOrganizeContext } from "../../contexts/OrganizeContext";
import { getFolderTreeItemId } from "../../utils";
import FolderTree from "./FolderTree";

export const FolderTreeContainer = () => {
  const { folders, setPath, path, currentNode } = useOrganizeContext();

  const handleSelectNode = (path: (Folder | Gallery)[]) => {
    setPath([...path]);
  };

  const selectedTreeItemId = getFolderTreeItemId(currentNode);
  const expandedItemsIds = path.map((node) => getFolderTreeItemId(node));

  return (
    <FolderTree
      folders={folders}
      onSelectNode={handleSelectNode}
      selectedItemId={selectedTreeItemId}
      expandedItemsIds={expandedItemsIds}
    />
  );
};
