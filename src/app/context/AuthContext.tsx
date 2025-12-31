"use client"

import react, { useState, createContext, useContext, ReactNode } from 'react';

type User = {
    id: number,
    username: string,
    email: string
}

type AuthContextType = {
    user: User | null,
    setUser: React.Dispatch<React.SetStateAction<User | null>>
}

const authContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    return (
        <authContext.Provider value={{ user, setUser }}>
            {children}
        </authContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(authContext);
    if (!context) {
        throw new Error("useAuth must be used within AuthProvider");
    }

    return context;
}