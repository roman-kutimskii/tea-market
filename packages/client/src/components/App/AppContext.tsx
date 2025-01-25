import React, { createContext, useState, ReactNode } from "react";
import { Item } from "../Layout/Pages/Catalog/ItemCard.tsx/ItemCard";

type AuthContextType = {
  auth: boolean;
  setAuth: React.Dispatch<React.SetStateAction<boolean>>;
};

export type BasketItem = { item: Item; quantity: number };

type ItemStorageContextType = {
  items: BasketItem[];
  setItems: React.Dispatch<React.SetStateAction<BasketItem[]>>;
};

const ItemsContext = createContext<ItemStorageContextType>({ items: [], setItems: () => <></> });
const AuthContext = createContext<AuthContextType>({ auth: false, setAuth: () => <></> });

type AppContextProps = {
  children: ReactNode;
};

const AppContext: React.FC<AppContextProps> = ({ children }) => {
  const [auth, setAuth] = useState<boolean>(!!localStorage.getItem("jwtToken"));
  const [items, setItems] = useState<BasketItem[]>([]);

  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      <ItemsContext.Provider value={{ items, setItems }}>{children}</ItemsContext.Provider>;
    </AuthContext.Provider>
  );
};

export { AppContext, AuthContext, ItemsContext };
