/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/no-confusing-void-expression */
import { Container, Box, Typography, TextField, Button, Alert } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { api } from "../../../../utils/Api.ts";
import { AuthContext } from "../../../App/AppContext.tsx";
import { Link as RouterLink, useNavigate } from "react-router";

const SignUpPage = () => {
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
      setErrorText("");
      await api.registerUser(navigate, { email, password });
      authorization.setAuth(!!localStorage.getItem("jwtToken"));
      await navigate("/catalog");
    } catch (error) {
      const errorMessage = (error as { message: string }).message;
      if (errorMessage === "Email already exists") {
        setErrorText("Аккаунт с таким email уже существует");
      }
    }
  };

  return (
    <Container maxWidth="xs">
      <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" minHeight="85vh">
        <Typography variant="h4" component="h1" gutterBottom>
          Регистрация
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
            Зарегистрироваться
          </Button>
        </form>
        <Box mt={2}>
          <Typography variant="body2">
            Есть аккаунт?{" "}
            <Typography component={RouterLink} to="/signIn" style={{ color: "primary" }} color="primary">
              Войти
            </Typography>
          </Typography>
        </Box>
      </Box>
    </Container>
  );
};

export default SignUpPage;
