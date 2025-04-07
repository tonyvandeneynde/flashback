import { useEffect, useState } from "react";
import { Folder, Gallery } from "../../apiConstants";
import { useOrganizeContext } from "../../contexts/OrganizeContext";
import { getFolderTreeItemId } from "../../utils";
import FolderTree from "./FolderTree";

type FolderTreeExplorerProps =
  | {
      disableGalleries: true;
      disableFolders?: false;
      onCurrentNodeChanged: (node: Folder | null) => void;
    }
  | {
      disableGalleries?: false;
      disableFolders: true;
      onCurrentNodeChanged: (node: Gallery | null) => void;
    }
  | {
      disableGalleries?: false;
      disableFolders?: false;
      onCurrentNodeChanged: (node: Folder | Gallery | null) => void;
    };

export const FolderTreeExplorer = ({
  disableGalleries,
  disableFolders,
  onCurrentNodeChanged,
}: FolderTreeExplorerProps) => {
  const { folders } = useOrganizeContext();
  const [selectedNode, setSelectedNode] = useState<Folder | Gallery | null>(
    null
  );

  const handleSelectNode = (path: (Folder | Gallery)[]) => {
    setSelectedNode(path[path.length - 1]);
  };

  useEffect(() => {
    onCurrentNodeChanged(selectedNode as any);
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
