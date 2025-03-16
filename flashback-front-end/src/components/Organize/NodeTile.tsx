import { styled, Typography } from "@mui/material";
import { Folder, Gallery, isFolder } from "../../apiConstants";
import FolderIcon from "@mui/icons-material/Folder";
import ImageIcon from "@mui/icons-material/Image";

const StyledCard = styled("div")<{ isSelected: boolean }>`
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
  return (
    <StyledCard
      isSelected={isSelected}
      onClick={onClick}
      onDoubleClick={onDoubleClick}
    >
      <Typography variant="button">{node.name}</Typography>
      {isFolder(node) ? <FolderIcon /> : <ImageIcon />}
    </StyledCard>
  );
};
