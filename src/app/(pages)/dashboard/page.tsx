"use client";

import { useEffect } from "react";
import { useAuth } from "@/app/context/AuthContext";
import { io, Socket } from "socket.io-client";

let socket: Socket;

export default function Dashboard() {
  const {user} = useAuth();
  useEffect(() => {
    if (!user) return;

    socket = io("/",{
      path: "/api/socket"
    });
    console.log("User data", user);

    socket.on("connect", () => {
      console.log("Connected with ID:", socket.id);
      socket.emit("userRegister", {user});
    });
    
    socket.on("message", (msg) => {
      console.log("Message received:", msg);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div>
      <h2>Dashboard Page</h2>
    </div>
  );
}
