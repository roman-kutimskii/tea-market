import Alert from "@mui/material/Alert";
import Container from "@mui/material/Container";
import { Route, Routes } from "react-router";
import Layout from "../Layout/Layout";
import { useFavicon } from "../../hooks/useFavicon";
import SignInPage from "../Layout/Pages/AuthenticationPages/SignInPage";
import AdminPanel from "../Layout/Pages/AdminPanel/AdminPanel";
import { AppContext } from "./AppContext";
import SignUpPage from "../Layout/Pages/AuthenticationPages/SignUpPage";
import Catalog from "../Layout/Pages/Catalog/Catalog";
import Basket from "../Layout/Pages/Basket/Basket";
import Profile from "../Layout/Pages/Profile/Profile";

function App() {
  useFavicon();

  return (
    <AppContext>
      <Container fixed>
        <Alert severity="warning">Это учебный проект. Пожалуйста, не совершайте на нём никаких действий.</Alert>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<Catalog />} />
            <Route path="catalog" element={<Catalog />} />
            <Route path="admin" element={<AdminPanel />} />
            <Route path="profile" element={<Profile />} />
            <Route path="basket" element={<Basket />} />
            <Route path="signIn" element={<SignInPage />} />
            <Route path="signUp" element={<SignUpPage />} />
          </Route>
        </Routes>
      </Container>
    </AppContext>
  );
}

export default App;
