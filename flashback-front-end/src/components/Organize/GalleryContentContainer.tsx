import { styled } from "@mui/material";
import { Gallery } from "../../apiConstants";
import { ImageGrid } from "./ImageGrid";
import { ImageGalleryUploadWrapper } from "./UploadWrapper";

const StyledImageGalleryUploadWrapper = styled(ImageGalleryUploadWrapper)`
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow: hidden;
`;

export const GalleryContentContainer = ({ gallery }: { gallery: Gallery }) => {
  return (
    <StyledImageGalleryUploadWrapper gallery={gallery}>
      <ImageGrid gallery={gallery} />
    </StyledImageGalleryUploadWrapper>
  );
};
