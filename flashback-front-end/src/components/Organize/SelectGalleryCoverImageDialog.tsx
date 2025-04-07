import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
  useTheme,
} from "@mui/material";
import { ImageGrid } from "./ImageGrid";
import { useAllImagesByGallery } from "../../services";
import { useState } from "react";
import { Image } from "../../apiConstants";

export const SelectGalleryCoverImageDialog = ({
  open,
  galleryId,
  handleSelectedImage,
  handleClose,
}: {
  open: boolean;
  galleryId: number;
  handleSelectedImage: (image: Image) => void;
  handleClose: () => void;
}) => {
  const theme = useTheme();

  const { images, status, error } = useAllImagesByGallery(galleryId);

  const [selectedImage, setSelectedImage] = useState<Image | null>(null);

  const selectedImageIds = selectedImage ? [selectedImage.id] : [];

  const handleImageClick = (imageId: number) => {
    const image = images.find((img) => img.id === imageId) || null;
    setSelectedImage(image);
  };

  const onSelectImageClick = () => {
    if (selectedImage) {
      handleSelectedImage(selectedImage);
    }
  };

  return (
    <Dialog open={open} fullWidth>
      <DialogTitle textAlign={"center"} color={theme.palette.secondary.main}>
        Select Cover Image
      </DialogTitle>
      <DialogContent>
        <Typography variant="body1">Select a cover image</Typography>
        {status === "pending" && <CircularProgress />}
        {status === "error" && (
          <Typography color="error">Error: {error?.message}</Typography>
        )}
        {images.length > 0 && (
          <ImageGrid
            galleryId={galleryId}
            images={images}
            onImageClick={handleImageClick}
            selectedImageIds={new Set(selectedImageIds)}
          />
        )}
      </DialogContent>
      <DialogActions>
        <Button
          onClick={onSelectImageClick}
          color="primary"
          disabled={!selectedImage}
        >
          Set Cover Image
        </Button>
        <Button onClick={handleClose} color="primary">
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};
