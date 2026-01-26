"use client"
import react, { useState, useContext, createContext, ReactNode, useEffect, useRef } from "react";
import { io, Socket } from 'socket.io-client'


type socketContextType = {
    socket: Socket | null,
    setSocket: React.Dispatch<React.SetStateAction<Socket | null>>
}

const socketContext = createContext<socketContextType | null>(null)

export const useSocket = () => {
    const ctx = useContext(socketContext);
    if (!ctx) throw new Error("useSocket must be inside socket provider");

    return ctx
}

export function SocketProvider({
    children
}: {
    children: ReactNode
}) {
    const [socket, setSocket] = useState<Socket | null>(null)
    const socketRef = useRef<Socket | null>(null)
    useEffect(() => {
        if (socketRef.current) return;
        const socketInstance = io("https://chatconnect-m4d5.onrender.com")
        
        socketRef.current = socketInstance;
        setSocket(socketInstance);
    }, [])
    return (
        <socketContext.Provider value={{ socket, setSocket }}>
            {children}
        </socketContext.Provider>
    )
}