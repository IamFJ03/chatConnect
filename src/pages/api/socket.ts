import { Server } from "socket.io";
import { NextApiRequest } from "next";
import { NextApiResponseServerIO } from "@/types/next";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default function handler(req: NextApiRequest, res: NextApiResponseServerIO) {
  if (!res.socket.server.io) {
    console.log("Setting up Socket.IO server...");
    const io = new Server(res.socket.server,{
      path: "/api/socket",
      cors:{
        origin: "*"
      }
    });

    res.socket.server.io = io;
    const UserMapping = new Map<string, string>()
    io.on("connection", (socket) => {
      console.log("New client connected:", socket.id);
      
      socket.on("userRegister", ({user}) => {
        UserMapping.set(socket.id, user.id);
        console.log("User",user.id,"Mapped to:",socket.id);
      })

      socket.on("message", ({ReceiverId, message}) => {
        console.log("Receiver:", ReceiverId,"Message:", message);
        socket.broadcast.emit("receiveMessage", message);
      });
      
      socket.on("disconnect", () => {
        console.log("Client disconnected:", socket.id);
      });
    });
  }

  res.end();
}
