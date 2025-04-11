import { Button, styled } from "@mui/material";
import { useProfile } from "../../contexts/ProfileContext";
import Logo from "../../assets/logo.svg?react";

const StyledLayout = styled("div")`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  gap: 32px;
`;

const StyledLogo = styled(Logo)`
  margin: 0 auto;
`;

export const LoginPage = () => {
  const { loginWithGoogle } = useProfile();

  const handleLogin = () => {
    loginWithGoogle();
  };

  return (
    <StyledLayout>
      <StyledLogo />
      <Button variant="outlined" onClick={handleLogin}>
        Log in with Google
      </Button>
    </StyledLayout>
  );
};
