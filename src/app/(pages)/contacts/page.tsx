"use client"

import { useState, useEffect } from "react"
import Navbar from "@/app/components/navbar"
import { useAuth } from "@/app/context/AuthContext"
import ChatScreen from "@/app/components/chatScreen"
import { useUser } from "@/app/context/UserContext";
type ContactType = {
    id: number,
    contact: string
}[]

export default function Contacts() {
    const { setChatUser, chatUser } = useUser();
    const { user } = useAuth();
    const [contacts, setContacts] = useState<ContactType>([])
    useEffect(() => {
        const fetchContacts = async () => {
            try {
                const res = await fetch(`/api/connection/contacts?c=${user?.id}`, {
                    method: "GET"
                });

                if (!res.ok)
                    console.log("Might be some issue while fetching data from Server");

                const data = await res.json();
                const formattedContacts = data.Contacts.map((item: any) => ({
                id: item.id,
                contact: item.sender === user?.username ? item.reciever : item.sender
                }));

                setContacts(formattedContacts);
            }
            catch (err) {
                console.log("Error", err)
            }
        }

        fetchContacts();
    }, [user]);

    const handleContactUser = async (user: string) => {
        try {
            const res = await fetch(
                `/api/connection/user?s=${encodeURIComponent(user)}`
            );
            if (!res.ok) throw new Error("Failed to fetch user");
            const data = await res.json();
            setChatUser(data?.data);
            
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="min-h-screen p-4 md:p-8">
            <Navbar />
            
            <div className="flex flex-col md:flex-row items-center gap-10">
                <div className="flex flex-col px-10 gap-5 border border-gray-600 p-5 rounded-2xl w-[95%] md:w-[30%] md:h-[80vh]">
                {
                    contacts
                        ?
                        contacts?.map((item) => (
                            <div key={item.id.toString()} onClick={() => handleContactUser(item.contact)} className="bg-gray-800 w-[90%] md:w-90 py-2 md:py-5 px-5 rounded  flex flex-col gap-5 cursor-pointer hover:scale-105 hover:-translate-y-2 transition-all duration-500">
                                <p>{item.contact}</p>

                            </div>
                        ))
                        :
                        <div>
                            <p className="text-gray-400 text-lg">No Contacts...</p>
                        </div>
                }
            </div>
            <div className="w-full md:w-[70%] h-[65vh] md:h-[80vh] border border-gray-600 rounded-2xl flex">
                      <ChatScreen
                        chatUser={chatUser!}
                        currentUserId={user?.id!}
                      />
                    </div>
            </div>
        </div>
    )
}