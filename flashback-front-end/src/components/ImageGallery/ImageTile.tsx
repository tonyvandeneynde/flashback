import { styled } from "@mui/material";

const StyledImage = styled("img")`
  width: auto;
  cursor: pointer;
`;

export const ImageTile = ({
  imageSrc,
  height,
  alt,
  onClick,
  onDoubleClick,
}: {
  imageSrc: string;
  height: number;
  alt: string;
  onClick?: () => void;
  onDoubleClick?: () => void;
}) => {
  return (
    <StyledImage
      loading="lazy"
      height={`${height}px`}
      src={imageSrc}
      alt={alt}
      onDoubleClick={onDoubleClick}
      onClick={onClick}
    />
  );
};
