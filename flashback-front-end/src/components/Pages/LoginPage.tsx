import { Button, styled } from "@mui/material";
import { useProfile } from "../../contexts/ProfileContext";

const StyledLayout = styled("div")`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

export const LoginPage = () => {
  const { loginWithGoogle } = useProfile();

  const handleLogin = () => {
    loginWithGoogle();
  };

  return (
    <StyledLayout>
      <Button onClick={handleLogin}>Log in with Google</Button>
    </StyledLayout>
  );
};
