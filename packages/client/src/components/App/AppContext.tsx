import React, { createContext, useState, ReactNode } from "react";

type AuthContextType = {
  auth: boolean;
  setAuth: React.Dispatch<React.SetStateAction<boolean>>;
};

const AuthContext = createContext<AuthContextType>({ auth: false, setAuth: () => <></> });

type AppContextProps = {
  children: ReactNode;
};

const AppContext: React.FC<AppContextProps> = ({ children }) => {
  const [auth, setAuth] = useState<boolean>(!!localStorage.getItem("jwtToken"));

  return <AuthContext.Provider value={{ auth, setAuth }}>{children}</AuthContext.Provider>;
};

export { AppContext, AuthContext };
