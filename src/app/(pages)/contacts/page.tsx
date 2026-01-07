"use client"

import { useState } from "react"
import Navbar from "@/app/components/navbar"

type ContactType = {
    id: number,
    reciever: string,
    email: string
}[]

export default function Contacts() {
    const[contacts, setContacts] = useState<ContactType>([])
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
                        <p>{item.reciever}</p>

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