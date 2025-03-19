import { styled } from "@mui/material";
import { Image } from "../../apiConstants";

const StyledCard = styled("div")<{ isSelected: boolean }>`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 150px;
  height: 150px;
  margin: 8px;
  cursor: pointer;
  background-color: ${({ theme }) => theme.palette.background.paper};
  border: ${({ isSelected, theme }) =>
    isSelected ? `2px solid ${theme.palette.primary.main}` : "none"};
`;

const StyledImage = styled("img")`
  width: 100%;
  height: 100%;
  object-fit: cover;
  image-orientation: from-image;
`;

export const ImageTile = ({
  image,
  isSelected = false,
  onClick,
  onDoubleClick,
}: {
  image: Image;
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
      <StyledImage src={image.thumbnailPath} alt={image.filename} />
    </StyledCard>
  );
};
