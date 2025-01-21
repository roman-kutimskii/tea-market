/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/no-confusing-void-expression */
import { Container, Box, Typography, TextField, Button, Link } from "@mui/material";
import { useState } from "react";
import { api } from "../../../utils/Api.ts";

const PersonalAccount = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (event: Event) => {
    event.preventDefault();
    // Здесь вы можете обработать отправку формы
    await api.login("user@example.com", "string");
    // await api.login(email, password);
  };

  return (
    <Container maxWidth="xs">
      <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" minHeight="100vh">
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
          <Button type="submit" variant="contained" color="primary" fullWidth style={{ marginTop: "16px" }}>
            Войти
          </Button>
        </form>
        <Box mt={2}>
          <Typography variant="body2">
            Нет аккаунта?{" "}
            <Link href="/tea-market" color="primary">
              Зарегистрироваться
            </Link>
          </Typography>
        </Box>
      </Box>
    </Container>
  );
};

export default PersonalAccount;
