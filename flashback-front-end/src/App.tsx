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
import { fetchWithAuth } from "./utils";

function App() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        queryFn: async ({ queryKey }) => {
          const [url] = queryKey;
          return fetchWithAuth(url as string);
        },
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <QueryClientProvider client={queryClient}>
        <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
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
                <Route path="/organize" element={<div>organize</div>} />
                <Route path="/timeline" element={<TimelinePage />} />
                <Route path="/site" element={<div>site</div>} />
              </Routes>
            </MainLayout>
          </Router>
        </GoogleOAuthProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
