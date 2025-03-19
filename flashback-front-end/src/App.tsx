import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import theme from "./theme/theme";
import { LoginButton, MainLayout, TimelinePage } from "./components";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { OrganizeContainer } from "./components/Organize/OrganizeContainer";
import { ImageViewerProvider } from "./contexts/ImageViewerContext";
import { SitePage } from "./components/Site/SitePage";

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
              <MainLayout>
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
                  <Route path="/organize" element={<OrganizeContainer />} />
                  <Route path="/timeline" element={<TimelinePage />} />
                  <Route path="/site" element={<SitePage />} />
                </Routes>
              </MainLayout>
            </Router>
          </ImageViewerProvider>
        </GoogleOAuthProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
