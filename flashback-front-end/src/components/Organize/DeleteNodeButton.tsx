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

export const DeleteNodeButton = ({
  selectedNode,
  handleDeleteNode,
}: {
  selectedNode: Folder | Gallery | null;
  handleDeleteNode: (closeDialog: () => void) => void;
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
        disabled={!selectedNode}
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
            onClick={() => handleDeleteNode(handleDialogClose)}
            color="primary"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
