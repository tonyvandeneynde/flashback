import {
  BrowserRouter as Router,
  Routes as RouterRoutes,
  Route,
  Navigate,
} from "react-router-dom";
import { LoginPage, OrganizePage, SitePage, TimelinePage } from "../components";
import { useProfile } from "../contexts/ProfileContext";
import { CircularProgress } from "@mui/material";

export const Routes = () => {
  const { isLoggedIn, isLoading } = useProfile();

  if (isLoading) {
    return <CircularProgress />;
  }

  return (
    <Router>
      <RouterRoutes>
        {!isLoggedIn ? (
          <>
            <Route path="/login" element={<LoginPage />} />
            <Route path="*" element={<Navigate to="/login" />} />
          </>
        ) : (
          <>
            <Route path="/login" element={<Navigate to="/timeline" />} />
            <Route path="/" element={<Navigate to="/timeline" />} />
            <Route path="/organize" element={<OrganizePage />} />
            <Route path="/timeline" element={<TimelinePage />} />
            <Route path="/site" element={<SitePage />} />
            <Route path="*" element={<Navigate to="/timeline" />} />
          </>
        )}
      </RouterRoutes>
    </Router>
  );
};
