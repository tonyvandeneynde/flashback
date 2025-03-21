import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { Folder, Gallery } from "../../apiConstants";

export const DeleteButton = ({
  selectedNode,
  selectedImageIds,
  handleDeleteNodes,
  handleDeleteImages,
}: {
  selectedNode: Folder | Gallery | null;
  selectedImageIds: number[];
  handleDeleteNodes: (closeDialog: () => void) => void;
  handleDeleteImages: (closeDialog: () => void) => void;
}) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  let handleDelete = null;
  let dialogText = "";

  if (selectedNode) {
    handleDelete = handleDeleteNodes;
    dialogText =
      "Are you sure you want to delete all selected items and all of its subfolders, galleries and all its content?";
  } else if (selectedImageIds.length > 0) {
    handleDelete = handleDeleteImages;
    dialogText = "Are you sure you want to delete all selected images?";
  }

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
        disabled={!selectedNode && selectedImageIds.length === 0}
      >
        Delete
      </Button>
      <Dialog open={dialogOpen} onClose={handleDialogClose}>
        <DialogTitle>Delete</DialogTitle>
        <DialogContent>
          <Typography variant="h6">
            Are you sure you want to delete all selected items and all of its
            subfolders, galleries and all its content?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            Cancel
          </Button>
          <Button
            onClick={() => handleDelete?.(handleDialogClose)}
            color="primary"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
