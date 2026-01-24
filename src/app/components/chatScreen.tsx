"use client"
import { useSocket } from "../context/socketContext";
import { useState, useEffect } from "react";
import Image from "next/image";
import { UserCircle } from "lucide-react";
type chatUserProps = {
    chatUser: {
        id: number,
        username: string,
        email: string,
        profilePicture: string
    },
    currentUserId: number
}

type messageListType = {
    senderId: number,
    text: string,
    createdAt: string;
}

export default function ChatScreen({ chatUser, currentUserId }: chatUserProps) {
    const { socket } = useSocket();
    const [msg, setMsg] = useState("");
    const [messageList, setMessageList] = useState<messageListType[]>([]);

    useEffect(() => {
        if (!socket && !chatUser?.id) return;

        const fetchingInfo = {
            senderId: currentUserId,
            recieverId: chatUser?.id
        }
        socket?.emit("fetchMessages", fetchingInfo);
        socket?.on("sendingFetchedData", (data) => {
            const messages = Array.isArray(data?.messages) ? data.messages : [];
            const parsedMessage = messages.map((m: string) => typeof m === "string" ? JSON.parse(m) : m)
            console.log(parsedMessage)
            setMessageList(parsedMessage)
        })

        socket?.on("recieveMessage", (receivedMessage) => {
            console.log("Message Recieved", receivedMessage.message);

            setMessageList(prev => [...prev, { senderId: receivedMessage.senderId, text: receivedMessage.message, createdAt: new Date().toISOString() }]);
        })

        return () => {
            socket?.off("recieveMessage");
            socket?.off("sendingFetchedData");
        }
    }, [chatUser?.id])

    const handleSend = async () => {
        const sendingData = {
            id: currentUserId,
            recieverId: chatUser.id,
            username: chatUser.username,
            email: chatUser.email,
            message: msg
        }
        setMessageList(prev => [...prev, { senderId: currentUserId, text: msg, createdAt: new Date().toISOString() }])
        socket?.emit("sendMessage", sendingData);
        setMsg("");
    }

    return (

        <div className="flex flex-col w-full">
            {chatUser ?
                <>
                    <div className="flex-1">
                        <div className="bg-gray-600 rounded-t-2xl px-10 py-5 flex gap-3 items-center">
                            {
                                chatUser?.profilePicture
                                ?
                                <Image src={chatUser.profilePicture} alt="profile Picture" width={20} height={20} className="h-10 w-10 rounded-full"/>
                                :
                                <UserCircle size={25} color="gray" />
                            }
                            <p>{chatUser.username}</p>
                        </div>
                    </div>
                    <div className="flex flex-col p-5 max-h-[80%] overflow-auto">
                        {
                            messageList?.map((msg, index) => (
                                <div key={index} className={`flex px-5 py-2 mt-5  ${currentUserId === msg.senderId ? 'bg-gray-600 self-end rounded' : 'bg-gray-800 w-fit rounded'}`}>
                                    <p>{msg.text}</p>
                                </div>
                            ))
                        }
                    </div>
                    <div className="flex w-full">
                        <input type="text" value={msg} onChange={(e) => setMsg(e.target.value)} placeholder="Type Message..." className="border border-gray-600 px-3 py-1.5 rounded-t-xl flex-1" />
                        <button className="bg-gray-800 py-1.5 px-3 rounded cursor-pointer" onClick={handleSend}>Send</button>
                    </div></>
                :
                <>
                    <div className="w-full h-full flex justify-center items-center">
                        <p className="text-2xl text-gray-500">Tap on or Search Member to Start Chat...</p>
                    </div>
                </>}
        </div>
    )
}