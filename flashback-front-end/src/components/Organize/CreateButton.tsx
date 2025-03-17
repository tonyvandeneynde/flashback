import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  TextField,
} from "@mui/material";
import FolderIcon from "@mui/icons-material/Folder";
import PhotoLibraryIcon from "@mui/icons-material/PhotoLibrary";
import { useState } from "react";
import { Folder, Gallery, isGallery } from "../../apiConstants";

export const CreateButton = ({
  currentNode,
  handleCreate,
}: {
  currentNode: Folder | Gallery | null;
  handleCreate: (
    dialogType: "Folder" | "Gallery" | null,
    name: string,
    closeDialog: () => void
  ) => void;
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState<"Folder" | "Gallery" | null>(
    null
  );
  const [name, setName] = useState("");
  const open = Boolean(anchorEl);

  const handleCreateClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMenuItemClick = (type: "Folder" | "Gallery") => {
    if (currentNode === null) return;
    setDialogType(type);
    setDialogOpen(true);
    handleClose();
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setName("");
  };

  return (
    <>
      <Button
        variant="contained"
        color="primary"
        onClick={handleCreateClick}
        disabled={currentNode !== null && isGallery(currentNode)}
      >
        + Create
      </Button>
      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
        <MenuItem onClick={() => handleMenuItemClick("Folder")}>
          <ListItemIcon>
            <FolderIcon />
          </ListItemIcon>
          <ListItemText primary="Folder" />
        </MenuItem>
        <MenuItem onClick={() => handleMenuItemClick("Gallery")}>
          <ListItemIcon>
            <PhotoLibraryIcon />
          </ListItemIcon>
          <ListItemText primary="Gallery" />
        </MenuItem>
      </Menu>
      <Dialog open={dialogOpen} onClose={handleDialogClose}>
        <DialogTitle>Create {dialogType}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label={`${dialogType} Name`}
            type="text"
            fullWidth
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            Cancel
          </Button>
          <Button
            onClick={() => handleCreate(dialogType, name, handleDialogClose)}
            color="primary"
          >
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
