/* eslint-disable @typescript-eslint/no-misused-promises */
import { useContext, useState } from "react";
import {
  Typography,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Alert,
  Snackbar,
} from "@mui/material";
import { api } from "../../../../utils/Api";
import { AuthContext, ItemsContext } from "../../../App/AppContext";
import { useNavigate } from "react-router";
import TableRowComponent from "./TableRow/TableRowComponent";
import { PostSale } from "../../../../utils/Types";

const Basket = () => {
  const { items, setItems } = useContext(ItemsContext);
  const authorization = useContext(AuthContext);
  const [open, setOpen] = useState<boolean>(false);
  const [messageType, setMessageType] = useState<"success" | "error">("success");

  const navigate = useNavigate();

  const calculateTotal = () => {
    return items.reduce((acc, item) => acc + (!isNaN(item.item.price) ? item.item.price : 0) * item.quantity, 0);
  };

  const handleClose = (_event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  const handleMakeSale = async () => {
    if (items.length <= 0) return;
    try {
      const body: PostSale = {
        customerId: Number(localStorage.getItem("userId")),
        items: items.map((item) => ({ itemId: item.item.id, quantity: item.quantity })),
      };
      await api.fetchWithAuth<PostSale>(authorization.setAuth, navigate, "sales", "POST", body);
      setItems([]);
      setMessageType("success");
      setOpen(true);
    } catch (error) {
      console.error("Failed to fetch items:", error);
      setMessageType("error");
      setOpen(true);
    }
  };

  return (
    <>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Название</TableCell>
              <TableCell align="right">Цена</TableCell>
              <TableCell align="right">Количество</TableCell>
              <TableCell align="right">Итого</TableCell>
              <TableCell align="right">Действия</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((item) => (
              <TableRowComponent key={item.item.id} basketItem={item} />
            ))}
            <TableRow>
              <TableCell colSpan={3} align="right">
                <Typography variant="h6">Общая сумма:</Typography>
              </TableCell>
              <TableCell align="right">
                <Typography variant="h6">{calculateTotal()} ₽</Typography>
              </TableCell>
              <TableCell />
            </TableRow>
          </TableBody>
        </Table>
        <Button variant="contained" color="primary" sx={{ margin: 2 }} onClick={handleMakeSale}>
          Оформить заказ
        </Button>
      </TableContainer>
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity={messageType} sx={{ width: "100%" }}>
          {messageType == "success" ? "Операция выполнена успешно!" : "Операция не удалась!"}
        </Alert>
      </Snackbar>
    </>
  );
};

export default Basket;
