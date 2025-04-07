import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  styled,
  Typography,
  useTheme,
} from "@mui/material";
import { useState } from "react";
import { Gallery, isGallery } from "../../apiConstants";
import { FolderTreeExplorer } from "./FolderTreeExplorer";

const StyledDialog = styled(Dialog)`
  ul[role="tree"] {
    width: 400px;
    height: 300px;
    overflow-y: auto;
  }
`;

export const MoveImagesButton = ({
  selectedImageIds,
  handleMoveImages,
}: {
  selectedImageIds: number[];
  handleMoveImages: ({
    closeDialog,
    selectedImageIds,
    newImagesParent,
  }: {
    closeDialog: () => void;
    selectedImageIds: number[];
    newImagesParent: Gallery;
  }) => void;
}) => {
  const theme = useTheme();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newImagesParent, setNewImagesParent] = useState<Gallery | null>(null);

  const handleMoveClick = () => {
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const handleNewParentNodeChanged = (node: Gallery | null) => {
    if (node && isGallery(node)) {
      setNewImagesParent(node);
      return;
    }
  };

  const handleMove = () => {
    if (!newImagesParent) return;

    handleMoveImages?.({
      closeDialog: handleDialogClose,
      selectedImageIds,
      newImagesParent: newImagesParent,
    });
  };

  return (
    <>
      <Button
        variant="contained"
        color="primary"
        onClick={handleMoveClick}
        disabled={selectedImageIds.length === 0}
      >
        Move Images
      </Button>
      <StyledDialog open={dialogOpen} onClose={handleDialogClose}>
        <DialogTitle textAlign={"center"} color={theme.palette.secondary.main}>
          Move Images
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1">Select a new gallery</Typography>
        </DialogContent>
        <FolderTreeExplorer
          disableFolders={true}
          onCurrentNodeChanged={handleNewParentNodeChanged}
        />
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            Cancel
          </Button>
          <Button
            onClick={handleMove}
            color="primary"
            disabled={!newImagesParent}
          >
            Move
          </Button>
        </DialogActions>
      </StyledDialog>
    </>
  );
};
