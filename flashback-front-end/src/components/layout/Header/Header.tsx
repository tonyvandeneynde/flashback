import { AppBar, Toolbar, Typography, Button, useTheme } from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import { useProfile } from "../../../contexts/ProfileContext";
import { ProfileMenu } from "./ProfileMenu";

export const Header = () => {
  const theme = useTheme();

  const location = useLocation();

  const { isLoggedIn, image, logout } = useProfile();

  const getButtonColor = (path: string) => {
    return location.pathname === path ? "secondary" : "inherit";
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography
          color={theme.palette.primary.main}
          variant="h6"
          sx={{ flexGrow: 1 }}
          fontWeight={700}
          letterSpacing={2}
        >
          FLASHBACK
        </Typography>
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
