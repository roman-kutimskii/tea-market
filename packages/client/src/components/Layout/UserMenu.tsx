import Avatar from "@mui/material/Avatar";
import LoginIcon from "@mui/icons-material/Login";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { useMenu } from "./hooks/useMenu";
import { Link, useNavigate } from "react-router";
import { useContext, useEffect, useState } from "react";
import { api } from "../../utils/Api";
import { AuthContext } from "../App/AppContext";
import { User } from "../../utils/Types";

export const UserMenu = () => {
  const [anchorEl, handleOpenMenu, handleCloseMenu] = useMenu();
  const navigate = useNavigate();
  const [avatar, setAvatar] = useState("");
  const authorization = useContext(AuthContext);

  useEffect(() => {
    if (avatar.length === 0 && localStorage.getItem("userId")) {
      const fetchUserData = async () => {
        try {
          const userData = await api.fetchWithAuth<User>(
            authorization.setAuth,
            navigate,
            `users/${localStorage.getItem("userId") ?? ""}`,
            "GET",
          );
          setAvatar(userData.avatarUrl);
        } catch (error) {
          console.error("Ошибка при загрузке данных пользователя:", error);
        }
      };

      void fetchUserData();
    }
  }, [authorization.avatarPath]);

  const handleSignOut = () => {
    handleCloseMenu();
    api.logout();
    authorization.setAuth(false);
    void navigate("/catalog");
  };

  return (
    <Box flexGrow={0}>
      {authorization.auth ? (
        <Tooltip title="Открыть настройки">
          <IconButton onClick={handleOpenMenu} sx={{ p: 0 }}>
            <Avatar src={avatar} alt="Avatar" />
          </IconButton>
        </Tooltip>
      ) : (
        <Tooltip title="Войти">
          <IconButton color="inherit" component={Link} to="/signIn">
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
        <MenuItem onClick={handleCloseMenu} component={Link} to="/profile">
          <Typography sx={{ textAlign: "center" }}>Профиль</Typography>
        </MenuItem>
        <MenuItem onClick={handleSignOut}>
          <Typography sx={{ textAlign: "center" }}>Выйти</Typography>
        </MenuItem>
      </Menu>
    </Box>
  );
};
