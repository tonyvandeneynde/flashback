import { useEffect, useState } from "react";
import { Folder, Gallery } from "../../apiConstants";
import { useOrganizeContext } from "../../contexts/OrganizeContext";
import { getFolderTreeItemId } from "../../utils";
import FolderTree from "./FolderTree";

export const FolderTreeExplorer = ({
  disableGalleries,
  disableFolders,
  onCurrentNodeChanged,
}: {
  disableGalleries?: boolean;
  disableFolders?: boolean;
  onCurrentNodeChanged: (node: Folder | Gallery | null) => void;
}) => {
  const { folders } = useOrganizeContext();
  const [selectedNode, setSelectedNode] = useState<Folder | Gallery | null>(
    null
  );

  const handleSelectNode = (path: (Folder | Gallery)[]) => {
    setSelectedNode(path[path.length - 1]);
  };

  useEffect(() => {
    onCurrentNodeChanged(selectedNode);
  }, [selectedNode]);

  const selectedTreeItemId = getFolderTreeItemId(selectedNode);

  return (
    <FolderTree
      disableGalleries={disableGalleries}
      disableFolders={disableFolders}
      folders={folders}
      onSelectNode={handleSelectNode}
      selectedItemId={selectedTreeItemId}
    />
  );
};
