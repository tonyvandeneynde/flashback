import { styled, Typography } from "@mui/material";
import { Folder, Gallery, isFolder, isGallery } from "../../apiConstants";
import FolderIcon from "@mui/icons-material/Folder";
import PhotoLibraryIcon from "@mui/icons-material/PhotoLibrary";

interface TileProps {
  node: Folder | Gallery;
  onClick: () => void;
}

const StyledTile = styled("div")<{
  backgroundImage: string | false | undefined;
}>`
  position: relative;
  width: 100%;
  padding-bottom: 60%; /* Aspect ratio 4:3 (200x150) */
  border: 1px solid #ccc;
  border-radius: 8px;
  cursor: pointer;
  overflow: hidden;
  transition: transform 0.2s;
  background-color: ${({ theme }) => theme.palette.background.paper};

  ${(props) =>
    props.backgroundImage
      ? `
    background: linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)),
      url(${props.backgroundImage});
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
  `
      : ""}

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
  const backgroundImage = isGallery(node) && node.coverImage?.thumbnailPath;

  return (
    <StyledTile backgroundImage={backgroundImage} onClick={onClick}>
      <StyledTitle>
        {isFolder(node) ? <FolderIcon /> : <PhotoLibraryIcon />}
        <Typography variant="button">{node.name}</Typography>
      </StyledTitle>
    </StyledTile>
  );
};
