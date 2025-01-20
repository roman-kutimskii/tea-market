import { AppBar, Toolbar, Container, Button, Box } from "@mui/material";
import { useState } from "react";
import CategoryIcon from "@mui/icons-material/Category";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import Leaf from "../../../public/leaf.png";
import { ManageAccounts } from "@mui/icons-material";
import "./Layout.css";
import AdminPanel from "./AdminPanel/AdminPanel";

const Catalog = () => <div>Home Page</div>;
const Basket = () => <div>About Page</div>;
const PersonalAccount = () => <div>Contact Page</div>;

type Page = {
  startIcon: React.JSX.Element;
  page: React.JSX.Element;
  pageName: string;
  text: string;
};

const Layout = () => {
  const [currentPage, setCurrentPage] = useState("catalog");

  const pages: Page[] = [
    {
      startIcon: <CategoryIcon />,
      page: <Catalog />,
      pageName: "catalog",
      text: "Каталог",
    },
    {
      startIcon: <ManageAccounts />,
      page: <AdminPanel />,
      pageName: "adminPanel",
      text: "Страница администратора",
    },
    {
      startIcon: <ShoppingCartIcon />,
      page: <Basket />,
      pageName: "basket",
      text: "Корзина",
    },
    {
      startIcon: <AccountCircleIcon />,
      page: <PersonalAccount />,
      pageName: "lk",
      text: "Личный кабинет",
    },
  ];

  const renderPage = () => {
    const page = pages.find((i) => i.pageName === currentPage);
    return page ? page.page : <Catalog />;
  };

  return (
    <>
      <AppBar position="sticky">
        <Toolbar className="toolbar">
          <Box className="buttons-group">
            <img src={Leaf} alt="Logo" className="logo" />
            <Button
              key={pages[0].pageName}
              color="inherit"
              startIcon={pages[0].startIcon}
              onClick={() => {
                setCurrentPage(pages[0].pageName);
              }}
              className="button"
            >
              {pages[0].text}
            </Button>
            <Button
              key={pages[1].pageName}
              color="inherit"
              startIcon={pages[1].startIcon}
              onClick={() => {
                setCurrentPage(pages[1].pageName);
              }}
              className="button"
            >
              {pages[1].text}
            </Button>
          </Box>
          <Box className="buttons-group">
            <Button
              key={pages[2].pageName}
              color="inherit"
              startIcon={pages[2].startIcon}
              onClick={() => {
                setCurrentPage(pages[2].pageName);
              }}
              className="button"
            >
              {pages[2].text}
            </Button>
            <Button
              key={pages[3].pageName}
              color="inherit"
              startIcon={pages[3].startIcon}
              onClick={() => {
                setCurrentPage(pages[3].pageName);
              }}
              className="button"
            >
              {pages[3].text}
            </Button>
          </Box>
        </Toolbar>
      </AppBar>
      <Container>{renderPage()}</Container>
    </>
  );
};

export default Layout;
