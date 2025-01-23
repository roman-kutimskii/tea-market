import { useContext, useState } from "react";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Button,
  IconButton,
  Dialog,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { ItemsContext } from "../../../../App/AppContext";

export type Item = {
  id: number;
  name: string;
  description: string;
  price: string;
  imageUrl: string;
  type: string;
  originCountry: string;
  region: string;
  harvestYear: number;
  manufacturer: string;
};

type ItemCardProps = {
  item: Item;
};

const ItemCard = ({ item }: ItemCardProps) => {
  const [cart, setCart] = useState<Record<number, number>>({});
  const { setItems } = useContext(ItemsContext);
  const [open, setOpen] = useState(false);

  const handleCardClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const target = event.target as HTMLElement;
    if (target.closest("button")) return;
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleAddToCart = (itemId: number) => {
    setCart((prevCart) => ({
      ...prevCart,
      [itemId]: (prevCart[itemId] || 0) + 1,
    }));

    setItems((prevItems) => {
      const itemExists = prevItems.some((item) => item.id === itemId);
      if (itemExists) {
        return prevItems.map((item) => (item.id === itemId ? { ...item, quantity: item.quantity + 1 } : item));
      } else {
        return [...prevItems, { id: itemId, quantity: 1 }];
      }
    });
  };

  const handleRemoveFromCart = (itemId: number) => {
    setCart((prevCart) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { [itemId]: unused, ...newCart } = prevCart;
      if (prevCart[itemId] > 1) {
        return { ...newCart, [itemId]: prevCart[itemId] - 1 };
      }
      return newCart;
    });

    setItems((prevItems) =>
      prevItems
        .map((item) => (item.id === itemId && item.quantity > 0 ? { ...item, quantity: item.quantity - 1 } : item))
        .filter((item) => item.quantity > 0),
    );
  };

  return (
    <>
      <Box width="calc(33.333% - 11px)" boxSizing="border-box">
        <Card sx={{ display: "flex", flexDirection: "column", height: "100%" }} onClick={handleCardClick}>
          <CardMedia component="img" height="140" image={item.imageUrl} alt={item.name} />
          <CardContent sx={{ flexGrow: 1 }}>
            <Typography variant="h5" color="primary">
              {item.name}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {item.description}
            </Typography>
            <Typography variant="h6" color="secondary">
              {item.price.replace(/[?]/g, "")} ₽
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {item.type}
            </Typography>
            <Typography variant="h6" color="primary">
              {`${item.originCountry} - ${item.region} - ${item.manufacturer} : ${String(item.harvestYear)}`}
            </Typography>
          </CardContent>
          {cart[item.id] ? (
            <Box display="flex" alignItems="center" justifyContent="center" sx={{ marginBottom: 1 }}>
              <IconButton
                onClick={() => {
                  handleRemoveFromCart(item.id);
                }}
                color="primary"
              >
                <RemoveIcon />
              </IconButton>
              <Typography variant="body1" sx={{ margin: "0 8px" }}>
                {cart[item.id]}
              </Typography>
              <IconButton
                onClick={() => {
                  handleAddToCart(item.id);
                }}
                color="primary"
              >
                <AddIcon />
              </IconButton>
            </Box>
          ) : (
            <Button
              variant="contained"
              color="primary"
              sx={{ margin: 1 }}
              onClick={() => {
                handleAddToCart(item.id);
              }}
            >
              Добавить в корзину
            </Button>
          )}
        </Card>
      </Box>
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            width: "60%",
            height: "60%",
            maxWidth: "none",
            maxHeight: "none",
          },
        }}
      >
        <DialogTitle>{`Название: ${item.name}`}</DialogTitle>
        <DialogContent>
          <CardMedia component="img" image={item.imageUrl} alt={item.name} sx={{ marginBottom: 1 }} />
          <Typography variant="body1">{`Описание: ${item.description}`}</Typography>
          <Typography variant="body2" color="textSecondary">
            {`Тип товара: ${item.type}`}
          </Typography>
          <Typography variant="h6" color="primary" sx={{ marginBottom: 1 }}>
            {`Цена за грамм: ${item.price.replace(/[?]/g, "")} ₽`}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            {`${item.originCountry} - ${item.region} - ${item.manufacturer} : ${String(item.harvestYear)}`}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            {`Урожай: ${String(item.harvestYear)} года`}
          </Typography>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ItemCard;
