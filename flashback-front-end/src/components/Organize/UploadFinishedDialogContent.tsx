import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import {
  Button,
  DialogActions,
  DialogContent,
  DialogContentText,
  styled,
} from "@mui/material";

const StyledDialogContent = styled(DialogContent)`
  height: 70vh;
  max-height: 500px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const StyledDialogContentText = styled(DialogContentText)`
  display: flex;
  align-items: center;
  margin-top: 16px;
  gap: 8px;
`;

const StyledFileList = styled("div")`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 16px;
  overflow-y: auto;
  width: 100%;
  padding: 0 32px;
`;

export const UploadFinishedDialogContent = ({
  numberOfDoneFiles,
  failedFiles,
  onClose,
  onRetry,
}: {
  numberOfDoneFiles: number;
  uploadFinished: boolean;
  failedFiles: File[];
  onClose: () => void;
  onRetry: () => void;
}) => {
  const numberOfFailedFiles = failedFiles.length;

  return (
    <StyledDialogContent>
      <StyledDialogContentText variant="h5" color="textPrimary">
        {numberOfDoneFiles} images uploaded
        {numberOfFailedFiles > 0 && `, ${numberOfFailedFiles} failed`}
      </StyledDialogContentText>
      {numberOfFailedFiles > 0 && (
        <StyledFileList>
          {failedFiles.map((file) => (
            <StyledDialogContentText key={file.name} color="error">
              {file.name}
              <ErrorOutlineIcon color="error" />
            </StyledDialogContentText>
          ))}
        </StyledFileList>
      )}
      <DialogActions>
        {numberOfFailedFiles > 0 && (
          <Button onClick={onRetry}>Retry Failed uploads</Button>
        )}
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </StyledDialogContent>
  );
};
