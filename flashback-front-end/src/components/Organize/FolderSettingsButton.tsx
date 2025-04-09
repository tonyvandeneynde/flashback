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
import { Folder } from "../../apiConstants";
import { useEffect, useState } from "react";

const SettingsItem = styled("div")`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px;
`;

const StyledTypography = styled(Typography)`
  margin-right: 8px;
`;

export const FolderSettingsButton = ({
  selectedFolder,
  onFolderSettingsChange,
}: {
  selectedFolder: Folder;
  onFolderSettingsChange: ({
    name,
    showMapInFolder,
    closeDialog,
  }: {
    name: string | null;
    showMapInFolder: boolean | null;
    closeDialog: () => void;
  }) => void;
}) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(selectedFolder.name);
  const [showMapInFolder, setShowMapInFolder] = useState(
    selectedFolder.showMapInFolder
  );

  useEffect(() => {
    setName(selectedFolder.name);
    setShowMapInFolder(selectedFolder.showMapInFolder);
  }, [selectedFolder]);

  const theme = useTheme();

  const nameChanged = name !== selectedFolder.name;
  const showMapInFolderChanged =
    showMapInFolder !== selectedFolder.showMapInFolder;

  const settingsChanged = nameChanged || showMapInFolderChanged;

  const handleCancel = () => {
    setDialogOpen(false);
    setIsEditing(false);
    setName(selectedFolder.name);
  };

  const handleSave = () => {
    onFolderSettingsChange({
      name: nameChanged ? name : null,
      showMapInFolder: showMapInFolderChanged ? showMapInFolder : null,
      closeDialog: () => setDialogOpen(false),
    });
  };

  const handleToggleShowMapInFolder = () => {
    setShowMapInFolder((prev) => !prev);
  };

  return (
    <>
      <Button
        variant="contained"
        color="primary"
        onClick={() => setDialogOpen(true)}
      >
        Folder Settings
      </Button>
      <Dialog open={dialogOpen} fullWidth>
        <DialogTitle textAlign={"center"} color={theme.palette.secondary.main}>
          Folder Settings
        </DialogTitle>
        <DialogContent>
          <SettingsItem>
            <Typography variant="body1">Folder Name</Typography>
            {isEditing ? (
              <Input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Gallery Name"
              />
            ) : (
              <StyledTypography variant="body2">
                {selectedFolder.name}
              </StyledTypography>
            )}
          </SettingsItem>
          <SettingsItem>
            <Typography variant="body1">Show map in folder</Typography>
            <Typography variant="body2">
              <Switch
                disabled={!isEditing}
                checked={showMapInFolder}
                onChange={handleToggleShowMapInFolder}
              />
            </Typography>
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
      </Dialog>
    </>
  );
};
