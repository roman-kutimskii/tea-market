import { Outlet } from "react-router";
import Stack from "@mui/material/Stack";
import { AppBar } from "./AppBar";

const Layout = () => {
  return (
    <Stack>
      <AppBar />
      <Outlet />
    </Stack>
  );
};

export default Layout;
