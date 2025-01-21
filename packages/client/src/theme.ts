import { createTheme } from "@mui/material/styles";

const palette = { primary: { main: "#a9907e" }, secondary: { main: "#f3deba" } };

export const theme = createTheme({
  colorSchemes: { light: { palette }, dark: { palette } },
});
