import { Server } from "socket.io";
import { NextApiRequest } from "next";
import { NextApiResponseServerIO } from "@/types/next";
import { pool } from "@/lib/db";
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
        UserMapping.set(user.id, socket.id);
        console.log("User",user.id,"Mapped to:",socket.id);
      })

      socket.on("searchUser", async (searchUser) => {
          console.log("User to be Searched...", searchUser);
          const searched = await pool.query("select * from users where username = $1",[searchUser]);
          if(searched.rows.length>0) console.log("User Found")
      })

      socket.on("permissionRequest", (newPermission) => {
          console.log("Server Triggered... got data...", newPermission);
          const reciver = UserMapping.get(newPermission.receiverId);

          if(reciver) 
            io.to(reciver).emit("request", newPermission);
      })
      
      socket.on("disconnect", () => {
        console.log("Client disconnected:", socket.id);
      });
    });
  }

  res.end();
}
