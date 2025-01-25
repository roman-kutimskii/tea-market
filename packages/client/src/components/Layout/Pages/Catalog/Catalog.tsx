import React, { useState, useEffect, useContext } from "react";
import { Container, TextField, Select, MenuItem, Pagination, Box, Typography, SelectChangeEvent } from "@mui/material";
import ItemCard, { Item } from "./ItemCard.tsx/ItemCard";
import { api } from "../../../../utils/Api";
import { BasketItem, ItemsContext } from "../../../App/AppContext";

type ResponceItemType = Omit<Item, "price"> & { price: string };

type GetItemsType = {
  items: ResponceItemType[];
  count: number;
};

const Catalog = () => {
  const basketItems = useContext(ItemsContext);
  const [items, setItems] = useState<BasketItem[]>(basketItems.items);
  const [limit, setLimit] = useState(5);
  const [sortBy, setSortBy] = useState("harvestYear");
  const [sortOrder, setSortOrder] = useState("");
  const [filterBy, setFilterBy] = useState("");
  const [filterValue, setFilterValue] = useState("");

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchItems = async () => {
      try {
        let parameters = "?";
        parameters += page > 0 ? `page=${String(page)}&` : "";
        parameters += limit > 0 ? `limit=${String(limit)}&` : "";
        parameters += sortBy.length > 0 ? `sortBy=${sortBy}&` : "";
        parameters += sortOrder.length > 0 ? `sortOrder=${sortOrder}&` : "";
        parameters += filterBy.length > 0 ? `filterBy=${filterBy}&` : "";
        parameters += filterValue.length > 0 ? `filterValue=${filterValue}&` : "";
        parameters = parameters.slice(0, -1);

        const response = await api.fetchWithoutAuth<GetItemsType>("items" + parameters, "GET");
        setItems(() => {
          const existingItemsMap = new Map(basketItems.items.map((item) => [item.item.id, item]));

          const mergedItems = response.items
            .map((item) => {
              if (!existingItemsMap.has(item.id)) {
                return {
                  item: {
                    ...item,
                    price: Number(item.price.replace(/[\s,?]/g, "")) / 100,
                  },
                  quantity: 0,
                };
              } else {
                return existingItemsMap.get(item.id);
              }
            })
            .filter((item): item is BasketItem => item !== undefined);

          return mergedItems;
        });
        setTotalPages(response.count > 0 ? Math.ceil(response.count / limit) : 1);
      } catch (error) {
        console.error("Failed to fetch items:", error);
      }
    };

    void fetchItems();
  }, [page, sortBy, sortOrder, filterBy, filterValue, limit]);

  useEffect(() => {
    const fetchItems = async () => {
      if (search.length === 0) {
        return;
      }
      try {
        const parameters = `?query=${search}`;
        const response = await api.fetchWithoutAuth<GetItemsType>("items/search" + parameters, "GET");
        setItems(() => {
          const existingItemsMap = new Map(basketItems.items.map((item) => [item.item.id, item]));

          const mergedItems =
            // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
            response.items && response.items.length > 0
              ? response.items
                  .map((item) => {
                    if (!existingItemsMap.has(item.id)) {
                      return {
                        item: {
                          ...item,
                          price: Number(item.price.replace(/[\s,?]/g, "")) / 100,
                        },
                        quantity: 0,
                      };
                    } else {
                      return existingItemsMap.get(item.id);
                    }
                  })
                  .filter((item): item is BasketItem => item !== undefined)
              : [];

          return mergedItems;
        });
        setTotalPages(response.count > 0 ? Math.ceil(response.count / limit) : 1);
      } catch (error) {
        console.error("Failed to fetch items:", error);
      }
    };

    void fetchItems();
  }, [limit, search]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
    setPage(1);
  };

  const handleSortByChange = (event: SelectChangeEvent) => {
    setSortBy(event.target.value);
    setPage(1);
  };

  const handleSortOrderChange = (event: SelectChangeEvent) => {
    setSortOrder(event.target.value);
    setPage(1);
  };

  const handleTypeFilterChange = (event: SelectChangeEvent) => {
    setFilterBy(event.target.value);
    setPage(1);
  };

  const handleValueFilterChange = (event: SelectChangeEvent) => {
    setFilterValue(event.target.value);
    setPage(1);
  };

  const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const handleLimitChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(event.target.value);
    setLimit(value > 0 ? value : 1);
  };

  const filterValues: Record<string, string[]> = {
    "": [""],
    type: ["Черный", "Зеленый", "Красный"],
    originCountry: ["Китай", "Индия", "Шри-Ланка"],
    region: ["Ассам", "Дарджилинг", "Ува", "Фуцзянь", "Сычуань"],
    harvestYear: ["2015", "2016", "2017", "2018", "2019", "2020", "2021", "2022", "2023", "2024"],
    manufacturer: ["Tata Tea", "Dilmah", "Tenfu Tea"],
  };

  return (
    <Container>
      <Box marginBottom={2} marginTop={2} display="flex" flexDirection="row" alignItems="stretch">
        <TextField
          label="Поиск"
          variant="outlined"
          value={search}
          onChange={handleSearchChange}
          style={{ flex: "0 0 80%" }}
        />
        <TextField
          label="Карт на странице"
          type="number"
          variant="outlined"
          value={limit}
          onChange={handleLimitChange}
          style={{ flex: "0 0 20%" }}
        />
      </Box>
      <Box display="flex" flexDirection="column" gap={2} marginBottom={2}>
        <Box
          display="flex"
          flexDirection="column"
          flex="1 1 50%"
          alignItems="stretch"
          sx={{ padding: 1, border: "1px solid #ccc", borderRadius: "4px" }}
        >
          <Typography variant="h6" gutterBottom>
            Сортировка
          </Typography>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Box display="flex" alignItems="center" flex="1">
              <Typography variant="subtitle1">По</Typography>
              <Select
                value={sortBy}
                onChange={handleSortByChange}
                displayEmpty
                MenuProps={{
                  disableScrollLock: true,
                }}
                sx={{ flex: "1", marginLeft: 1, marginRight: 10 }}
              >
                <MenuItem value="harvestYear">Году сбора</MenuItem>
                <MenuItem value="name">Имени</MenuItem>
                <MenuItem value="type">Типу</MenuItem>
                <MenuItem value="originCountry">Стране</MenuItem>
                <MenuItem value="region">Региону</MenuItem>
                <MenuItem value="manufacturer">Компании производителя</MenuItem>
              </Select>
            </Box>
            <Box display="flex" alignItems="center" flex="1">
              <Typography variant="subtitle1">Порядок</Typography>
              <Select
                value={sortOrder}
                onChange={handleSortOrderChange}
                MenuProps={{
                  disableScrollLock: true,
                }}
                displayEmpty
                sx={{ flex: "1", marginLeft: 1 }}
              >
                <MenuItem value="">По умолчанию</MenuItem>
                <MenuItem value="ASC">По возрастанию</MenuItem>
                <MenuItem value="DESC">По убыванию</MenuItem>
              </Select>
            </Box>
          </Box>
        </Box>

        <Box
          display="flex"
          flexDirection="column"
          flex="1 1 50%"
          alignItems="stretch"
          sx={{ padding: 1, border: "1px solid #ccc", borderRadius: "4px" }}
        >
          <Typography variant="h6" gutterBottom>
            Фильтр
          </Typography>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Box display="flex" alignItems="center" flex="1">
              <Typography variant="subtitle1">По</Typography>
              <Select
                value={filterBy}
                onChange={handleTypeFilterChange}
                displayEmpty
                MenuProps={{
                  disableScrollLock: true,
                }}
                sx={{ flex: "1 1 auto", marginLeft: 1, marginRight: 10 }}
              >
                <MenuItem value="">Умолчанию</MenuItem>
                <MenuItem value="type">Типу</MenuItem>
                <MenuItem value="originCountry">Стране</MenuItem>
                <MenuItem value="region">Региону</MenuItem>
                <MenuItem value="harvestYear">Году сбора</MenuItem>
                <MenuItem value="manufacturer">Компании производителя</MenuItem>
              </Select>
            </Box>
            <Box display="flex" alignItems="center" flex="1">
              <Typography variant="subtitle1">Значение</Typography>
              <Select
                value={filterValue}
                onChange={handleValueFilterChange}
                displayEmpty
                MenuProps={{
                  disableScrollLock: true,
                }}
                sx={{ flex: "1", marginLeft: 1 }}
                disabled={filterBy.length === 0}
              >
                {filterValues[filterBy].map((item) => (
                  <MenuItem key={item} value={item}>
                    {item}
                  </MenuItem>
                ))}
              </Select>
            </Box>
          </Box>
        </Box>
      </Box>
      <Box display="flex" flexWrap="wrap" gap={2} justifyContent="flex-start">
        {items.map((item) => (
          <ItemCard key={item.item.id} basketItem={item} />
        ))}
      </Box>
      <Pagination
        count={totalPages}
        page={page}
        onChange={handlePageChange}
        color="primary"
        sx={{ marginTop: "20px", display: "flex", justifyContent: "center" }}
      />
    </Container>
  );
};

export default Catalog;
