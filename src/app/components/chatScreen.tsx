"use client"
import { useSocket } from "../context/socketContext";
import { useState, useEffect } from "react";
type chatUserProps = {
    chatUser: {
        id: number,
        username: string,
        email: string
    }
}

export default function ChatScreen({ chatUser }: chatUserProps) {
    const {socket} = useSocket();
    const[msg, setMsg] = useState("");

    useEffect(() => {
      if(socket)
        socket?.on("recieveMessage", (receivedMessage) => {
            console.log("Message Recieved", receivedMessage.message);
        })
    },[])

    const handleSend = async () => {
        const sendingData = {
            id: chatUser?.id,
            username: chatUser.username,
            email: chatUser.email,
            message: msg
        }
        socket?.emit("sendMessage", sendingData);
        setMsg("");
    }

    return (

        <div className="flex flex-col w-full">
            {chatUser ?
                <>
                    <div className="flex-1">

                        <div className="bg-gray-600 rounded-t-2xl px-10 py-5">
                            <p>{chatUser.username}</p>
                        </div>

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