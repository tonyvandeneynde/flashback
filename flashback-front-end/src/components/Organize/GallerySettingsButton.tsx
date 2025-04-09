import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Input,
  styled,
  Switch,
  Typography,
  useTheme,
} from "@mui/material";
import { Gallery } from "../../apiConstants";
import { useEffect, useState } from "react";
import { ImageTile } from "../ImageGallery/ImageTile";
import { SelectGalleryCoverImageDialog } from "./SelectGalleryCoverImageDialog";
import { Image } from "../../apiConstants";

const SettingsItem = styled("div")`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px;
`;

const StyledTypography = styled(Typography)`
  margin-right: 8px;
`;

export const GallerySettingsButton = ({
  selectedGallery,
  onGallerySettingsChange,
}: {
  selectedGallery: Gallery;
  onGallerySettingsChange: ({
    name,
    showMapInGallery,
    showImagesOnParentFolderMaps,
    newCoverImage,
    closeDialog,
  }: {
    name: string | null;
    showMapInGallery: boolean | null;
    showImagesOnParentFolderMaps: boolean | null;
    newCoverImage: Image | null;
    closeDialog: () => void;
  }) => void;
}) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [imageSelectDialogOpen, setImageSelectDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(selectedGallery.name);
  const [coverImage, setCoverImage] = useState<Image | null>(
    selectedGallery.coverImage
  );
  const [showImagesOnParentFolderMaps, setShowImagesOnParentFolderMaps] =
    useState(selectedGallery.showImagesOnParentFolderMaps);
  const [showMapInGallery, setShowMapInGallery] = useState(
    selectedGallery.showMapInGallery
  );

  const theme = useTheme();

  useEffect(() => {
    setName(selectedGallery.name);
    setShowImagesOnParentFolderMaps(
      selectedGallery.showImagesOnParentFolderMaps
    );
    setShowMapInGallery(selectedGallery.showMapInGallery);
    setCoverImage(selectedGallery.coverImage);
  }, [selectedGallery]);

  const nameChanged = name !== selectedGallery.name;
  const coverImageChanged =
    coverImage?.id !== selectedGallery.coverImage?.id ||
    (coverImage && !selectedGallery.coverImage);
  const showImagesOnParentFolderMapsChanged =
    showImagesOnParentFolderMaps !==
    selectedGallery.showImagesOnParentFolderMaps;
  const showMapInGalleryChanged =
    showMapInGallery !== selectedGallery.showMapInGallery;

  const settingsChanged =
    nameChanged ||
    coverImageChanged ||
    showImagesOnParentFolderMapsChanged ||
    showMapInGalleryChanged;

  const handleCancel = () => {
    setDialogOpen(false);
    setIsEditing(false);
    setCoverImage(selectedGallery.coverImage);
    setName(selectedGallery.name);
    setShowImagesOnParentFolderMaps(
      selectedGallery.showImagesOnParentFolderMaps
    );
  };

  const handleCoverImageSelected = (image: Image) => {
    setCoverImage(image);
    setImageSelectDialogOpen(false);
  };

  const handleSave = () => {
    onGallerySettingsChange({
      name: nameChanged ? name : null,
      newCoverImage: coverImageChanged ? coverImage : null,
      showMapInGallery: showMapInGalleryChanged ? showMapInGallery : null,
      showImagesOnParentFolderMaps: showImagesOnParentFolderMapsChanged
        ? showImagesOnParentFolderMaps
        : null,
      closeDialog: () => setDialogOpen(false),
    });
  };

  const handleToggleShowImagesInFolderMaps = () => {
    setShowImagesOnParentFolderMaps((prev) => !prev);
  };

  const handleToggleShowMapInGallery = () => {
    setShowMapInGallery((prev) => !prev);
  };

  return (
    <>
      <Button
        variant="contained"
        color="primary"
        onClick={() => setDialogOpen(true)}
      >
        Gallery Settings
      </Button>
      <Dialog open={dialogOpen} fullWidth>
        <DialogTitle textAlign={"center"} color={theme.palette.secondary.main}>
          Gallery Settings
        </DialogTitle>
        <DialogContent>
          <SettingsItem>
            <Typography variant="body1">Gallery Name</Typography>
            {isEditing ? (
              <Input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Gallery Name"
              />
            ) : (
              <StyledTypography variant="body2">
                {selectedGallery.name}
              </StyledTypography>
            )}
          </SettingsItem>
          <SettingsItem>
            <Typography variant="body1">Show map in gallery</Typography>
            <Typography variant="body2">
              <Switch
                disabled={!isEditing}
                checked={showMapInGallery}
                onChange={handleToggleShowMapInGallery}
              />
            </Typography>
          </SettingsItem>
          <SettingsItem>
            <Typography variant="body1">
              Show images in parent folder maps
            </Typography>
            <Typography variant="body2">
              <Switch
                disabled={!isEditing}
                checked={showImagesOnParentFolderMaps}
                onChange={handleToggleShowImagesInFolderMaps}
              />
            </Typography>
          </SettingsItem>
          <SettingsItem>
            <Typography variant="body1">Cover Image</Typography>
            {coverImage ? (
              <Button
                disabled={!isEditing}
                onClick={() => setImageSelectDialogOpen(true)}
              >
                <ImageTile
                  imageSrc={coverImage.thumbnailPath}
                  alt={selectedGallery.name}
                  height={100}
                />
              </Button>
            ) : (
              <>
                <Button
                  disabled={!isEditing}
                  onClick={() => setImageSelectDialogOpen(true)}
                >
                  Select a cover image
                </Button>
              </>
            )}
          </SettingsItem>
        </DialogContent>
        <DialogActions>
          {isEditing ? (
            <Button
              variant="contained"
              onClick={handleSave}
              color="primary"
              disabled={!settingsChanged}
            >
              Save Changes
            </Button>
          ) : (
            <Button
              variant="contained"
              onClick={() => setIsEditing(true)}
              color="primary"
            >
              Edit settings
            </Button>
          )}
          <Button onClick={handleCancel} color="primary">
            Cancel
          </Button>
        </DialogActions>
        <SelectGalleryCoverImageDialog
          open={imageSelectDialogOpen}
          galleryId={selectedGallery.id}
          handleSelectedImage={handleCoverImageSelected}
          handleClose={() => setImageSelectDialogOpen(false)}
        />
      </Dialog>
    </>
  );
};
