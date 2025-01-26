import React, { useState, useEffect, useContext } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  MenuItem,
  Select,
  Avatar,
  SelectChangeEvent,
} from "@mui/material";
import { api } from "../../../../../../utils/Api";
import { useNavigate } from "react-router";
import { GetItemsType, Item, PostItem, ResponceItemType } from "../../../../../../utils/Types";
import { AuthContext } from "../../../../../App/AppContext";
import ItemEntityRow from "./ItemEntityRow";

const ItemEntityBlock = () => {
  const [entities, setEntities] = useState<Item[]>([]);
  const [searchResult, setSearchResult] = useState<Item>();
  const [searchId, setSearchId] = useState("");
  const [newItem, setNewItem] = useState<PostItem>({
    name: "",
    description: "",
    price: 0,
    imageBase64: "",
    type: "",
    originCountry: "",
    region: "",
    harvestYear: 0,
    manufacturer: "",
  });
  const [avatarBase64, setAvatarBase64] = useState("");

  const navigate = useNavigate();
  const authorization = useContext(AuthContext);

  useEffect(() => {
    const fetchEntities = async () => {
      try {
        const response = await api.fetchWithoutAuth<GetItemsType>("items", "GET");
        setEntities(
          response.items.map((item) => ({
            ...item,
            price: Number(item.price.replace(/[\s,?]/g, "")) / 100,
          })),
        );
      } catch (error) {
        console.error("Ошибка загрузки данных:", error);
      }
    };
    void fetchEntities();
  }, []);

  const handleCreateEntity = () => {
    const fetchEntities = async () => {
      try {
        if (newItem.name.length === 0 || newItem.price <= 0) {
          return;
        }
        const body: PostItem = newItem;

        const response = await api.fetchWithAuth<Item>(authorization.setAuth, navigate, `items`, "POST", body);

        setEntities([...entities, response]);
      } catch (error) {
        console.error("Ошибка создания записи:", error);
      }
    };

    void fetchEntities();
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarBase64(reader.result as string);
        setNewItem((prevItem) => ({ ...prevItem, imageBase64: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSearch = () => {
    setSearchResult(undefined);
    const fetchEntities = async () => {
      try {
        const response = await api.fetchWithAuth<ResponceItemType>(
          authorization.setAuth,
          navigate,
          `items/${searchId}`,
          "GET",
        );
        setSearchResult({
          ...response,
          price: Number(response.price.replace(/[\s,?]/g, "")) / 100,
        });
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

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewItem((prevItem) => ({ ...prevItem, name: event.target.value }));
  };

  const handleDescriptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewItem((prevItem) => ({ ...prevItem, description: event.target.value }));
  };

  const handlePriceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewItem((prevItem) => ({ ...prevItem, price: Number(event.target.value) }));
  };

  const handleTypeChange = (event: SelectChangeEvent) => {
    setNewItem((prevItem) => ({ ...prevItem, type: event.target.value }));
  };
  const handleOriginCountryChange = (event: SelectChangeEvent) => {
    setNewItem((prevItem) => ({ ...prevItem, originCountry: event.target.value }));
  };
  const handleRegionChange = (event: SelectChangeEvent) => {
    setNewItem((prevItem) => ({ ...prevItem, region: event.target.value }));
  };
  const handleHarvestYearChange = (event: SelectChangeEvent) => {
    setNewItem((prevItem) => ({ ...prevItem, harvestYear: Number(event.target.value) }));
  };
  const handleManufacturerChange = (event: SelectChangeEvent) => {
    setNewItem((prevItem) => ({ ...prevItem, manufacturer: event.target.value }));
  };

  const filterValues: Record<string, string[]> = {
    type: ["Черный", "Зеленый", "Желтый", "Белый", "Пуэр", "Улун"],
    originCountry: ["Китай", "Индия", "Шри-Ланка"],
    region: ["Ассам", "Дарджилинг", "Ува", "Фуцзянь", "Сычуань"],
    harvestYear: Array.from({ length: 2026 - 2000 }, (_, i) => (2000 + i).toString()),
    manufacturer: ["Tata Tea", "Dilmah", "Tenfu Tea"],
  };

  return (
    <Box sx={{ padding: 2 }}>
      <Box sx={{ marginBottom: 2 }}>
        <TextField
          label="Поиск по ID"
          value={searchId}
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
                  <ItemEntityRow item={searchResult} setEntities={setEntities} />
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
                <TableCell>Название</TableCell>
                <TableCell>Описание</TableCell>
                <TableCell>Цена</TableCell>
                <TableCell>Изображение</TableCell>
                <TableCell>Тип</TableCell>
                <TableCell>Страна</TableCell>
                <TableCell>Регион</TableCell>
                <TableCell>Год сбора</TableCell>
                <TableCell>Компания</TableCell>
                <TableCell>Действия</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>
                  <Typography variant="h6">-</Typography>
                </TableCell>
                <TableCell sx={{ minWidth: 250 }}>
                  <TextField value={newItem.name} onChange={handleNameChange} variant="outlined" />
                </TableCell>
                <TableCell sx={{ minWidth: 350 }}>
                  <TextField
                    sx={{ minWidth: 150 }}
                    value={newItem.description}
                    onChange={handleDescriptionChange}
                    variant="outlined"
                    multiline
                    rows={4}
                    fullWidth
                  />
                </TableCell>
                <TableCell sx={{ minWidth: 120 }}>
                  <TextField value={newItem.price} type="number" onChange={handlePriceChange} variant="outlined" />
                </TableCell>
                <TableCell>
                  <Button variant="outlined" component="label">
                    <Avatar src={avatarBase64} alt="image" sx={{ width: 50, height: 50 }} />
                    <input type="file" accept="image/*" hidden onChange={handleImageChange} />
                  </Button>
                </TableCell>

                <TableCell sx={{ minWidth: 150 }}>
                  <Select
                    sx={{ minWidth: 100 }}
                    fullWidth
                    value={newItem.type}
                    onChange={handleTypeChange}
                    displayEmpty
                    MenuProps={{ disableScrollLock: true }}
                  >
                    {filterValues.type.map((t) => (
                      <MenuItem key={t} value={t}>
                        {t}
                      </MenuItem>
                    ))}
                  </Select>
                </TableCell>
                <TableCell sx={{ minWidth: 160 }}>
                  <Select
                    sx={{ minWidth: 160 }}
                    value={newItem.originCountry}
                    onChange={handleOriginCountryChange}
                    displayEmpty
                    MenuProps={{ disableScrollLock: true }}
                  >
                    {filterValues.originCountry.map((country) => (
                      <MenuItem key={country} value={country}>
                        {country}
                      </MenuItem>
                    ))}
                  </Select>
                </TableCell>
                <TableCell sx={{ minWidth: 160 }}>
                  <Select
                    sx={{ minWidth: 160 }}
                    value={newItem.region}
                    onChange={handleRegionChange}
                    displayEmpty
                    MenuProps={{ disableScrollLock: true }}
                  >
                    {filterValues.region.map((r) => (
                      <MenuItem key={r} value={r}>
                        {r}
                      </MenuItem>
                    ))}
                  </Select>
                </TableCell>
                <TableCell>
                  <Select
                    value={String(newItem.harvestYear)}
                    onChange={handleHarvestYearChange}
                    displayEmpty
                    MenuProps={{ disableScrollLock: true }}
                  >
                    {filterValues.harvestYear.map((year) => (
                      <MenuItem key={year} value={year}>
                        {year}
                      </MenuItem>
                    ))}
                  </Select>
                </TableCell>
                <TableCell sx={{ minWidth: 160 }}>
                  <Select
                    sx={{ minWidth: 160 }}
                    value={newItem.manufacturer}
                    onChange={handleManufacturerChange}
                    displayEmpty
                    MenuProps={{ disableScrollLock: true }}
                  >
                    {filterValues.manufacturer.map((m) => (
                      <MenuItem key={m} value={m}>
                        {m}
                      </MenuItem>
                    ))}
                  </Select>
                </TableCell>
                <TableCell>
                  <Button variant="contained" onClick={handleCreateEntity}>
                    Создать
                  </Button>
                </TableCell>
              </TableRow>
              {entities.map((entity) => (
                <ItemEntityRow key={entity.id} item={entity} setEntities={setEntities} />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
};

export default ItemEntityBlock;
