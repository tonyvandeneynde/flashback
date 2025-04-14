import {
  Button,
  DialogActions,
  DialogContent,
  DialogContentText,
  Divider,
  LinearProgress,
  styled,
  Typography,
  useTheme,
} from "@mui/material";
import { FileUploadState } from "../../hooks/useUploadImages";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

const StyledProgressItem = styled("div")`
  display: flex;
  align-items: center;
  margin-bottom: 8px;
  gap: 8px;
`;

const StyledLinearProgress = styled(LinearProgress)`
  width: 100%;
`;

const ColumnsContainer = styled("div")`
  height: 70vh;
  max-height: 500px;
  display: flex;
  gap: 16px;
`;

const Column = styled("div")`
  flex: 1;
  overflow-y: auto;
`;

const StyledStatus = styled("div")`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
`;

const StyledDialogContentText = styled(DialogContentText)`
  margin-top: 16px;
`;

const isFailedState = (fileState: FileUploadState) =>
  fileState.state === "processingError" || fileState.state === "uploadError";

export const UploadDialogContent = ({
  leftColumnFileStates,
  rightColumnFileStates,
  numberOfDoneFiles,
  numberOfFailedFiles,
  onCancel,
}: {
  leftColumnFileStates: FileUploadState[];
  rightColumnFileStates: FileUploadState[];
  numberOfDoneFiles: number;
  numberOfFailedFiles: number;
  onCancel: () => void;
}) => {
  const theme = useTheme();

  const totalNumberOfFiles =
    leftColumnFileStates.length + rightColumnFileStates.length;

  return (
    <DialogContent>
      <ColumnsContainer>
        <Column>
          {leftColumnFileStates.map((fileState) => (
            <StyledProgressItem key={fileState.file.name}>
              <DialogContentText
                color={
                  fileState.state === "queued"
                    ? "textDisabled"
                    : isFailedState(fileState)
                    ? "error"
                    : "textPrimary"
                }
                key={fileState.file.name}
              >
                {fileState.file.name}
              </DialogContentText>
              {fileState.state === "uploading" ? (
                <StyledLinearProgress
                  variant="determinate"
                  value={fileState?.UploadProgress * 100}
                />
              ) : (
                <StyledStatus color={theme.palette.text.primary}>
                  {isFailedState(fileState) && (
                    <ErrorOutlineIcon color="error" />
                  )}
                  {fileState.state === "processing" && <>Processing</>}
                  {fileState.state === "uploaded" && <>Uploaded</>}
                  {fileState.state === "cancelled" && <>Cancelled</>}
                  {fileState.state === "queued" && (
                    <Typography color="textDisabled">Queued</Typography>
                  )}
                </StyledStatus>
              )}
            </StyledProgressItem>
          ))}
        </Column>
        <Divider orientation="vertical" flexItem />
        <Column>
          {rightColumnFileStates.map((fileState) => (
            <StyledProgressItem key={fileState.file.name}>
              <DialogContentText color="textPrimary" key={fileState.file.name}>
                {fileState.file.name}
              </DialogContentText>
              <CheckCircleOutlineIcon color={"success"} />
            </StyledProgressItem>
          ))}
        </Column>
      </ColumnsContainer>
      <StyledDialogContentText color="textPrimary">
        {numberOfDoneFiles} images of {totalNumberOfFiles} uploaded,{" "}
        {numberOfFailedFiles} failed
      </StyledDialogContentText>
      <DialogActions>
        <Button onClick={onCancel}>Cancel</Button>
      </DialogActions>
    </DialogContent>
  );
};
