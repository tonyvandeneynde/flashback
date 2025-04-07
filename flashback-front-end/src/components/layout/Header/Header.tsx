import { AppBar, Toolbar, Button, styled } from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import { useProfile } from "../../../contexts/ProfileContext";
import { ProfileMenu } from "./ProfileMenu";
import Logo from "../../../assets/logo.svg?react";

const StyledLogo = styled(Logo)`
  margin: 16px auto 16px 0;
`;

export const Header = () => {
  const location = useLocation();

  const { isLoggedIn, image, logout } = useProfile();

  const getButtonColor = (path: string) => {
    return location.pathname === path ? "secondary" : "inherit";
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <StyledLogo />
        <Button
          component={Link}
          to="/organize"
          color={getButtonColor("/organize")}
        >
          Organize
        </Button>
        <Button
          component={Link}
          to="/timeline"
          color={getButtonColor("/timeline")}
        >
          Timeline
        </Button>
        <Button component={Link} to="/site" color={getButtonColor("/site")}>
          Site
        </Button>
        {isLoggedIn ? (
          <ProfileMenu image={image} logout={logout} />
        ) : (
          <Button component={Link} to="/login" color={getButtonColor("/login")}>
            Log In
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
};
