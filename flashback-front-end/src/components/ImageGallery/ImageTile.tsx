import { styled } from "@mui/material";

const StyledImage = styled("img")`
  width: auto;
  cursor: pointer;
`;

export const ImageTile = ({
  imageSrc,
  height,
  alt,
  onDoubleClick,
}: {
  imageSrc: string;
  height: number;
  alt: string;
  onDoubleClick: () => void;
}) => {
  return (
    <StyledImage
      height={`${height}px`}
      src={imageSrc}
      alt={alt}
      onDoubleClick={onDoubleClick}
    />
  );
};
