import { AppBar, Box, Tab, Tabs, Toolbar, Typography } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../App/AppContext";
import { useNavigate } from "react-router";
import UserEntityBlock from "./EntityBlock/User/UserEntityBlock";
import ItemEntityBlock from "./EntityBlock/Item/ItemEntityBlock";
import SaleEntityBlock from "./EntityBlock/Sale/SaleEntityBlock";

const AdminPanel = () => {
  const authorization = useContext(AuthContext);
  const [role, setRole] = useState<string>(String(localStorage.getItem("userRole")));
  const navigate = useNavigate();

  useEffect(() => {
    setRole(String(localStorage.getItem("userRole")));
  }, [authorization.auth]);

  useEffect(() => {
    if (role !== "admin" || !authorization.auth) {
      void navigate("/catalog");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authorization.auth]);

  const [selectedTab, setSelectedTab] = useState(0);

  const handleTabChange = (_event: unknown, newValue: number) => {
    setSelectedTab(newValue);
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ marginTop: 2 }}>
        Страница администратора
      </Typography>
      <AppBar position="sticky" color="default">
        <Toolbar>
          <Tabs value={selectedTab} onChange={handleTabChange}>
            <Tab label={"Пользователи"} value={0} />
            <Tab label={"Товары"} value={1} />
            <Tab label={"Продажи"} value={2} />
          </Tabs>
        </Toolbar>
      </AppBar>
      {selectedTab === 0 ? <UserEntityBlock /> : <></>}
      {selectedTab === 1 ? <ItemEntityBlock /> : <></>}
      {selectedTab === 2 ? <SaleEntityBlock /> : <></>}
    </Box>
  );
};

export default AdminPanel;
