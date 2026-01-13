"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/app/context/AuthContext";
import { useSocket } from "@/app/context/socketContext";
import Navbar from "@/app/components/navbar";
import ChatScreen from "@/app/components/chatScreen";
import SearchBox from "@/app/components/searchBox";
import { useUser } from "@/app/context/UserContext";
import Link from "next/link";



export default function Dashboard() {
  const { socket } = useSocket();
  const { user, setUser } = useAuth();
  const { chatUser } = useUser();

  useEffect(() => {
    if (!user) return;
    socket?.emit("userRegister", user);
  }, [user]);

  useEffect(() => {
    const fetchInfo = async () => {
      const res = await fetch("api/auth/me", {
        credentials: "include"
      });

      if (res.status === 401) throw new Error("Unauthorized");

      const body = await res.json();
      setUser(body.user);
    }

    fetchInfo();
  }, [])

  return (
    <div className="min-h-screen p-4 md:p-8">
      <Navbar />
      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-[30%] border border-gray-600 rounded-2xl p-5 md:p-8">
          <p className="text-lg mb-4">Search User</p>
          <SearchBox />
        </div>

        <div className="w-full md:w-[70%] h-[65vh] md:h-[80vh] border border-gray-600 rounded-2xl flex">
          <ChatScreen
            chatUser={chatUser!}
            currentUserId={user?.id!}
          />
        </div>
      </div>
    </div>
  );
}
