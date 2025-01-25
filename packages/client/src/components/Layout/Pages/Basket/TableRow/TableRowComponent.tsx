import { Typography, TableCell, TableRow, Box, IconButton } from "@mui/material";
import { BasketItem, ItemsContext } from "../../../../App/AppContext";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { useContext } from "react";

type TableRowProps = {
  basketItem: BasketItem;
};

const TableRowComponent = ({ basketItem }: TableRowProps) => {
  const { setItems } = useContext(ItemsContext);

  const handleAddToCart = () => {
    setItems((prevItems) => {
      return prevItems.map((item) => {
        return item.item.id === basketItem.item.id ? { ...item, quantity: item.quantity + 1 } : item;
      });
    });
  };

  const handleRemoveFromCart = () => {
    setItems((prevItems) =>
      prevItems
        .map((item) =>
          item.item.id === basketItem.item.id && item.quantity > 0 ? { ...item, quantity: item.quantity - 1 } : item,
        )
        .filter((item) => item.quantity > 0),
    );
  };

  return (
    <>
      <TableRow key={basketItem.item.id}>
        <TableCell>{basketItem.item.name}</TableCell>
        <TableCell align="right">{basketItem.item.price} ₽</TableCell>
        <TableCell align="right">{basketItem.quantity}</TableCell>
        <TableCell align="right">{basketItem.item.price * basketItem.quantity} ₽</TableCell>
        <TableCell align="right">
          <Box display="flex" alignItems="center" justifyContent="end">
            <IconButton onClick={handleRemoveFromCart} color="primary">
              <RemoveIcon />
            </IconButton>
            <Typography variant="body1" sx={{ margin: "0 8px" }}>
              {basketItem.quantity}
            </Typography>
            <IconButton onClick={handleAddToCart} color="primary">
              <AddIcon />
            </IconButton>
          </Box>
        </TableCell>
      </TableRow>
    </>
  );
};

export default TableRowComponent;
