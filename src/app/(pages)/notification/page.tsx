"use client"

import { useEffect, useState } from "react";
import { useAuth } from "@/app/context/AuthContext";
import Navbar from "@/app/components/navbar";

type notificationType = {
    id: number,
    sender: string,
    reciever: string,
    status: string
}[]

export default function Notification() {
    const { user } = useAuth();
    const [notifications, setNotifications] = useState<notificationType>([])
    useEffect(() => {
        if (!user) return;

        const fetchNotifications = async () => {
            const res = await fetch(`/api/connection/notification?s=${encodeURIComponent(user.id.toString())}`, {
                method: "GET",
            })

            if (!res.ok) throw new Error("Error while fetching notifications");

            const data = await res.json();
            console.log(data?.message);
            console.log(data?.notification);
            setNotifications(data?.notification)
        }
        fetchNotifications();
    }, [user])

    const handleStatus = async (updateId: number, status: string) => {
        const res = await fetch("/api/connection/status", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ id: updateId, status: status })
        });

        if(!res.ok) throw new Error("Some Error");

        const data = await res.json();
        if(data?.message === "Request Deleted" || data?.message==="Update Succesfull")
            setNotifications(prev => prev?.filter((item) => item.id!==data.newNotifications.id))
        console.log(data?.message);
        console.log(data?.newNotifications);
    }

    return (
        <div className="min-h-screen p-4 md:p-8">
            <Navbar />
            <h2 className="mt-10 text-2xl">Notifications:</h2>
            <div className="mt-10 flex flex-col gap-5 border border-gray-600 p-5 rounded">
                {
                    notifications
                    ?
                    notifications?.map((item) => (
                    <div key={item.id.toString()} className="bg-gray-800 w-[90%] md:w-100 py-2 md:py-5 px-5 rounded ml-[5%] flex flex-col gap-5">
                        <p>Sender:{item.sender}</p>
                        <p>You: {item.reciever}</p>

                        <div>
                            <button className="bg-gray-900 py-1.5 px-3 cursor-pointer hover:scale-110 transition-all duration-500 rounded shadow shadow-white" onClick={() => handleStatus(item.id, "accept")}>Accept</button>
                            <button className="bg-gray-900 py-1.5 px-3 ml-5 cursor-pointer hover:scale-110 transition-all duration-500 rounded shadow shadow-white" onClick={() => handleStatus(item.id, "reject")}>Reject</button>
                        </div>
                    </div>
                ))
                :
                <div>
                    <p className="text-gray-400 text-lg">No new Notifications...</p>
                </div>
                }
            </div>
        </div>
    )
}