import { useState, useContext } from "react";
import {
  Button,
  TextField,
  TableCell,
  TableRow,
  MenuItem,
  Select,
  Typography,
  SelectChangeEvent,
  Avatar,
} from "@mui/material";
import { useNavigate } from "react-router";
import { Item, PostItem } from "../../../../../../utils/Types";
import { AuthContext } from "../../../../../App/AppContext";
import { api } from "../../../../../../utils/Api";
import { filterValues } from "../../../../../../utils/Constants";

type EntityRowProps = {
  setEntities: React.Dispatch<React.SetStateAction<Item[]>>;
  item: Partial<Item>;
};

const ItemEntityRow = ({ item, setEntities }: EntityRowProps) => {
  const [newItem, setNewItem] = useState<Partial<Item>>(item);
  const [imgBase64, setImgBase64] = useState(item.imageUrl);

  const navigate = useNavigate();
  const authorization = useContext(AuthContext);

  const handleUpdateEntity = () => {
    const fetchData = async () => {
      try {
        const body: Partial<PostItem> = {
          ...newItem,
          imageBase64: imgBase64 === item.imageUrl ? undefined : imgBase64,
        };
        const response = await api.fetchWithAuth<Item>(
          authorization.setAuth,
          navigate,
          `items/${String(newItem.id)}`,
          "PATCH",
          body,
        );
        setNewItem(response);
        setEntities((prevEntities) => prevEntities.map((entity) => (entity.id !== response.id ? entity : response)));
      } catch (error) {
        console.error("Ошибка при обновлении товара:", error);
      }
    };

    void fetchData();
  };

  const handleImgChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImgBase64(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDeleteEntity = () => {
    const fetchData = async () => {
      try {
        await api.fetchWithAuth(authorization.setAuth, navigate, `items/${String(newItem.id)}`, "DELETE");
        setEntities((prevEntities) => prevEntities.filter((item) => item.id !== newItem.id));
      } catch (error) {
        console.error("Ошибка удаления записи:", error);
      }
    };

    void fetchData();
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

  return (
    <TableRow>
      <TableCell>
        <Typography variant="h6">{newItem.id}</Typography>
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
          <Avatar src={imgBase64} alt="image" sx={{ width: 50, height: 50 }} />
          <input type="file" accept="image/*" hidden onChange={handleImgChange} />
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
          sx={{ minWidth: 80 }}
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

export default ItemEntityRow;
