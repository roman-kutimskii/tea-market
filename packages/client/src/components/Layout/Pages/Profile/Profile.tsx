import { useState, useEffect, useContext } from "react";
import {
  Typography,
  TextField,
  Button,
  Avatar,
  List,
  ListItem,
  ListItemText,
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
} from "@mui/material";
import { useNavigate } from "react-router";
import { api } from "../../../../utils/Api";
import { AuthContext } from "../../../App/AppContext";
import { CreateUser, GetSale, Item, ResponceItemType, Role, Sale, User } from "../../../../utils/Types";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const Profile = () => {
  const [saleHistory, setSaleHistory] = useState<Sale[]>([]);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<Role>("customer");
  const [avatarBase64, setAvatarBase64] = useState("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const navigate = useNavigate();
  const authorization = useContext(AuthContext);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await api.fetchWithAuth<User>(
          authorization.setAuth,
          navigate,
          `users/${localStorage.getItem("userId") ?? ""}`,
          "GET",
        );
        setEmail(userData.email);
        setRole(userData.role);
        setAvatarBase64(userData.avatarUrl);
        localStorage.setItem("userRole", userData.role);
      } catch (error) {
        console.error("Ошибка при загрузке данных пользователя:", error);
      }
    };

    const fetchSalesHistory = async () => {
      try {
        const salesData = await api.fetchWithAuth<GetSale[]>(
          authorization.setAuth,
          navigate,
          `sales/customer/${localStorage.getItem("userId") ?? ""}`,
          "GET",
        );
        const transformedSales: Sale[] = await Promise.all(
          salesData.map(async (sale) => {
            const saleToItems = await Promise.all(
              sale.saleToItems.map(async (getSaleItem) => {
                const responseItem = await api.fetchWithoutAuth<ResponceItemType>(
                  `items/${String(getSaleItem.itemId)}`,
                  "GET",
                );
                const item: Item = {
                  ...responseItem,
                  price: Number(responseItem.price.replace(/[\s,$,?]/g, "")) / 100,
                };
                return {
                  item,
                  quantity: getSaleItem.quantity,
                };
              }),
            );

            return {
              id: sale.id,
              saleToItems,
            };
          }),
        );
        setSaleHistory(transformedSales);
      } catch (error) {
        console.error("Ошибка при загрузке истории покупок:", error);
      }
    };

    void fetchUserData();
    void fetchSalesHistory();
  }, []);

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarBase64(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveChanges = () => {
    const SaveAva = async () => {
      try {
        const body: { avatarBase64: string } = {
          avatarBase64: avatarBase64,
        };
        const responce = await api.fetchWithAuth<User>(
          authorization.setAuth,
          navigate,
          `users/${localStorage.getItem("userId") ?? ""}/avatar`,
          "PATCH",
          body,
        );
        setAvatarFile(null);
        authorization.setAvatarPath(responce.avatarUrl);
      } catch (error) {
        console.error("Ошибка при загрузке аватара:", error);
      }
    };
    const SaveEmail = async () => {
      try {
        const body: Partial<CreateUser> = {
          email: email,
          role: role,
        };
        const item = await api.fetchWithAuth<User>(
          authorization.setAuth,
          navigate,
          `users/${localStorage.getItem("userId") ?? ""}`,
          "PATCH",
          body,
        );
        setEmail(item.email);
      } catch (error) {
        console.error("Ошибка при обновлении почты:", error);
      }
    };

    void SaveAva();
    void SaveEmail();
  };

  return (
    <>
      <Typography variant="h4" sx={{ marginTop: 2, marginBottom: 2 }}>
        Профиль пользователя
      </Typography>
      <Box display="flex" sx={{ marginBottom: 2 }}>
        <Avatar src={avatarBase64} alt="Avatar" sx={{ width: 100, height: 100 }} />
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="start"
          alignItems="center"
          sx={{ marginTop: 2, marginLeft: 2 }}
        >
          <Button variant="contained" component="label">
            Загрузить аватар
            <input type="file" accept="image/*" hidden onChange={handleAvatarChange} />
          </Button>
          {avatarFile && (
            <Typography variant="body1" sx={{ mt: 2 }}>
              Файл: {avatarFile.name}
            </Typography>
          )}
        </Box>
      </Box>
      <TextField
        label="Email"
        value={email}
        onChange={handleEmailChange}
        variant="outlined"
        fullWidth
        margin="normal"
      />
      <Button variant="contained" color="primary" onClick={handleSaveChanges} sx={{ mt: 2 }}>
        Сохранить изменения
      </Button>

      <Typography variant="h5" sx={{ marginTop: 4, marginBottom: 2 }}>
        История покупок
      </Typography>
      {saleHistory.map((sale, saleIndex) => {
        const totalSalePrice = sale.saleToItems.reduce((acc, saleItem) => {
          return acc + saleItem.quantity * saleItem.item.price;
        }, 0);
        return (
          <Accordion key={saleIndex}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls={`panel${String(sale.id)}-content`}
              id={`panel${String(sale.id)}-header`}
            >
              <Box display="flex" justifyContent="space-between" width="100%">
                <Typography>Покупка #{Math.abs(saleIndex - saleHistory.length)}</Typography>
                <Box>
                  <Typography variant="h6" sx={{ marginRight: 2 }} color="primary">
                    Общая стоимость:
                  </Typography>
                  <Typography variant="h6" sx={{ marginRight: 2 }}>
                    {!isNaN(totalSalePrice) ? totalSalePrice.toFixed(2) : 0} ₽
                  </Typography>
                </Box>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <List>
                {sale.saleToItems.map((saleItem, index) => {
                  const totalPrice = saleItem.quantity * (!isNaN(saleItem.item.price) ? saleItem.item.price : 0);
                  return (
                    <ListItem key={index}>
                      <ListItemText
                        primary={`Название: ${saleItem.item.name}`}
                        secondary={`Количество: ${String(saleItem.quantity)}, Цена: ${String(!isNaN(saleItem.item.price) ? saleItem.item.price : 0)}, Сумма: ${String(totalPrice)}`}
                      />
                    </ListItem>
                  );
                })}
              </List>
            </AccordionDetails>
          </Accordion>
        );
      })}
    </>
  );
};

export default Profile;
