"use client"

import { useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { UserCircle, X, LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const [isProfile, setIsProfile] = useState(false);
  const [preview, setPreview] = useState("");
  const { user, setUser } = useAuth();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleLogOut = async () => {
    console.log("LoggedOut")
    const res = await fetch("/api/auth/logout",{
      method:"POST",
      credentials: "include"
    });
    if (!res.ok) throw new Error("Something went wrong while Logging out!");

    const data = await res.json();
    if (data.message === "Logged out successfully")
      router.replace("/authentication")
  }

  const handleImageUpload = async (e: any) => {
    const file = e.target.files[0];
    if (!file || !user?.username) return;

    const formdata = new FormData();
    formdata.append("profilePicture", file);
    formdata.append("username", user.username);
    const imageURL = URL.createObjectURL(file);
    const res = await fetch("/api/connection/user", {
      method: "POST",
      body: formdata
    });

    if (!res.ok) console.log("Something went wrong while profile picture uploading...")
    setUser(prev => {
      if (!prev) return prev;

      return {
        ...prev,
        profilePicture: imageURL,
      };
    });
  }

  return (
    <div className="relative flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
      <p className="text-xl md:text-2xl font-semibold">Dashboard</p>
      <div className="flex gap-6 text-sm md:text-lg items-center">
        <Link href="/notification">Notifications</Link>
        <Link href="/contacts">Contacts</Link>
        {
          user?.profilePicture
            ?
            <Image src={user?.profilePicture} alt="profile image" width={30} height={30} unoptimized className="rounded-full h-10 w-10 cursor-pointer" onClick={() => setIsProfile(true)} />
            :
            <UserCircle size={25} color="white" className="cursor-pointer" onClick={() => setIsProfile(true)} />
        }
      </div>
      <div className={`absolute h-screen md:w-[20%] w-[65%] rounded-2xl bg-gray-600 md:-top-10 -top-5 ${isProfile ? 'right-0 scale-100 ' : '-right-100 scale-0 '} transition-all duration-500`}>
        <X size={25} color="gray" className="absolute right-5 top-5 cursor-pointer" onClick={() => setIsProfile(false)} />
        <div>
          <div className="w-full flex flex-col items-center border-b border-gray-800">
            <div className="bg-black w-fit h-fit rounded-full mt-15">
              {
                user?.profilePicture
                  ?
                  <Image src={user?.profilePicture} alt="Profile image" width={300} height={300} unoptimized className="h-30 w-30 rounded-full" />
                  :
                  <UserCircle size={80} color="gray" onClick={() => fileInputRef.current?.click()} />
              }
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
            />
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