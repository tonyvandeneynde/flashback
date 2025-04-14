import {
  Routes as RouterRoutes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { LoginPage, OrganizePage, SitePage, TimelinePage } from "../components";
import { useProfile } from "../contexts/ProfileContext";
import { CircularProgress, useMediaQuery, useTheme } from "@mui/material";
import { MobileNotSupportedPage } from "../components/Pages/MobileNotSupportedPage";

export const Routes = () => {
  const { isLoggedIn, isLoading } = useProfile();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const location = useLocation();

  const getFolderPath = () => {
    const urlPathString = location.pathname.replace(
      /^(\/site\/home\/?|\/site\/organize\/?)/,
      ""
    );
    const urlPath = urlPathString.split("/").filter((item) => item !== "");
    return urlPath;
  };

  if (isLoading) {
    return <CircularProgress />;
  }

  if (isMobile) {
    return <MobileNotSupportedPage />;
  }

  const folderPath = getFolderPath();

  return (
    <RouterRoutes>
      {!isLoggedIn ? (
        <>
          <Route path="/login" element={<LoginPage />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </>
      ) : (
        <>
          <Route path="/timeline" element={<TimelinePage />} />
          <Route path="/organize/*" element={<OrganizePage />} />
          <Route path="/site/home/*" element={<SitePage path={folderPath} />} />
          <Route path="*" element={<Navigate to="/site/home" />} />
        </>
      )}
    </RouterRoutes>
  );
};
