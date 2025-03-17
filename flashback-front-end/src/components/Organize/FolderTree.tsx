import { Folder, Gallery, isFolder } from "../../apiConstants";
import { SimpleTreeView } from "@mui/x-tree-view/SimpleTreeView";
import { TreeItem } from "@mui/x-tree-view/TreeItem";
import { styled, Typography } from "@mui/material";
import FolderIcon from "@mui/icons-material/Folder";
import PhotoLibraryIcon from "@mui/icons-material/PhotoLibrary";
import HomeIcon from "@mui/icons-material/Home";

interface FolderTreeProps {
  folders: Folder[];
  selectedItemId?: string;
  expandedItemsIds?: string[];
  onSelectNode: (path: (Folder | Gallery)[]) => void;
}

const StyledLabelContainer = styled("div")`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const FolderTree = ({
  folders,
  onSelectNode,
  selectedItemId,
  expandedItemsIds,
}: FolderTreeProps) => {
  const renderTree = (node: Folder | Gallery, path: Folder[]) => {
    let icon = <></>;

    if (isFolder(node)) {
      icon = node.id === folders[0].id ? <HomeIcon /> : <FolderIcon />;
    } else {
      icon = <PhotoLibraryIcon />;
    }

    return (
      <TreeItem
        key={node.id}
        itemId={`${
          isFolder(node) ? "folder-" : "gallery-"
        }${node.id.toString()}`}
        label={
          <StyledLabelContainer>
            {icon}
            <Typography>{node.name}</Typography>
          </StyledLabelContainer>
        }
        onClick={() => onSelectNode([...path, node])}
      >
        {isFolder(node) &&
          node.subfolders.map((subfolder) => {
            return renderTree(subfolder, [...path, node]);
          })}
        {isFolder(node) &&
          node.galleries.map((gallery) => {
            return renderTree(gallery, [...path, node]);
          })}
      </TreeItem>
    );
  };

  return (
    <SimpleTreeView
      selectedItems={selectedItemId}
      expandedItems={expandedItemsIds}
    >
      {folders.map((folder) => renderTree(folder, []))}
    </SimpleTreeView>
  );
};

export default FolderTree;
