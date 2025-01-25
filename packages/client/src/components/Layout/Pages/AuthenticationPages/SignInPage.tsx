/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/no-confusing-void-expression */
import { Container, Box, Typography, TextField, Button, Alert } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { api } from "../../../../utils/Api.ts";
import { AuthContext } from "../../../App/AppContext.tsx";
import { Link as RouterLink, useNavigate } from "react-router";
import { User } from "../../../../utils/Types.ts";

const SignInPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorText, setErrorText] = useState("");
  const navigate = useNavigate();

  const authorization = useContext(AuthContext);

  useEffect(() => {
    if (authorization.auth) {
      void navigate("/catalog");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      await api.login(authorization.setAuth, navigate, email, password);
      try {
        const userData = await api.fetchWithAuth<User>(
          authorization.setAuth,
          navigate,
          `users/${localStorage.getItem("userId") ?? ""}`,
          "GET",
        );
        authorization.setAvatarPath(userData.avatarUrl);
      } catch (error) {
        console.error("Ошибка при загрузке данных пользователя:", error);
      }

      await navigate("/catalog");
    } catch (error) {
      console.error(error);
      const errorMessage = (error as { message: string }).message;
      if (errorMessage === `Could not find any entity of type "User" matching: {\n    "email": "${email}"\n}`) {
        setErrorText("Аккаунт с таким email не найден");
      }
    }
  };

  return (
    <Container maxWidth="xs">
      <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" minHeight="85vh">
        <Typography variant="h4" component="h1" gutterBottom>
          Вход
        </Typography>
        <form onSubmit={handleSubmit} style={{ width: "100%" }}>
          <TextField
            label="Email"
            variant="outlined"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <TextField
            label="Password"
            type="password"
            variant="outlined"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {errorText.length > 0 ? <Alert severity="error">{errorText}</Alert> : <></>}
          <Button type="submit" variant="contained" color="primary" fullWidth style={{ marginTop: "16px" }}>
            Войти
          </Button>
        </form>
        <Box mt={2}>
          <Typography variant="body2">
            Нет аккаунта?{" "}
            <Typography component={RouterLink} to="/signUp" style={{ color: "primary" }} color="primary">
              Зарегистрироваться
            </Typography>
          </Typography>
        </Box>
      </Box>
    </Container>
  );
};

export default SignInPage;
