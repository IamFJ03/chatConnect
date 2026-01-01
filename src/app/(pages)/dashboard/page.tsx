"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/app/context/AuthContext";
import { io, Socket } from "socket.io-client";

let socket: Socket;

type SearchedUser = {
  id: number,
  username: string,
  emai: string
}

export default function Dashboard() {
  const { user } = useAuth();
  const [msg, setMsg] = useState("");
  const[searchedUser, setSearchedUser] = useState<SearchedUser | null>(null);
  const [searchUser, setSearchUser] = useState("");

  useEffect(() => {
    if (!user) return;

    socket = io("/", {
      path: "/api/socket"
    });
    console.log("User data", user);

    socket.on("connect", () => {
      console.log("Connected with ID:", socket.id);
      socket.emit("userRegister", { user });
    });
    
    return () => {
      
      socket.disconnect();
    };
  }, [user]);

  const handleSearchUser = async () => {
    try{
      const res = await fetch(`/api/connection/user?s=${encodeURIComponent(searchUser)}`,{
        method: "GET",
      });
      if(!res.ok) throw new Error("failed to fetch User");

      const data = await res.json();
      setSearchUser("");
      console.log(data?.data);
      setSearchedUser(data?.data)
    }
    catch (error) {
    console.error("Search error:", error);
  }
  }

  return (
    <div>
      <h2>Dashboard Page</h2>
      <div className="m-10">
      <p className="mb-5">Search User</p>
      <input type="text" value={searchUser} onChange={(e) => setSearchUser(e.target.value)} placeholder="Search User..." className="border border-gray-600 py-1 px-3 md:w-65" /><button onClick={handleSearchUser} className="ml-5 bg-gray-800 py-1 px-3 rounded cursor-pointer">Search</button>
      <div className="mt-10 bg-gray-800 md:w-65 p-5 rounded shadow shadow-gray-400 cursor-pointer hover:scale-105 transition-all duration-500">
        {searchedUser && searchedUser.username}
      </div>
      </div>
    </div>
  );
}
