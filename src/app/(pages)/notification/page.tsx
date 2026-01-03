"use client"

import { useEffect,useState } from "react";
import { useAuth } from "@/app/context/AuthContext"

type notificationType = [{
    id: number,
    sender: string,
    reciever: string,
    status: string
}]

export default function Notification() {
    const { user } = useAuth();
    const[notifications, setNotifications] = useState<notificationType | null>(null)
    useEffect(() => {
        if(!user) return;

        const fetchNotifications = async () => {
            const res = await fetch(`/api/connection/notification?s=${encodeURIComponent(user.id.toString())}`, {
                method: "GET",
            })

            if(!res.ok) throw new Error("Error while fetching notifications");

            const data = await res.json();
            console.log(data?.message);
            console.log(data?.notification);
            setNotifications(data?.notification)
        }
        fetchNotifications();
    }, [])

    return (
        <div>
            <h2>Notification Page</h2>

            {notifications?.map((item) => (
                <div key={item.id.toString()} className="bg-gray-800 w-[90%] py-2 px-5 rounded ml-[5%] mt-10">
                    <p>Sender:{item.sender}</p>
                    <p>You: {item.reciever}</p>
                </div>
            ))}
        </div>
    )
}