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
import { BasketItem, ItemsContext } from "../../../../App/AppContext";

type ItemCardProps = {
  basketItem: BasketItem;
};

const ItemCard = ({ basketItem }: ItemCardProps) => {
  const { setItems } = useContext(ItemsContext);
  const [count, setCount] = useState(basketItem.quantity);
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
    setCount((prevCount) => ++prevCount);
    setItems((prevItems) => {
      const itemExists = prevItems.some((item) => item.item.id === itemId);
      if (itemExists) {
        return prevItems.map((item) => (item.item.id === itemId ? { ...item, quantity: item.quantity + 1 } : item));
      } else {
        return [...prevItems, { item: basketItem.item, quantity: basketItem.quantity + 1 }];
      }
    });
  };

  const handleRemoveFromCart = (itemId: number) => {
    setCount((prevCount) => (prevCount > 0 ? --prevCount : 0));
    setItems((prevItems) =>
      prevItems
        .map((item) => (item.item.id === itemId && item.quantity > 0 ? { ...item, quantity: item.quantity - 1 } : item))
        .filter((item) => item.quantity > 0),
    );
  };

  return (
    <>
      <Box width="calc(33.333% - 11px)" boxSizing="border-box">
        <Card sx={{ display: "flex", flexDirection: "column", height: "100%" }} onClick={handleCardClick}>
          <CardMedia component="img" height="140" image={basketItem.item.imageUrl} alt={basketItem.item.name} />
          <CardContent sx={{ flexGrow: 1 }}>
            <Typography variant="h5" color="primary">
              {basketItem.item.name}
            </Typography>
            <Typography
              variant="body2"
              color="textSecondary"
              sx={{ maxWidth: 300, maxHeight: 60, overflow: "hidden", textOverflow: "ellipsis" }}
            >
              {basketItem.item.description}
            </Typography>
            <Typography variant="h6" color="secondary">
              {basketItem.item.price} ₽
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {basketItem.item.type}
            </Typography>
            <Typography variant="h6" color="primary">
              {`${basketItem.item.originCountry} - ${basketItem.item.region} - ${basketItem.item.manufacturer} : ${String(basketItem.item.harvestYear)}`}
            </Typography>
          </CardContent>
          {count > 0 ? (
            <Box display="flex" alignItems="center" justifyContent="center" sx={{ marginBottom: 1 }}>
              <IconButton
                onClick={() => {
                  handleRemoveFromCart(basketItem.item.id);
                }}
                color="primary"
              >
                <RemoveIcon />
              </IconButton>
              <Typography variant="body1" sx={{ margin: "0 8px" }}>
                {count}
              </Typography>
              <IconButton
                onClick={() => {
                  handleAddToCart(basketItem.item.id);
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
                handleAddToCart(basketItem.item.id);
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
        <DialogTitle>{`Название: ${basketItem.item.name}`}</DialogTitle>
        <DialogContent>
          <CardMedia
            component="img"
            image={basketItem.item.imageUrl}
            alt={basketItem.item.name}
            sx={{ marginBottom: 1 }}
          />
          <Typography variant="body1">{`Описание: ${basketItem.item.description}`}</Typography>
          <Typography variant="body2" color="textSecondary">
            {`Тип товара: ${basketItem.item.type}`}
          </Typography>
          <Typography variant="h6" color="primary" sx={{ marginBottom: 1 }}>
            {`Цена за грамм: ${String(basketItem.item.price)} ₽`}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            {`${basketItem.item.originCountry} - ${basketItem.item.region} - ${basketItem.item.manufacturer} : ${String(basketItem.item.harvestYear)}`}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            {`Урожай: ${String(basketItem.item.harvestYear)} года`}
          </Typography>
          {count > 0 ? (
            <Box display="flex" alignItems="center" justifyContent="center" sx={{ marginBottom: 1 }}>
              <IconButton
                onClick={() => {
                  handleRemoveFromCart(basketItem.item.id);
                }}
                color="primary"
              >
                <RemoveIcon />
              </IconButton>
              <Typography variant="body1" sx={{ margin: "0 8px" }}>
                {count}
              </Typography>
              <IconButton
                onClick={() => {
                  handleAddToCart(basketItem.item.id);
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
              fullWidth
              sx={{ margin: 1 }}
              onClick={() => {
                handleAddToCart(basketItem.item.id);
              }}
            >
              Добавить в корзину
            </Button>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ItemCard;
