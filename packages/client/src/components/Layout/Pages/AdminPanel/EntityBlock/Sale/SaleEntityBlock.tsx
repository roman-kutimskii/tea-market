import {
  Box,
  TextField,
  Button,
  TableContainer,
  Paper,
  Table,
  TableBody,
  TableRow,
  TableCell,
  Typography,
  TableHead,
} from "@mui/material";
import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router";
import { api } from "../../../../../../utils/Api";
import { GetSale, PostSale } from "../../../../../../utils/Types";
import { AuthContext } from "../../../../../App/AppContext";
import SaleEntityRow from "./SaleEntityRow";

const SaleEntityBlock = () => {
  const [entities, setEntities] = useState<GetSale[]>([]);
  const [searchResult, setSearchResult] = useState<GetSale>();
  const [searchId, setSearchId] = useState("");
  const [itemIds, setItemIds] = useState("");
  const [sellerId, setSellerId] = useState(0);
  const [customerId, setCustomerId] = useState(0);
  const [newItem, setNewItem] = useState<GetSale>({
    id: 0,
    sellerId: 0,
    customerId: 0,
    saleToItems: [],
  });

  const navigate = useNavigate();
  const authorization = useContext(AuthContext);

  useEffect(() => {
    const fetchEntities = async () => {
      try {
        const salesData = await api.fetchWithAuth<GetSale[]>(authorization.setAuth, navigate, `sales`, "GET");

        setEntities(salesData);
      } catch (error) {
        console.error("Ошибка загрузки данных:", error);
      }
    };
    void fetchEntities();
  }, []);

  const handleCreateEntity = () => {
    const fetchEntities = async () => {
      try {
        const body: PostSale = {
          sellerId: sellerId,
          customerId: customerId,
          items: newItem.saleToItems,
        };
        const response = await api.fetchWithAuth<GetSale>(authorization.setAuth, navigate, `sales`, "POST", body);
        setEntities([...entities, response]);
      } catch (error) {
        console.error("Ошибка создания записи:", error);
      }
    };

    void fetchEntities();
  };

  const handleSearch = () => {
    setSearchResult(undefined);
    const fetchEntities = async () => {
      try {
        const response = await api.fetchWithAuth<GetSale>(authorization.setAuth, navigate, `sales/${searchId}`, "GET");
        setSearchResult(response);
      } catch (error) {
        console.error("Ошибка поиска записи:", error);
      }
    };
    void fetchEntities();
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.value.length === 0) {
      return;
    }
    setSearchId(Number(event.target.value) > 0 ? event.target.value : "");
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
    <Box sx={{ padding: 2 }}>
      <Box sx={{ marginBottom: 2 }}>
        <TextField
          label="Поиск по ID"
          value={searchId}
          type="number"
          onChange={handleSearchChange}
          variant="outlined"
          sx={{ marginRight: 1 }}
        />
        <Button variant="contained" onClick={handleSearch}>
          Поиск
        </Button>
        {searchResult && (
          <Box sx={{ marginTop: 2 }}>
            <TableContainer component={Paper}>
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell colSpan={5}>
                      <Typography variant="h6">Результат поиска:</Typography>
                    </TableCell>
                  </TableRow>
                  <SaleEntityRow sale={searchResult} setEntities={setEntities} />
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )}
      </Box>
      <Box sx={{ overflowX: "auto", marginBottom: 2 }}>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Id</TableCell>
                <TableCell>Id продавца</TableCell>
                <TableCell>Id покупателя</TableCell>
                <TableCell>Товары(ID:Кол-во)</TableCell>
                <TableCell>Действия</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>
                  <Typography variant="h6">-</Typography>
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
                  <Button variant="contained" onClick={handleCreateEntity}>
                    Создать
                  </Button>
                </TableCell>
              </TableRow>
              {entities.map((entity) => (
                <SaleEntityRow key={entity.id} sale={entity} setEntities={setEntities} />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
};

export default SaleEntityBlock;
