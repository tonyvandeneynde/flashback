import { styled, Typography } from "@mui/material";
import { Folder, Gallery, isFolder, isGallery } from "../../apiConstants";
import FolderIcon from "@mui/icons-material/Folder";
import PhotoLibraryIcon from "@mui/icons-material/PhotoLibrary";

const StyledCard = styled("div")<{
  isSelected: boolean;
  backgroundImage: string | false | undefined;
}>`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
  padding: 32px 8px 16px 16px;
  width: 150px;
  height: 150px;
  margin: 8px;
  cursor: pointer;
  background-color: ${({ theme }) => theme.palette.background.paper};
  border: ${({ isSelected, theme }) =>
    isSelected ? `2px solid ${theme.palette.primary.main}` : "none"};
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
`;

export const NodeTile = ({
  node,
  isSelected = false,
  onClick,
  onDoubleClick,
}: {
  node: Folder | Gallery;
  isSelected?: boolean;
  onClick: () => void;
  onDoubleClick: () => void;
}) => {
  const backgroundImage = isGallery(node) && node.coverImage?.thumbnailPath;

  return (
    <StyledCard
      backgroundImage={backgroundImage}
      isSelected={isSelected}
      onClick={onClick}
      onDoubleClick={onDoubleClick}
    >
      <Typography variant="button">{node.name}</Typography>
      {isFolder(node) ? <FolderIcon /> : <PhotoLibraryIcon />}
    </StyledCard>
  );
};
