import { IconButton, Menu, MenuItem } from "@mui/material";
import { Link } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";

export const MobileHeader = ({
  handleMenuClose,
  handleMenuOpen,
  anchorEl,
  isLoggedIn,
  logout,
}: {
  handleMenuOpen: (event: React.MouseEvent<HTMLElement>) => void;
  handleMenuClose: () => void;
  anchorEl: null | HTMLElement;
  isLoggedIn: boolean;
  logout: () => void;
}) => {
  return (
    <>
      <IconButton
        edge="start"
        color="inherit"
        aria-label="menu"
        onClick={handleMenuOpen}
      >
        <MenuIcon />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem component={Link} to="/organize" onClick={handleMenuClose}>
          Organize
        </MenuItem>
        {/* //TODO: Uncomment when timeline is implemented */}
        {/* <MenuItem
              component={Link}
              to="/timeline"
              onClick={handleMenuClose}
            >
              Timeline
            </MenuItem> */}
        <MenuItem component={Link} to="/site" onClick={handleMenuClose}>
          Site
        </MenuItem>
        {isLoggedIn ? (
          <MenuItem onClick={logout}>Log Out</MenuItem>
        ) : (
          <MenuItem component={Link} to="/login" onClick={handleMenuClose}>
            Log In
          </MenuItem>
        )}
      </Menu>
    </>
  );
};
