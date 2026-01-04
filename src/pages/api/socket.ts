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
    const io = new Server(res.socket.server, {
      path: "/api/socket",
      cors: {
        origin: "*"
      }
    });

    res.socket.server.io = io;
    const UserMapping = new Map<string, string>()
    io.on("connection", (socket) => {
      console.log("New client connected:", socket.id);

      socket.on("userRegister", (user) => {
        UserMapping.set(user.id, socket.id);
        console.log("User", user.id, "Mapped to:", socket.id);
      })

      socket.on("searchUser", async (searchUser) => {
        console.log("User to be Searched...", searchUser);
        const searched = await pool.query("select * from users where username = $1", [searchUser]);
        if (searched.rows.length > 0) console.log("User Found")
      })

      socket.on("permissionRequest", async (newPermission) => {
        console.log("Server Triggered... got data...", newPermission);
        const reciever = UserMapping.get(newPermission.recieverId);
        const checkPermission = await pool.query(`select * from "MessagePermission" where ("senderId" = $1 and "recieverId" = $2) or ("recieverId" = $1 and "senderId" = $2)`, [newPermission.senderId, newPermission.recieverId]);
        console.log(checkPermission.rows.length);
        let setPermissionDB;
        if (checkPermission.rows.length > 0) {
          if (checkPermission.rows[0].status === "accepted") {
            console.log("Has Been Accepted");
            return;
          }
        }

        else if (checkPermission.rows.length === 0) {
          setPermissionDB = await pool.query(`insert into "MessagePermission"("senderId", sender, "recieverId", reciever) values($1, $2, $3, $4) returning *`, [newPermission.senderId, newPermission.sender, newPermission.recieverId, newPermission.reciever]);
          console.log(checkPermission);
          console.log(checkPermission.rows[0]);
        }


        const sender = setPermissionDB?.rows[0];
        console.log(sender);
        if (reciever && setPermissionDB)
          io.to(reciever).emit("request", sender);
      })
 
      socket.on("sendMessage", (data) => {
        const reciever = UserMapping.get(data.id);
        console.log("Recieved data at backend", data);
        console.log("sender Id:", socket.id, "reciever Id:", reciever);
        if(reciever)
          io.to(reciever).emit("recieveMessage", data);
      })

      socket.on("disconnect", () => {
        console.log("Client disconnected:", socket.id);
      });
    });
  }

  res.end();
}
