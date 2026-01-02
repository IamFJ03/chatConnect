"use client"

import { useEffect } from "react";
import { useAuth } from "@/app/context/AuthContext"

export default function Notification() {
    const { user } = useAuth();
    useEffect(() => {
        if(!user) return;

        const fetchNotifications = async () => {
            const res = await fetch(`/api/connection/notification?s=${encodeURIComponent(user.id.toString())}`, {
                method: "GET",
            })
        }
        fetchNotifications();
    }, [])

    return (
        <div>
            <h2>Notification Page</h2>
            <p>{user?.username}</p>
            <p>{user?.id}</p>
        </div>
    )
}