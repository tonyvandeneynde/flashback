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
import { Folder, Gallery, isFolder } from "../../apiConstants";
import { FolderTreeExplorer } from "./FolderTreeExplorer";

const StyledDialog = styled(Dialog)`
  ul[role="tree"] {
    width: 400px;
    height: 300px;
    overflow-y: auto;
  }
`;

export const MoveNodeButton = ({
  selectedNode,
  handleMoveNode,
}: {
  selectedNode: Folder | Gallery | null;
  handleMoveNode: ({
    closeDialog,
    selectedNode,
    newParentFolder,
  }: {
    closeDialog: () => void;
    selectedNode: Folder | Gallery;
    newParentFolder: Folder;
  }) => void;
}) => {
  const theme = useTheme();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newParentFolder, setNewParentFolder] = useState<Folder | null>(null);

  const handleMoveClick = () => {
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const handleNewParentFolderChanged = (newParent: Folder | null) => {
    setNewParentFolder(newParent);
  };

  const handleMove = () => {
    if (selectedNode && newParentFolder) {
      handleMoveNode?.({
        closeDialog: handleDialogClose,
        selectedNode,
        newParentFolder: newParentFolder,
      });
    }
  };

  return (
    <>
      <Button
        variant="contained"
        color="primary"
        onClick={handleMoveClick}
        disabled={!selectedNode}
      >
        Move {selectedNode && isFolder(selectedNode) ? "folder" : "gallery"}
      </Button>
      <StyledDialog open={dialogOpen} onClose={handleDialogClose}>
        <DialogTitle textAlign={"center"} color={theme.palette.secondary.main}>
          Move {selectedNode && isFolder(selectedNode) ? "folder" : "gallery"}
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1">Select a new parent folder</Typography>
        </DialogContent>
        <FolderTreeExplorer
          disableGalleries={true}
          onCurrentNodeChanged={handleNewParentFolderChanged}
        />
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            Cancel
          </Button>
          <Button
            onClick={handleMove}
            color="primary"
            disabled={!newParentFolder && !newParentFolder}
          >
            Move
          </Button>
        </DialogActions>
      </StyledDialog>
    </>
  );
};
