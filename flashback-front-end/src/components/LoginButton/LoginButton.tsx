import { Button } from "@mui/material";
import { useGoogleAuth } from "../../hooks";
import { useNavigate } from "react-router-dom";

export const LoginButton = () => {
  const navigate = useNavigate();
  const onSuccess = () => {
    navigate("/");
  };

  const { login } = useGoogleAuth({ successCallback: onSuccess });

  const handleLogin = () => {
    login();
  };

  return <Button onClick={handleLogin}>Log in with Google</Button>;
};
