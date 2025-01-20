import Alert from "@mui/material/Alert";
import Container from "@mui/material/Container";
import { Route, Routes } from "react-router";
import Layout from "../Layout/Layout";

function App() {
  return (
    <Container fixed>
      <Alert severity="warning">Это учебный проект. Пожалуйста, не совершайте на нём никаких действий.</Alert>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<div>Index</div>} />
          <Route path="panel" element={<div>Panel</div>} />
          <Route path="profile" element={<div>Profile</div>} />
        </Route>
      </Routes>
    </Container>
  );
}

export default App;
