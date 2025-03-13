import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { useImages } from "./services/useImages";
import theme from "./theme/theme";
import { MainLayout, TimelinePage } from "./components";

function App() {
  const { images } = useImages();
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <MainLayout>
          <Routes>
            <Route path="/" element={<Navigate to="/site" />} />
            <Route path="/organize" element={<div>organize</div>} />
            <Route
              path="/timeline"
              element={<TimelinePage images={images} />}
            />
            <Route path="/site" element={<div>site</div>} />
          </Routes>
        </MainLayout>
      </Router>
    </ThemeProvider>
  );
}

export default App;
