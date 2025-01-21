import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { NavMenu } from "./NavMenu";
import { useMediaQuery, useTheme } from "@mui/material";
import { LogoIcon } from "./LogoIcon";
import { Link } from "react-router";
import { UserMenu } from "./UserMenu";

const pages = [
  { name: "Catalog", path: "/catalog" },
  { name: "Admin Panel", path: "/admin" },
];

export const AppBar = () => {
  const theme = useTheme();
  const mobile = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <MuiAppBar position="static">
      <Toolbar>
        <NavMenu pages={pages} />
        <LogoIcon sx={{ mr: 1 }} />
        <Typography
          variant={mobile ? "h5" : "h6"}
          noWrap
          component={Link}
          to="/"
          sx={{
            mr: 2,
            flexGrow: mobile ? 1 : 0,
            fontFamily: "monospace",
            fontWeight: 700,
            color: "inherit",
            textDecoration: "none",
          }}
        >
          Tea Market
        </Typography>
        <Box flexGrow={1} sx={{ display: { xs: "none", md: "flex" } }}>
          {pages.map((page) => (
            <Button key={page.name} color="inherit" component={Link} to={page.path}>
              {page.name}
            </Button>
          ))}
        </Box>
        <UserMenu />
      </Toolbar>
    </MuiAppBar>
  );
};
