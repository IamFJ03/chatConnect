"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/app/context/AuthContext";
import { io, Socket } from "socket.io-client";

let socket: Socket;

export default function Dashboard() {
  const { user } = useAuth();
  const [msg, setMsg] = useState("");
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

  const handleSearchUser = () => {
    socket.emit("searchUser", searchUser);
  }

  return (
    <div>
      <h2>Dashboard Page</h2>
      <p>Search User</p>
      <input type="text" value={searchUser} onChange={(e) => setSearchUser(e.target.value)} placeholder="Search User..." className="border border-gray-600" /><button onClick={handleSearchUser}>Search</button>
    </div>
  );
}
