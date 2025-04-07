import { styled, Toolbar } from "@mui/material";
import { useOrganizeContext } from "../../contexts/OrganizeContext";
import { isFolder, isGallery } from "../../apiConstants";
import { FolderToolbar } from "./FolderToolbar";
import { GalleryToolbar } from "./GalleryToolbar";

const StyledToolbar = styled(Toolbar)`
  display: flex;
  gap: 64px;
`;

export const StyledButtons = styled("div")`
  display: flex;
  gap: 8px;
`;

export const OrganizeToolbar = () => {
  const { currentNode } = useOrganizeContext();

  return (
    <StyledToolbar>
      {currentNode && isFolder(currentNode) && (
        <FolderToolbar currentFolder={currentNode} />
      )}
      {currentNode && isGallery(currentNode) && (
        <GalleryToolbar currentGallery={currentNode} />
      )}
    </StyledToolbar>
  );
};
