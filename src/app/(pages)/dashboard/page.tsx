"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/app/context/AuthContext";
import { io, Socket } from "socket.io-client";

let socket: Socket;

export default function Dashboard() {
  const { user } = useAuth();
  const [msg, setMsg] = useState("");
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

  const handleSendMg = () => {
    console.log("Message to be sent:", msg);
    socket.emit("message",{ReceiverId: user?.id, message: msg});
  }

  return (
    <div>
      <h2>Dashboard Page</h2>
      <input type="text" value={msg} onChange={(e) => setMsg(e.target.value)} placeholder="Send Message..." className="border border-gray-600" /><button onClick={handleSendMg}>Send</button>
    </div>
  );
}
