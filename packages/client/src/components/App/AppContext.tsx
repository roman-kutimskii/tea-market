import React, { createContext, useState, ReactNode } from "react";
import { Item } from "../../utils/Types";

type AuthContextType = {
  auth: boolean;
  avatarPath: string;
  setAuth: React.Dispatch<React.SetStateAction<boolean>>;
  setAvatarPath: React.Dispatch<React.SetStateAction<string>>;
};

export type BasketItem = { item: Item; quantity: number };

type ItemStorageContextType = {
  items: BasketItem[];
  setItems: React.Dispatch<React.SetStateAction<BasketItem[]>>;
};

const ItemsContext = createContext<ItemStorageContextType>({ items: [], setItems: () => <></> });
const AuthContext = createContext<AuthContextType>({
  auth: false,
  avatarPath: "false",
  setAuth: () => <></>,
  setAvatarPath: () => <></>,
});

type AppContextProps = {
  children: ReactNode;
};

const AppContext: React.FC<AppContextProps> = ({ children }) => {
  const [auth, setAuth] = useState<boolean>(!!localStorage.getItem("jwtToken"));
  const [avatarPath, setAvatarPath] = useState<string>("");
  const [items, setItems] = useState<BasketItem[]>([]);

  return (
    <AuthContext.Provider value={{ auth, setAuth, avatarPath, setAvatarPath }}>
      <ItemsContext.Provider value={{ items, setItems }}>{children}</ItemsContext.Provider>;
    </AuthContext.Provider>
  );
};

export { AppContext, AuthContext, ItemsContext };
