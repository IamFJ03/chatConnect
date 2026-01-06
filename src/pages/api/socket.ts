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

      socket.on("fetchMessages", async (info) => {
        console.log(info, "at backend");
        const fetched = await pool.query(`select * from "Messages" where ("senderId"=$1 and "recieverId"=$2) or ("recieverId"=$1 and "senderId"=$2)`, [info.senderId, info.recieverId]);
        if (fetched.rows.length === 0) console.log("No User Exists");

        const fetchedData = fetched.rows[0];
        console.log(fetchedData, "at Backed");
        socket.emit("sendingFetchedData", fetchedData);
      })

      socket.on("sendMessage", async (data) => {
        const reciever = UserMapping.get(data.recieverId);
        console.log("Recieved data at backend", data);
        console.log("sender Id:", data.id, "reciever Id:", data.recieverId);
        const checkUsers = await pool.query(`select * from "Messages" where ("senderId"=$1 and "recieverId"=$2) or ("recieverId"=$1 and "senderId"=$2)`, [data.id, data.recieverId]);
        let newMsg;
        if (checkUsers.rows.length > 0) {
          await pool.query(`
  UPDATE "Messages"
  SET messages = array_append(
    messages,
    jsonb_build_object(
      'senderId', $1::text,
      'text', $2::text,
      'createdAt', now()
    )::text
  )
  WHERE id = $3
`, [data.id, data.message, checkUsers.rows[0].id]);
          console.log("Message inserted in database")
        }
        else {
          await pool.query(`insert into "Messages"("senderId", "recieverId", messages) values($1, $2, Array[jsonb_build_object('senderId', $1::text, 'text', $3::text, 'createdAt', now())]) returning *`, [data.id, data.recieverId, data.message]);
          console.log("Message inserted in database")
        }

        const updatedConversation = {
          senderId: data.id,
          recieverId: data.recieverId,
          message: data.message
        }
        console.log(updatedConversation);
        if (reciever)
          io.to(reciever).emit("recieveMessage", updatedConversation);
      })

      socket.on("disconnect", () => {
        console.log("Client disconnected:", socket.id);
      });
    });
  }

  res.end();
}
