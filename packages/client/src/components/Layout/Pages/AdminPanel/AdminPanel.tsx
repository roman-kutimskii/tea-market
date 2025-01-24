import { AppBar, Box, Tab, Tabs, Toolbar, Typography } from "@mui/material";
import EntityBlock, { RequestInfoBlockGroup } from "./EntityBlock/EntityBlock";
import { useContext, useEffect, useState } from "react";
import "./AdminPanel.css";
import { AuthContext } from "../../../App/AppContext";
import { useNavigate } from "react-router";

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

  const requestsGroups: RequestInfoBlockGroup[] = [
    {
      text: "Пользователи",
      path: "/api/users",
      requests: [
        {
          type: "GET",
          text: "GET",
          inputs: [],
          path: "",
          byId: false,
        },
        {
          type: "GET",
          text: "GET by ID",
          inputs: [{ name: "id", text: "Идентификатор", type: "number" }],
          path: "",
          byId: true,
        },
        {
          type: "POST",
          text: "POST",
          inputs: [
            { name: "email", text: "Почта", type: "email" },
            { name: "passwordHash", text: "Хэш пароля", type: "text" },
          ],
          path: "/seller",
          byId: false,
        },
        {
          type: "POST",
          text: "POST",
          inputs: [
            { name: "email", text: "Почта", type: "email" },
            { name: "passwordHash", text: "Хэш пароля", type: "text" },
          ],
          path: "/customer",
          byId: false,
        },
        {
          type: "PUT",
          text: "PUT by ID",
          inputs: [
            { name: "id", text: "Идентификатор", type: "number" },
            { name: "email", text: "Почта", type: "email" },
            { name: "passwordHash", text: "Хэш пароля", type: "text" },
          ],
          path: "",
          byId: true,
        },
        {
          type: "DELETE",
          text: "DELETE by ID",
          inputs: [{ name: "id", text: "Идентификатор", type: "number" }],
          path: "",
          byId: true,
        },
      ],
    },
    {
      text: "Товары",
      path: "/api/items",
      requests: [
        {
          type: "GET",
          text: "GET by ID",
          inputs: [{ name: "id", text: "идентификатор", type: "number" }],
          path: "path",
          byId: true,
        },
      ],
    },
  ];

  const [selectedTab, setSelectedTab] = useState(0);

  const handleTabChange = (_event: unknown, newValue: number) => {
    setSelectedTab(newValue);
  };

  return (
    <Box className="admin-panel">
      <Typography variant="h4" gutterBottom>
        Страница администратора
      </Typography>
      <AppBar className="app-bar" position="sticky" color="default">
        <Toolbar>
          <Tabs value={selectedTab} onChange={handleTabChange}>
            {requestsGroups.map((group, index) => (
              <Tab key={index} label={group.text} value={index} />
            ))}
          </Tabs>
        </Toolbar>
      </AppBar>
      {requestsGroups.map((requestsGroup, index) =>
        index === selectedTab ? <EntityBlock key={index} requestsGroup={requestsGroup} /> : <></>,
      )}
    </Box>
  );
};

export default AdminPanel;
