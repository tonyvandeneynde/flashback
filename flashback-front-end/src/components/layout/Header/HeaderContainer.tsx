import { AppBar, Toolbar, styled, useMediaQuery } from "@mui/material";
import { useLocation } from "react-router-dom";
import { useProfile } from "../../../contexts/ProfileContext";
import Logo from "../../../assets/logo.svg?react";
import { useState } from "react";
import { useTheme } from "@mui/material/styles";
import { MobileHeader } from "./MobileHeader";
import { Header } from "./Header";

const StyledLogo = styled(Logo)`
  margin: 16px auto 16px 0;
`;

const StyledAppBar = styled(AppBar)`
  background-color: ${({ theme }) => theme.palette.background.default};
`;

export const HeaderContainer = () => {
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const { isLoggedIn, image, logout } = useProfile();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <StyledAppBar position="static">
      <Toolbar>
        <StyledLogo />
        {isMobile ? (
          <MobileHeader
            anchorEl={anchorEl}
            handleMenuOpen={handleMenuOpen}
            handleMenuClose={handleMenuClose}
            isLoggedIn={isLoggedIn}
            logout={logout}
          />
        ) : (
          <Header
            isLoggedIn={isLoggedIn}
            image={image}
            logout={logout}
            location={location}
          />
        )}
      </Toolbar>
    </StyledAppBar>
  );
};
