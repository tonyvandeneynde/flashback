import { styled, Typography } from "@mui/material";
import { Folder, Gallery, isFolder } from "../../apiConstants";
import FolderIcon from "@mui/icons-material/Folder";
import PhotoLibraryIcon from "@mui/icons-material/PhotoLibrary";

interface TileProps {
  node: Folder | Gallery;
  onClick: () => void;
}

const StyledFolderTile = styled("div")`
  position: relative;
  width: 100%;
  padding-bottom: 60%; /* Aspect ratio 4:3 (200x150) */
  border: 1px solid #ccc;
  border-radius: 8px;
  cursor: pointer;
  overflow: hidden;
  transition: transform 0.2s;

  &:hover {
    transform: scale(1.05);
  }

  & > div {
    position: absolute;
    bottom: 0;
    text-align: center;
  }
`;

const StyledTitle = styled("div")`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px;
  width: 100%;
  background-color: ${({ theme }) =>
    `rgba(${theme.palette.background.paper}, 0.5)`};
`;

export const NodeTile = ({ node, onClick }: TileProps) => {
  return (
    <StyledFolderTile onClick={onClick}>
      <StyledTitle>
        {isFolder(node) ? <FolderIcon /> : <PhotoLibraryIcon />}
        <Typography variant="button">{node.name}</Typography>
      </StyledTitle>
    </StyledFolderTile>
  );
};
