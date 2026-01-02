"use client"

import { useAuth } from "@/app/context/AuthContext"

export default function Notification(){
    const {user} = useAuth();
    return (
        <div>
            <h2>Notification Page</h2>
            <p>{user?.username}</p>
            <p>{user?.id}</p>
        </div>
    )
}