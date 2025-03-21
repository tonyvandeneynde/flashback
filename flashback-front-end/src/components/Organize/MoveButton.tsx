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
import { useEffect, useState } from "react";
import {
  Folder,
  Gallery,
  isFolder,
  Image,
  isGallery,
} from "../../apiConstants";
import { FolderTreeExplorer } from "./FolderTreeExplorer";

const StyledDialog = styled(Dialog)`
  ul[role="tree"] {
    width: 400px;
    height: 300px;
    overflow-y: auto;
  }
`;

export const MoveButton = ({
  selectedNode,
  selectedImageIds,
  handleMoveNode,
  handleMoveImages,
}: {
  selectedNode: Folder | Gallery | null;
  selectedImageIds: number[];
  handleMoveNode: ({
    closeDialog,
    selectedNode,
    newNodeParent,
  }: {
    closeDialog: () => void;
    selectedNode: Folder | Gallery;
    newNodeParent: Folder;
  }) => void;
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
  const [newNodeParent, setNewNodeParent] = useState<Folder | null>(null);
  const [newImagesParent, setNewImagesParent] = useState<Gallery | null>(null);
  const [mode, setMode] = useState<"Node" | "Images" | null>(null);

  const handleMoveClick = () => {
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const handleNewParentNodeChanged = (node: Folder | Gallery | null) => {
    if (mode === "Images") {
      if (node && isGallery(node)) {
        setNewImagesParent(node);
        return;
      }
    }
    if (mode === "Node") {
      if (node && isFolder(node)) {
        setNewNodeParent(node);
        return;
      }
    }
    setNewNodeParent(null);
  };

  useEffect(() => {
    if (selectedNode && selectedImageIds.length === 0) {
      setMode("Node");
    } else if (selectedImageIds.length > 0 && !selectedNode) {
      setMode("Images");
    } else {
      setMode(null);
    }
  }, [selectedNode, selectedImageIds]);

  const handleMove = () => {
    if (mode === "Node" && selectedNode && newNodeParent) {
      handleMoveNode?.({
        closeDialog: handleDialogClose,
        selectedNode,
        newNodeParent: newNodeParent,
      });
    } else if (
      mode === "Images" &&
      selectedImageIds.length > 0 &&
      newImagesParent
    ) {
      handleMoveImages?.({
        closeDialog: handleDialogClose,
        selectedImageIds,
        newImagesParent: newImagesParent,
      });
    }
  };

  const dialogDescription =
    mode === "Node" ? "Select a new folder" : "Select a new gallery";

  return (
    <>
      <Button
        variant="contained"
        color="primary"
        onClick={handleMoveClick}
        disabled={!mode}
      >
        Move
      </Button>
      <StyledDialog open={dialogOpen} onClose={handleDialogClose}>
        <DialogTitle textAlign={"center"} color={theme.palette.secondary.main}>
          Move {mode === "Node" ? "node" : "images"}
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1">{dialogDescription}</Typography>
        </DialogContent>
        <FolderTreeExplorer
          disableFolders={mode === "Images"}
          disableGalleries={mode === "Node"}
          onCurrentNodeChanged={handleNewParentNodeChanged}
        />
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            Cancel
          </Button>
          <Button
            onClick={handleMove}
            color="primary"
            disabled={!newNodeParent && !newImagesParent}
          >
            Move
          </Button>
        </DialogActions>
      </StyledDialog>
    </>
  );
};
