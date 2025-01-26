import React, { useState, useEffect, useContext } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  MenuItem,
  Select,
  SelectChangeEvent,
  Avatar,
} from "@mui/material";
import { api } from "../../../../../../utils/Api";
import { useNavigate } from "react-router";
import { CreateUser, Role, User } from "../../../../../../utils/Types";
import { AuthContext } from "../../../../../App/AppContext";
import UserEntityRow from "./UserEntityRow";

const UserEntityBlock = () => {
  const [entities, setEntities] = useState<User[]>([]);
  const [searchResult, setSearchResult] = useState<User>();
  const [searchId, setSearchId] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<Role>("customer");
  const [avatarBase64, setAvatarBase64] = useState("");

  const navigate = useNavigate();
  const authorization = useContext(AuthContext);

  useEffect(() => {
    const fetchEntities = async () => {
      try {
        const response = await api.fetchWithAuth<User[]>(authorization.setAuth, navigate, `users`, "GET");
        setEntities(response);
      } catch (error) {
        console.error("Ошибка загрузки данных:", error);
      }
    };
    void fetchEntities();
  }, []);

  const handleCreateEntity = () => {
    const fetchEntities = async () => {
      try {
        const body: CreateUser = {
          email: email,
          role: role,
          password: password,
        };
        const response = await api.fetchWithAuth<User>(authorization.setAuth, navigate, `users`, "POST", body);
        setEntities([...entities, response]);
        const responce = await api.fetchWithAuth<User>(
          authorization.setAuth,
          navigate,
          `users/${String(response.id)}/avatar`,
          "PATCH",
          {
            avatarBase64: avatarBase64,
          },
        );
        setEntities((prevEntities) => prevEntities.map((entity) => (entity.id !== responce.id ? entity : responce)));
      } catch (error) {
        console.error("Ошибка создания записи:", error);
      }
    };

    void fetchEntities();
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

  const handleSearch = () => {
    setSearchResult(undefined);
    const fetchEntities = async () => {
      try {
        const response = await api.fetchWithAuth<User>(authorization.setAuth, navigate, `users/${searchId}`, "GET");
        setSearchResult(response);
      } catch (error) {
        console.error("Ошибка поиска записи:", error);
      }
    };
    void fetchEntities();
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.value.length === 0) {
      return;
    }
    setSearchId(Number(event.target.value) > 0 ? event.target.value : "");
  };

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const handleRoleChange = (event: SelectChangeEvent) => {
    setRole(event.target.value as Role);
  };

  return (
    <Box sx={{ padding: 2 }}>
      <Box sx={{ marginBottom: 2 }}>
        <TextField
          label="Поиск по ID"
          value={searchId}
          type="number"
          onChange={handleSearchChange}
          variant="outlined"
          sx={{ marginRight: 1 }}
        />
        <Button variant="contained" onClick={handleSearch}>
          Поиск
        </Button>
        {searchResult && (
          <Box sx={{ marginTop: 2 }}>
            <TableContainer component={Paper}>
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell colSpan={5}>
                      <Typography variant="h6">Результат поиска:</Typography>
                    </TableCell>
                  </TableRow>
                  <UserEntityRow user={searchResult} setEntities={setEntities} />
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )}
      </Box>
      <Box sx={{ overflowX: "auto", marginBottom: 2 }}>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Id</TableCell>
                <TableCell>Почта</TableCell>
                <TableCell>Роль</TableCell>
                <TableCell>Аватар</TableCell>
                <TableCell>Новый пароль</TableCell>
                <TableCell>Действия</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>
                  <Typography variant="h6">-</Typography>
                </TableCell>
                <TableCell>
                  <TextField value={email} onChange={handleEmailChange} variant="outlined" />
                </TableCell>
                <TableCell>
                  <Select
                    value={role}
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
                  <Button variant="contained" onClick={handleCreateEntity}>
                    Создать
                  </Button>
                </TableCell>
              </TableRow>
              {entities.map((entity) => (
                <UserEntityRow key={entity.id} user={entity} setEntities={setEntities} />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
};

export default UserEntityBlock;
