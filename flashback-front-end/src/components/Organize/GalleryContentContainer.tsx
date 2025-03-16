import { Gallery } from "../../apiConstants";
import { useOrganizeContext } from "../../contexts/OrganizeContext";
import { useImagesByGallery } from "../../services/useImagesByGallery";
import { ImageGrid } from "./ImageGrid";
import { ImageGalleryUploadWrapper } from "./UploadWrapper";

export const GalleryContentContainer = ({ gallery }: { gallery: Gallery }) => {
  const imageData = useImagesByGallery(gallery.id);
  const { toggleSelectedImage, selectedImages } = useOrganizeContext();

  return (
    <ImageGalleryUploadWrapper gallery={gallery}>
      <ImageGrid
        {...imageData}
        toggleSelectedImage={toggleSelectedImage}
        selectedImages={selectedImages}
      />
    </ImageGalleryUploadWrapper>
  );
};
