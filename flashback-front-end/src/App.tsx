import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import theme from "./theme/theme";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { QueryClientProvider } from "@tanstack/react-query";
import { ImageViewerProvider } from "./contexts/ImageViewerContext";
import { ProfileProvider } from "./contexts/ProfileContext";
import { Routes } from "./routes";
import { BrowserRouter as Router } from "react-router-dom";
import { queryClient } from "./services/reactQuerySetup";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <QueryClientProvider client={queryClient}>
        <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
          <ProfileProvider>
            <ImageViewerProvider>
              <Router>
                <Routes />
              </Router>
            </ImageViewerProvider>
          </ProfileProvider>
        </GoogleOAuthProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
