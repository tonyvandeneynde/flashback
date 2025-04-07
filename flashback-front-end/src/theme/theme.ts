import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#DBC078",
    },
    secondary: {
      main: "#e6d3a0",
    },
    divider: "#3a3a3a", // A more subtle dark grey color for the divider
    background: {
      default: "#070708",
      paper: "#1f1f23",
    },
    text: {
      primary: "#ffffff",
      secondary: "#000000",
    },
  },
  typography: {
    fontFamily: "Roboto, Arial, sans-serif",
  },
});

export default theme;
