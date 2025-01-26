import { TextField, Button, TableRow, TableCell, Typography } from "@mui/material";
import { useState, useContext } from "react";
import { useNavigate } from "react-router";
import { api } from "../../../../../../utils/Api";
import { GetSale, PostSale } from "../../../../../../utils/Types";
import { AuthContext } from "../../../../../App/AppContext";

type EntityRowProps = {
  setEntities: React.Dispatch<React.SetStateAction<GetSale[]>>;
  sale: Partial<GetSale>;
};

const SaleEntityRow = ({ sale, setEntities }: EntityRowProps) => {
  const [newItem, setNewItem] = useState<Partial<GetSale>>(sale);
  const [itemIds, setItemIds] = useState(
    sale.saleToItems?.map((i) => `${String(i.itemId)}:${String(i.quantity)}`).join(" "),
  );
  const [sellerId, setSellerId] = useState(sale.sellerId ?? -1);
  const [customerId, setCustomerId] = useState(sale.customerId ?? -1);

  const navigate = useNavigate();
  const authorization = useContext(AuthContext);

  const handleUpdateEntity = () => {
    const fetchData = async () => {
      try {
        const body: Partial<PostSale> = {
          ...newItem,
          sellerId: sellerId < 0 ? undefined : sellerId,
          customerId: customerId < 0 ? undefined : customerId,
          items: newItem.saleToItems,
        };

        const response = await api.fetchWithAuth<GetSale>(
          authorization.setAuth,
          navigate,
          `sales/${String(newItem.id)}`,
          "PATCH",
          body,
        );
        setNewItem(response);
        setEntities((prevEntities) => prevEntities.map((entity) => (entity.id !== response.id ? entity : response)));
      } catch (error) {
        console.error("Ошибка при обновлении почты:", error);
      }
    };

    void fetchData();
  };

  const handleDeleteEntity = () => {
    const fetchData = async () => {
      try {
        await api.fetchWithAuth(authorization.setAuth, navigate, `sales/${String(newItem.id)}`, "DELETE");
        setEntities((prevEntities) => prevEntities.filter((item) => item.id !== newItem.id));
      } catch (error) {
        console.error("Ошибка удаления записи:", error);
      }
    };

    void fetchData();
  };

  const handleSellerIdChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.value.length === 0) {
      return;
    }
    setSellerId(Number(event.target.value) > 0 ? Number(event.target.value) : 0);
  };

  const handleCustomerIdChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.value.length === 0) {
      return;
    }
    setCustomerId(Number(event.target.value) > 0 ? Number(event.target.value) : 0);
  };

  const handleItemIdsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.value.length === 0) {
      setItemIds("");
      setNewItem((prevNewItem) => ({
        ...prevNewItem,
        saleToItems: [],
      }));
      return;
    }
    if (!/^(( *\d+:[1-9]\d* *)*)?(\d+:[1-9]\d*|\d+:|\d+)?$/.test(event.target.value)) {
      return;
    }
    setItemIds(event.target.value);

    if (/^( *\d+:[1-9]\d* *)*$/.test(event.target.value)) {
      setNewItem((prevNewItem) => ({
        ...prevNewItem,
        saleToItems: event.target.value
          .split(/\s+/)
          .map((item) => {
            if (item.length <= 3) {
              return {
                itemId: -1,
                quantity: -1,
              };
            }
            const pair = item.split(":");
            return {
              itemId: Number(pair[0].length > 0 ? pair[0] : -1),
              quantity: Number(pair[1].length > 0 ? pair[1] : -1),
            };
          })
          .filter((item) => item.itemId >= 0 && item.quantity >= 0),
      }));
    }
  };

  return (
    <TableRow>
      <TableCell>
        <Typography variant="h6">{newItem.id}</Typography>
      </TableCell>
      <TableCell>
        <TextField value={sellerId} type="number" onChange={handleSellerIdChange} variant="outlined" />
      </TableCell>
      <TableCell>
        <TextField value={customerId} type="number" onChange={handleCustomerIdChange} variant="outlined" />
      </TableCell>
      <TableCell>
        <TextField value={itemIds} onChange={handleItemIdsChange} variant="outlined" />
      </TableCell>
      <TableCell>
        <Button variant="contained" color="secondary" onClick={handleUpdateEntity}>
          Обновить
        </Button>
        <Button variant="contained" color="primary" onClick={handleDeleteEntity}>
          Удалить
        </Button>
      </TableCell>
    </TableRow>
  );
};

export default SaleEntityRow;
