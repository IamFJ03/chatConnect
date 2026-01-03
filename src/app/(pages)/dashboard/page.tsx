"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/app/context/AuthContext";
import { useSocket } from "@/app/context/socketContext";

import { X } from "lucide-react";
import Link from "next/link";



type SearchedUser = {
  id: number,
  username: string,
  email: string
}

type permissionInfo = {
  senderId: number,
  sender: string,
  receiverId: number,
  receiver: string
}

export default function Dashboard() {
  const {socket} = useSocket();
  const { user } = useAuth();
  const [permissionModal, setPermissionModal] = useState(false);
  const [modalInfo, setModalInfo] = useState<permissionInfo | null>(null);
  const [notificationModal, setNotificationModal] = useState(false);
  const [searchedUser, setSearchedUser] = useState<SearchedUser | null>(null);
  const [searchUser, setSearchUser] = useState("");

  useEffect(() => {
    if (!user) return;

    console.log("User data", user);
    
    socket?.emit("userRegister", user)

    socket?.on("request", (data) => {
      console.log("Request Recieved From:", data.sender, data);
      setNotificationModal(true);
      setModalInfo(data);
    })

    return () => {
      socket?.off("request");
    };
  }, [user]);

  const handleSearchUser = async () => {
    try {
      const res = await fetch(`/api/connection/user?s=${encodeURIComponent(searchUser)}`, {
        method: "GET",
      });
      if (!res.ok) throw new Error("failed to fetch User");

      const data = await res.json();
      setSearchUser("");
      console.log(data?.data);
      setSearchedUser(data?.data)
    }
    catch (error) {
      console.error("Search error:", error);
    }
  }

  const handlePermission = () => {
    const newPermission = {
      senderId: user?.id,
      sender: user?.username,
      recieverId: searchedUser?.id,
      reciever: searchedUser?.username
    }

    console.log("Permission Request:", newPermission);

    socket?.emit("permissionRequest", newPermission);
    setPermissionModal(false);
  }

  return (
    <div>
      <h2>Dashboard Page</h2>
      <Link href={"/notification"}>Notifications</Link>
      <div className="m-10">
        <p className="mb-5">Search User</p>

        <input type="text" value={searchUser} onChange={(e) => setSearchUser(e.target.value)} placeholder="Search User..." className="border border-gray-600 py-1 px-3 md:w-65" /><button onClick={handleSearchUser} className="ml-5 bg-gray-800 py-1 px-3 rounded cursor-pointer">Search</button>
        {searchedUser &&
          <div className="mt-10 bg-gray-800 md:w-65 p-5 rounded shadow shadow-gray-400 cursor-pointer hover:scale-105 transition-all duration-500" onClick={() => setPermissionModal(true)}>
            {searchedUser?.username}
          </div>}
      </div>
      <div className={`fixed inset-0 ${notificationModal ? 'pointer-events-auto bg-black/50 opacity-100' : 'pointer-events-none opacity-0'} transition-all duration-500`}>
        <div className="md:w-70 w-[80%] ml-[10%] mt-[25%] md:h-70 bg-gray-800 rounded-2xl md:ml-[40%] md:mt-[10%]">
          <X size={25} color="white" onClick={() => setPermissionModal(false)} className="relative md:left-60 left-75 top-3 cursor-pointer" />
          <div className="p-5 md:ml-7 ml-10 mt-3">
            <p className="md:w-50 w-55">Got a New Request from someone you might know...</p>
            <p className="my-5">You:{modalInfo?.receiver}</p>
            <p className="mb-5">Reciver: {modalInfo?.sender}</p>
            <button className="bg-gray-900 py-1.5 px-3 rounded cursor-pointer hover:scale-105 transition-all duration-500" onClick={() => setNotificationModal(false)}>Accept</button>
            <button className="ml-5 bg-gray-900 py-1.5 px-3 rounded cursor-pointer hover:scale-105 transition-all duration-500" onClick={() => {
              setNotificationModal(false)
            }}>Decline</button>
          </div>
        </div>
      </div>
      <div className={`fixed inset-0 ${permissionModal ? 'pointer-events-auto bg-black/50 opacity-100' : 'pointer-events-none opacity-0'} transition-all duration-500`}>
        <div className="md:w-70 w-[80%] ml-[10%] mt-[25%] md:h-70 bg-gray-800 rounded-2xl md:ml-[40%] md:mt-[10%]">
          <X size={25} color="white" onClick={() => setPermissionModal(false)} className="relative md:left-60 left-75 top-3 cursor-pointer" />
          <div className="p-5 md:ml-7 ml-10 mt-3">
            <p className="md:w-50 w-55">Request For Permission and start having chat...</p>
            <p className="my-5">Username:{user?.username}</p>
            <p className="mb-5">Reciver: {searchedUser?.username}</p>
            <button className="bg-gray-900 py-1.5 px-3 rounded cursor-pointer hover:scale-105 transition-all duration-500" onClick={() => setPermissionModal(false)}>Cancel</button>
            <button className="ml-5 bg-gray-900 py-1.5 px-3 rounded cursor-pointer hover:scale-105 transition-all duration-500" onClick={handlePermission}>Send</button>
          </div>
        </div>
      </div>
    </div>
  );
}
