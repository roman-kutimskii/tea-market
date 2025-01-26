import { useState, useContext } from "react";
import {
  Button,
  TextField,
  TableCell,
  TableRow,
  MenuItem,
  Select,
  Typography,
  SelectChangeEvent,
  Avatar,
} from "@mui/material";
import { useNavigate } from "react-router";
import { CreateUser, Role, User } from "../../../../../../utils/Types";
import { AuthContext } from "../../../../../App/AppContext";
import { api } from "../../../../../../utils/Api";

type EntityRowProps = {
  setEntities: React.Dispatch<React.SetStateAction<User[]>>;
  user: Partial<User>;
};

const UserEntityRow = ({ user, setEntities }: EntityRowProps) => {
  const [newUser, setNewUser] = useState<Partial<User>>(user);
  const [password, setPassword] = useState("");
  const [avatarBase64, setAvatarBase64] = useState(user.avatarUrl);

  const navigate = useNavigate();
  const authorization = useContext(AuthContext);

  const handleUpdateEntity = () => {
    const fetchData = async () => {
      try {
        if (!newUser.id || newUser.email == undefined || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newUser.email)) {
          return;
        }

        const body: Partial<CreateUser> = {
          email: newUser.email,
          role: newUser.role,
          password: password.length > 0 ? password : undefined,
        };
        const responce = await api.fetchWithAuth<User>(
          authorization.setAuth,
          navigate,
          `users/${String(newUser.id)}`,
          "PATCH",
          body,
        );
        setNewUser(responce);
        setEntities((prevEntities) => prevEntities.map((entity) => (entity.id !== responce.id ? entity : responce)));
      } catch (error) {
        console.error("Ошибка при обновлении почты:", error);
      }
    };

    const SaveAva = async () => {
      try {
        if (avatarBase64 === user.avatarUrl) {
          return;
        }
        const body: { avatarBase64: string } = {
          avatarBase64: avatarBase64 ?? "",
        };
        const responce = await api.fetchWithAuth<User>(
          authorization.setAuth,
          navigate,
          `users/${String(newUser.id)}/avatar`,
          "PATCH",
          body,
        );
        setEntities((prevEntities) => prevEntities.map((entity) => (entity.id !== responce.id ? entity : responce)));
      } catch (error) {
        console.error("Ошибка при обновлении почты:", error);
      }
    };

    void fetchData();
    void SaveAva();
  };

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarBase64(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDeleteEntity = () => {
    const fetchData = async () => {
      try {
        await api.fetchWithAuth(authorization.setAuth, navigate, `users/${String(newUser.id)}`, "DELETE");
        setEntities((prevEntities) => prevEntities.filter((item) => item.id !== newUser.id));
      } catch (error) {
        console.error("Ошибка удаления записи:", error);
      }
    };

    void fetchData();
  };

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewUser((prevUser) => ({ ...prevUser, email: event.target.value }));
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const handleRoleChange = (event: SelectChangeEvent) => {
    setNewUser((prevUser) => ({ ...prevUser, role: event.target.value as Role }));
  };

  return (
    <TableRow>
      <TableCell>
        <Typography variant="h6">{newUser.id}</Typography>
      </TableCell>
      <TableCell>
        <TextField value={newUser.email} onChange={handleEmailChange} variant="outlined" />
      </TableCell>
      <TableCell>
        <Select
          value={newUser.role}
          onChange={handleRoleChange}
          displayEmpty
          MenuProps={{
            disableScrollLock: true,
          }}
        >
          <MenuItem value="customer">Пользователь</MenuItem>
          <MenuItem value="seller">Продавец</MenuItem>
          <MenuItem value="admin">Администратор</MenuItem>
        </Select>
      </TableCell>
      <TableCell>
        <Button variant="outlined" component="label">
          <Avatar src={avatarBase64} alt="Avatar" sx={{ width: 100, height: 100 }} />
          <input type="file" accept="image/*" hidden onChange={handleAvatarChange} />
        </Button>
      </TableCell>
      <TableCell>
        <TextField value={password} onChange={handlePasswordChange} variant="outlined" />
      </TableCell>
      <TableCell>
        <Button variant="contained" color="secondary" onClick={handleUpdateEntity}>
          Обновить
        </Button>
        <Button variant="contained" color="primary" onClick={handleDeleteEntity}>
          Удалить
        </Button>
      </TableCell>
    </TableRow>
  );
};

export default UserEntityRow;
