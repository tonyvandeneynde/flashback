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
import { useState, useCallback } from "react";
import { Folder } from "../../apiConstants";
import { NodeType } from "../../services";

type CreateButtonProps = {
  currentFolder: Folder | null;
  handleCreate?: (
    typeToCreate: "folder" | "gallery",
    name: string,
    closeDialog: () => void
  ) => void;
};

export const CreateButton = ({
  currentFolder,
  handleCreate,
}: CreateButtonProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState<NodeType>("folder");
  const [name, setName] = useState("");
  const open = Boolean(anchorEl);

  const handleCreateClick = useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      setAnchorEl(event.currentTarget);
    },
    []
  );

  const handleClose = useCallback(() => {
    setAnchorEl(null);
  }, []);

  const handleMenuItemClick = useCallback(
    (type: NodeType) => {
      if (currentFolder === null) return;
      setDialogType(type);
      setDialogOpen(true);
      handleClose();
    },
    [currentFolder, handleClose]
  );

  const handleDialogClose = useCallback(() => {
    setDialogOpen(false);
    setName("");
  }, []);

  return (
    <>
      <Button
        variant="contained"
        color="primary"
        onClick={handleCreateClick}
        disabled={currentFolder === null}
        aria-haspopup="true"
        aria-controls="create-menu"
      >
        + Create
      </Button>
      <Menu
        id="create-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        <MenuItem onClick={() => handleMenuItemClick("folder")}>
          <ListItemIcon>
            <FolderIcon />
          </ListItemIcon>
          <ListItemText primary="Folder" />
        </MenuItem>
        <MenuItem onClick={() => handleMenuItemClick("gallery")}>
          <ListItemIcon>
            <PhotoLibraryIcon />
          </ListItemIcon>
          <ListItemText primary="Gallery" />
        </MenuItem>
      </Menu>
      {dialogType && (
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
              onClick={() =>
                handleCreate?.(dialogType, name, handleDialogClose)
              }
              color="primary"
            >
              Create
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </>
  );
};
