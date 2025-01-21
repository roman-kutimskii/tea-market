import Avatar from "@mui/material/Avatar";
import LoginIcon from "@mui/icons-material/Login";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { useMenu } from "./hooks/useMenu";
import { Link } from "react-router";
import { useState } from "react";

const settings = [
  { name: "Profile", path: "/profile" },
  { name: "Accout", path: "/account" },
];

export const UserMenu = () => {
  const [anchorEl, handleOpenMenu, handleCloseMenu] = useMenu();
  // TODO: Добавить логику входа
  const [auth, setAuth] = useState(false);

  const handleSignIn = () => {
    setAuth(true);
  };

  const handleSignOut = () => {
    handleCloseMenu();
    setAuth(false);
  };

  return (
    <Box flexGrow={0}>
      {auth ? (
        <Tooltip title="Open settings">
          <IconButton onClick={handleOpenMenu} sx={{ p: 0 }}>
            <Avatar />
          </IconButton>
        </Tooltip>
      ) : (
        <Tooltip title="Sign In">
          <IconButton onClick={handleSignIn}>
            <LoginIcon />
          </IconButton>
        </Tooltip>
      )}
      <Menu
        anchorEl={anchorEl}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        keepMounted
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        open={Boolean(anchorEl)}
        onClose={handleCloseMenu}
        sx={{ mt: 0.625 }}
      >
        {settings.map((setting) => (
          <MenuItem key={setting.name} onClick={handleCloseMenu} component={Link} to={setting.path}>
            <Typography sx={{ textAlign: "center" }}>{setting.name}</Typography>
          </MenuItem>
        ))}
        <MenuItem onClick={handleSignOut}>
          <Typography sx={{ textAlign: "center" }}>Sign Out</Typography>
        </MenuItem>
      </Menu>
    </Box>
  );
};
