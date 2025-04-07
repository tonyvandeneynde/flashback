import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";
import { useState } from "react";

export const DeleteImagesButton = ({
  selectedImageIds,
  handleDeleteImages,
}: {
  selectedImageIds: number[];
  handleDeleteImages: (closeDialog: () => void) => void;
}) => {
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleDeleteClick = () => {
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  return (
    <>
      <Button
        variant="contained"
        color="primary"
        onClick={handleDeleteClick}
        disabled={selectedImageIds.length === 0}
      >
        Delete
      </Button>
      <Dialog open={dialogOpen}>
        <DialogTitle>Delete</DialogTitle>
        <DialogContent>
          <Typography variant="h6">
            Are you sure you want to delete all selected images?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            Cancel
          </Button>
          <Button
            onClick={() => handleDeleteImages(handleDialogClose)}
            color="primary"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
