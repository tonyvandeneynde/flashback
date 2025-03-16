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
`;

export const ImageTile = ({
  image,
  isSelected = false,
  onClick,
}: {
  image: Image;
  isSelected?: boolean;
  onClick: () => void;
}) => {
  return (
    <StyledCard
      isSelected={isSelected}
      onClick={onClick}
      // TODO: Implement onDoubleClick to go inside folder and change the position in the folder tree
      //   onDoubleClick={onDoubleClick}
    >
      <StyledImage src={image.mediumPath} alt={image.filename} />
    </StyledCard>
  );
};
