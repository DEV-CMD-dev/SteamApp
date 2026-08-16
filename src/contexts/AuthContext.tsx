import React, { createContext, useEffect, useState } from "react";

type AuthContextType = {
  accessToken: string | null;
  expirationTime: Date | null;
  username: string | null;
  login: (accessToken: string, expirationTime:Date, username: string) => void;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextType>({
  accessToken: null,
  expirationTime: null,
  username: null,
  login: () => {},
  logout: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [accessToken, setAccessToken] = useState<string | null>(
    localStorage.getItem("accessToken")
  );

  const [expirationTime, setExpirationTime] = useState<Date | null>(() => {
    const stored = localStorage.getItem("accessTokenExpirationTime");
    return stored ? new Date(stored) : null;
  });

  const [username, setUsername] = useState<string | null>(
    localStorage.getItem("username")
  );
  
  const login = (accessToken: string, expirationTime: Date, username: string) => {
    setAccessToken(accessToken);
    setExpirationTime(expirationTime);
    setUsername(username);

    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("accessTokenExpirationTime", expirationTime.toString());
    localStorage.setItem("username", username);
  };

  const logout = () => {
    setAccessToken(null);
    setExpirationTime(null);
    setUsername(null);

    localStorage.removeItem("accessToken");
    localStorage.removeItem("accessTokenExpirationTime");
    localStorage.removeItem("username");
  };

  return (
    <AuthContext.Provider value={{ accessToken, expirationTime, username,  login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};