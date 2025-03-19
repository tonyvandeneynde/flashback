import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import theme from "./theme/theme";
import { LoginButton, SitePage } from "./components";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ImageViewerProvider } from "./contexts/ImageViewerContext";
import { OrganizePage } from "./components/Pages/OrganizePage.tsx/OrganizePage";
import { TimelinePage } from "./components/Pages/TimelinePage/TimeLinePage";

function App() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { staleTime: 20 * 1000 } },
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <QueryClientProvider client={queryClient}>
        <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
          <ImageViewerProvider>
            <Router>
              <Routes>
                <Route
                  path="/login"
                  element={
                    <div>
                      <LoginButton />
                    </div>
                  }
                />
                <Route path="/" element={<Navigate to="/timeline" />} />
                <Route path="/organize" element={<OrganizePage />} />
                <Route path="/timeline" element={<TimelinePage />} />
                <Route path="/site" element={<SitePage />} />
              </Routes>
            </Router>
          </ImageViewerProvider>
        </GoogleOAuthProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
