import React from "react";
import { Tabs, Tab, Box } from "@mui/material";
import { Outlet, Link, useLocation } from "react-router";

const Layout: React.FC = () => {
  const location = useLocation();
  const currentTab = location.pathname;


  return (
    <Box>
      <Tabs value={currentTab}>
        <Tab label="Home" value="/" component={Link} to="/" />
        <Tab label="Panel" value="/panel" component={Link} to="/panel" />
        <Tab label="Profile" value="/profile" component={Link} to="/profile" />
      </Tabs>
      <Box mt={2}>
        <Outlet />
      </Box>
    </Box>
  );
};

export default Layout;
