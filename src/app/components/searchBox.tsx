"use client"

import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useSocket } from "../context/socketContext";
import { useUser } from "../context/UserContext";
type SearchedUser = {
    id: number;
    username: string;
    email: string;
};

type permissionInfo = {
    senderId: number;
    sender: string;
    recieverId: number;
    reciever: string;
};

export default function SearchBox() {
    const { socket } = useSocket();
    const [permissionModal, setPermissionModal] = useState(false);
    const [notificationModal, setNotificationModal] = useState(false);
    const [modalInfo, setModalInfo] = useState<permissionInfo | null>(null);
    const [searchedUser, setSearchedUser] = useState<SearchedUser | null>(null);
    const {chatUser, setChatUser} = useUser();
    const { user } = useAuth();
    const [searchUser, setSearchUser] = useState("");

    useEffect(() => {
        socket?.on("request", (data) => {
            setNotificationModal(true);
            setModalInfo(data);
        });

        return () => {
            socket?.off("request");
        };
    }, [])

    const handleSearchUser = async () => {
        try {
            const res = await fetch(
                `/api/connection/user?s=${encodeURIComponent(searchUser)}`
            );
            if (!res.ok) throw new Error("Failed to fetch user");
            const data = await res.json();
            setSearchedUser(data?.data);
            setSearchUser("");
        } catch (err) {
            console.error(err);
        }
    };

    const handleStatus = async () => {
        try {
            if (!searchedUser) return;

            const res = await fetch(
                `/api/connection/status?s=${searchedUser.id}&senderId=${user?.id}`
            );

            const data = await res.json();

            if (data?.message === "Message not been sent or accepted") {
                setPermissionModal(true);
                return;
            }

            setChatUser(searchedUser);
        } catch (err) {
            console.error(err);
        }
    };

    const handlePermission = () => {
        const newPermission = {
            senderId: user?.id,
            sender: user?.username,
            recieverId: searchedUser?.id,
            reciever: searchedUser?.username,
        };

        socket?.emit("permissionRequest", newPermission);
        setPermissionModal(false);
    };
    return (
        <div>
            <div className="flex flex-col md:flex-row gap-3">
                <input
                    type="text"
                    value={searchUser}
                    onChange={(e) => setSearchUser(e.target.value)}
                    placeholder="Search user..."
                    className="border border-gray-600 rounded px-3 py-2 w-full"
                />
                <button
                    onClick={handleSearchUser}
                    className="bg-gray-800 rounded px-4 py-2"
                >
                    Search
                </button>
            </div>

            {searchedUser && (
                <div
                    onClick={handleStatus}
                    className="mt-6 bg-gray-800 p-4 rounded cursor-pointer hover:scale-105 transition"
                >
                    {searchedUser.username}
                </div>
            )}

            {notificationModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
                    <div className="w-[90%] md:w-[400px] bg-gray-800 rounded-2xl p-6 relative">
                        <X
                            className="absolute top-4 right-4 cursor-pointer"
                            onClick={() => setNotificationModal(false)}
                        />

                        <p className="mb-4">
                            Got a new request from someone you might know
                        </p>

                        <p className="mb-2">You: {modalInfo?.reciever}</p>
                        <p className="mb-4">Sender: {modalInfo?.sender}</p>

                        <div className="flex gap-4">
                            <button
                                className="bg-gray-900 px-4 py-2 rounded"
                                onClick={() => setNotificationModal(false)}
                            >
                                Accept
                            </button>
                            <button
                                className="bg-gray-900 px-4 py-2 rounded"
                                onClick={() => setNotificationModal(false)}
                            >
                                Decline
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* PERMISSION MODAL */}
            {permissionModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
                    <div className="w-[90%] md:w-[400px] bg-gray-800 rounded-2xl p-6 relative">
                        <X
                            className="absolute top-4 right-4 cursor-pointer"
                            onClick={() => setPermissionModal(false)}
                        />

                        <p className="mb-4">
                            Request permission to start chatting
                        </p>

                        <p className="mb-2">You: {user?.username}</p>
                        <p className="mb-4">Receiver: {searchedUser?.username}</p>

                        <div className="flex gap-4">
                            <button
                                className="bg-gray-900 px-4 py-2 rounded"
                                onClick={() => setPermissionModal(false)}
                            >
                                Cancel
                            </button>
                            <button
                                className="bg-gray-900 px-4 py-2 rounded"
                                onClick={handlePermission}
                            >
                                Send
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}