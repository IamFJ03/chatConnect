"use client"

import { useState, useEffect } from "react"
import Navbar from "@/app/components/navbar"
import { useAuth } from "@/app/context/AuthContext"
type ContactType = {
    id: number,
    contact: string
}[]

export default function Contacts() {
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


    return (
        <div className="min-h-screen p-4 md:p-8">
            <Navbar />
            <h2 className="mt-10 text-2xl">Contacts:</h2>
            <div className="mt-10 flex flex-col gap-5 border border-gray-600 p-5 rounded">
                {
                    contacts
                        ?
                        contacts?.map((item) => (
                            <div key={item.id.toString()} className="bg-gray-800 w-[90%] md:w-100 py-2 md:py-5 px-5 rounded ml-[5%] flex flex-col gap-5">
                                <p>{item.contact}</p>

                            </div>
                        ))
                        :
                        <div>
                            <p className="text-gray-400 text-lg">No Contacts...</p>
                        </div>
                }
            </div>
        </div>
    )
}