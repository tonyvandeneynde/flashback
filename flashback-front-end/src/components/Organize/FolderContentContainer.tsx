import { styled } from "@mui/material";
import { NodeTile } from "./NodeTile";
import { Folder } from "../../apiConstants";
import { useOrganizeContext } from "../../contexts/OrganizeContext";

const StyledGrid = styled("div")`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 8px;
`;

export const FolderContentContainer = ({ folder }: { folder: Folder }) => {
  const {
    toggleSelectedNode: toggleSelectedItem,
    selectedNodes: selectedItems,
  } = useOrganizeContext();

  return (
    <StyledGrid>
      {folder.subfolders.map((subfolder) => (
        <NodeTile
          key={`folder-${subfolder.id}`}
          node={subfolder}
          onClick={() => toggleSelectedItem(subfolder)}
          onDoubleClick={() => {}}
          isSelected={selectedItems.includes(subfolder)}
        />
      ))}
      {folder.galleries.map((gallery) => (
        <NodeTile
          key={`gallery-${gallery.id}`}
          node={gallery}
          onClick={() => toggleSelectedItem(gallery)}
          onDoubleClick={() => {}}
          isSelected={selectedItems.includes(gallery)}
        />
      ))}
    </StyledGrid>
  );
};
