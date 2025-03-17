import {
  Button,
  Toolbar,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";
import { useOrganizeContext } from "../../contexts/OrganizeContext";
import { Folder, Gallery, isFolder, isGallery } from "../../apiConstants";
import FolderIcon from "@mui/icons-material/Folder";
import PhotoLibraryIcon from "@mui/icons-material/PhotoLibrary";
import { useState } from "react";
import { useCreateFolder } from "../../services/useCreateFolder";
import { useCreateGallery } from "../../services/useCreateNewGallery";

// TODO: Refactor
export const OrganizeToolbar = () => {
  const { currentNode } = useOrganizeContext();
  const { mutate } = useCreateFolder();
  const { mutate: mutateCreateGallery } = useCreateGallery();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState<string | null>(null);
  const [name, setName] = useState("");
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMenuItemClick = (type: string) => {
    if (currentNode === null) return;
    setDialogType(type);
    setDialogOpen(true);
    handleClose();
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setName("");
  };

  const handleCreateSuccess = (newFolderOrGallery: Folder | Gallery) => {
    handleDialogClose();

    if (currentNode === null || !isFolder(currentNode)) return;

    if (isFolder(newFolderOrGallery)) {
      currentNode.subfolders.push(newFolderOrGallery);
    }

    if (isGallery(newFolderOrGallery)) {
      currentNode.galleries.push(newFolderOrGallery);
    }
  };

  const handleCreate = () => {
    if (currentNode === null) return;

    if (dialogType === "Folder") {
      mutate(
        { name, parentId: currentNode?.id },
        { onSuccess: (newFolder) => handleCreateSuccess(newFolder) }
      );
    }

    if (dialogType === "Gallery") {
      mutateCreateGallery(
        { name, parentId: currentNode?.id },
        { onSuccess: (newGallery) => handleCreateSuccess(newGallery) }
      );
    }
  };

  return (
    <Toolbar>
      <Button
        variant="contained"
        color="primary"
        onClick={handleClick}
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
          <Button onClick={handleCreate} color="primary">
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </Toolbar>
  );
};
