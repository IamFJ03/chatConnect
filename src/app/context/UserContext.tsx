"use client"
import { createContext, ReactNode,useContext,useState } from "react";

type chatUserType = {
    id: number,
    username: string,
    email: string
}

type UserContextType = {
    chatUser: chatUserType | null,
    setChatUser: React.Dispatch<React.SetStateAction<chatUserType | null>>
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({
    children
}: {
    children: ReactNode
}) {
    const [chatUser, setChatUser] = useState<chatUserType | null>(null)
    return (
        <UserContext.Provider value={{chatUser, setChatUser}}>
            {children}
        </UserContext.Provider>
    )
}

export const useUser = () => {
    const context = useContext(UserContext);
    if(!context) throw new Error("useUser must be used within AuthProvider")

    return context
}