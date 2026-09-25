import React, { createContext, useContext, useEffect, useState } from "react";
import { HubConnection, HubConnectionBuilder } from "@microsoft/signalr";
import { AuthContext } from "./AuthContext";

interface SignalRContextType {
    connection: HubConnection | null;
}
const CHAT_HUB_URL = import.meta.env.VITE_API_CHAT_URL
export const SignalRContext = createContext<SignalRContextType>({ connection: null });

export const SignalRProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { accessToken } = useContext(AuthContext);
    const [connection, setConnection] = useState<HubConnection | null>(null);

    useEffect(() => {
        if (!accessToken) return;

        const newConnection = new HubConnectionBuilder()
            .withUrl(CHAT_HUB_URL, { accessTokenFactory: () => accessToken })
            .withAutomaticReconnect()
            .build();

        newConnection.start()
            .then(() => {
                setConnection(newConnection);
            })
            .catch((err) => console.error(err));

        return () => {
            newConnection.stop();
        };
    }, [accessToken]);

    return (
        <SignalRContext.Provider value={{ connection }}>
            {children}
        </SignalRContext.Provider>
    );
};