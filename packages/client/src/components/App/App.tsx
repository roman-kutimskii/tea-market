import Alert from "@mui/material/Alert";
import Container from "@mui/material/Container";
import { Route, Routes } from "react-router";
import Layout from "../Layout/Layout";
import { useFavicon } from "../../hooks/useFavicon";

function App() {
  useFavicon();

  return (
    <Container fixed>
      <Alert severity="warning">Это учебный проект. Пожалуйста, не совершайте на нём никаких действий.</Alert>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<div>Index</div>} />
          <Route path="catalog" element={<div>Catalog</div>} />
          <Route path="admin" element={<div>Admin</div>} />
          <Route path="profile" element={<div>Profile</div>} />
          <Route path="account" element={<div>Account</div>} />
        </Route>
      </Routes>
    </Container>
  );
}

export default App;
