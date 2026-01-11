"use client"

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { UserCircle, X, LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const [isProfile, setIsProfile] = useState(false);
  const { user } = useAuth();
  const router = useRouter();

  const handleLogOut = () => {
    console.log("LoggedOut")
    router.replace("/authentication")
  }

  return (
    <div className="relative flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
      <p className="text-xl md:text-2xl font-semibold">Dashboard</p>
      <div className="flex gap-6 text-sm md:text-lg items-center">
        <Link href="/notification">Notifications</Link>
        <Link href="/contacts">Contacts</Link>
        <UserCircle size={25} color="white" className="cursor-pointer" onClick={() => setIsProfile(true)} />
      </div>
      <div className={`absolute h-screen md:w-[20%] rounded-2xl bg-gray-600 -top-10 ${isProfile ? 'right-0 scale-100 ' : '-right-100 scale-0 '} transition-all duration-500`}>
        <X size={25} color="gray" className="absolute right-5 top-5 cursor-pointer" onClick={() => setIsProfile(false)} />
        <div>
          <div className="w-full flex flex-col items-center border-b border-gray-800">
            <div className="bg-black w-fit h-fit rounded-full mt-15">
              <UserCircle size={80} color="gray" />
            </div>
            <p className="text-gray-800 text-2xl font-bold my-5">{user?.username}</p>
          </div>
          <div className="p-5 absolute bottom-0 w-full">
            <p className="pb-3 text-xl text-gray-800 font-bold border-b border-gray-800">{user?.email}</p>
            <div className="flex items-center pt-3 gap-3 cursor-pointer">
              <LogOut size={40} color="gray" onClick={handleLogOut} /><p className="text-gray-800 text-lg font-semibold" onClick={handleLogOut}>Logout</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}