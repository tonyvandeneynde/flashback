import { Box, styled, Typography } from "@mui/material";
import Logo from "../../assets/logo.svg?react";

const StyledLogo = styled(Logo)`
  margin: 0 auto;
`;

export const MobileNotSupportedPage = () => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      height="100vh"
      textAlign="center"
      padding={2}
      gap={10}
    >
      <StyledLogo />
      <div>
        <Typography variant="h6" gutterBottom>
          This application is not supported on mobile devices yet.
        </Typography>
        <Typography variant="body1">
          Please use a desktop or larger screen to access the app.
        </Typography>
      </div>
    </Box>
  );
};
