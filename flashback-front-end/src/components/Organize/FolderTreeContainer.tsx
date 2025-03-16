import { Folder, Gallery } from "../../apiConstants";
import { useOrganizeContext } from "../../contexts/OrganizeContext";
import FolderTree from "./FolderTree";

export const FolderTreeContainer = () => {
  const { folders, setCurrentNode, setPath } = useOrganizeContext();

  const handleSelectNode = (
    node: Folder | Gallery,
    path: (Folder | Gallery)[]
  ) => {
    setCurrentNode(node);
    setPath([...path, node]);
  };
  return <FolderTree folders={folders} onSelectNode={handleSelectNode} />;
};
