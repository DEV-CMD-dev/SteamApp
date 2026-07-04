import React, { createContext, useState } from "react";

type AuthContextType = {
  accessToken: string | null;
  login: (accessToken: string, username: string) => void;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextType>({
  accessToken: null,
  login: () => {},
  logout: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [accessToken, setaccessToken] = useState<string | null>(localStorage.getItem("accessToken"));

  const login = (newaccessToken: string) => {
    setaccessToken(newaccessToken);
    localStorage.setItem("accessToken", newaccessToken);
  };

  const logout = () => {
    setaccessToken(null);
    localStorage.removeItem("accessToken");
  };

  return (
    <AuthContext.Provider value={{ accessToken, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};