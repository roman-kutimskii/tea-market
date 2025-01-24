import React, { createContext, useState, ReactNode } from "react";

type AuthContextType = {
  auth: boolean;
  setAuth: React.Dispatch<React.SetStateAction<boolean>>;
};

type Item = { id: number; quantity: number };

type ItemStorageContextType = {
  items: Item[];
  setItems: React.Dispatch<React.SetStateAction<Item[]>>;
};

const ItemsContext = createContext<ItemStorageContextType>({ items: [], setItems: () => <></> });
const AuthContext = createContext<AuthContextType>({ auth: false, setAuth: () => <></> });

type AppContextProps = {
  children: ReactNode;
};

const AppContext: React.FC<AppContextProps> = ({ children }) => {
  const [auth, setAuth] = useState<boolean>(!!localStorage.getItem("jwtToken"));
  const [items, setItems] = useState<Item[]>([]);

  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      <ItemsContext.Provider value={{ items, setItems }}>{children}</ItemsContext.Provider>;
    </AuthContext.Provider>
  );
};

export { AppContext, AuthContext, ItemsContext };
