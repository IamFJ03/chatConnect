"use client"

import { useState } from "react"
import Link from "next/link"
import { UserCircle } from "lucide-react"
export default function Navbar(){
  const[isProfile, setIsProfile] = useState(false)
    return (
        <div className="relative flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
        <p className="text-xl md:text-2xl font-semibold">Dashboard</p>
        <div className="flex gap-6 text-sm md:text-lg items-center">
          <Link href="/notification">Notifications</Link>
          <Link href="/contacts">Contacts</Link>
          <UserCircle size={25} color="white" className="cursor-pointer" onClick={() => setIsProfile(true)}/>
        </div>
        <div className={`absolute h-screen md:w-[25%] bg-gray-600 -top-10 ${isProfile ? 'right-0 scale-100 duration-100' : '-right-100 scale-0 duration-1000'} transition-all duration-500`}>

        </div>
      </div>
    )
}