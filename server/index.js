import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import { pool } from "./db.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: "https://chat-connect-pink.vercel.app",
    credentials: true
}));

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "https://chat-connect-pink.vercel.app",
    methods: ["GET", "POST"],
    credentials: true
  },
});

const UserMapping = new Map();

io.on("connection", (socket) => {
  console.log("New client connected:", socket.id);

  socket.on("userRegister", (user) => {
    UserMapping.set(user.id, socket.id);
    console.log("User", user.id, "Mapped to:", socket.id);
  });

  socket.on("searchUser", async (searchUser) => {
    const searched = await pool.query(
      "select * from users where username = $1",
      [searchUser]
    );
    if (searched.rows.length > 0) console.log("User Found");
  });

  socket.on("permissionRequest", async (newPermission) => {
    const reciever = UserMapping.get(newPermission.recieverId);

    const checkPermission = await pool.query(
      `select * from "MessagePermission"
       where ("senderId" = $1 and "recieverId" = $2)
       or ("recieverId" = $1 and "senderId" = $2)`,
      [newPermission.senderId, newPermission.recieverId]
    );

    let setPermissionDB;

    if (checkPermission.rows.length === 0) {
      setPermissionDB = await pool.query(
        `insert into "MessagePermission"
         ("senderId", sender, "recieverId", reciever)
         values ($1, $2, $3, $4)
         returning *`,
        [
          newPermission.senderId,
          newPermission.sender,
          newPermission.recieverId,
          newPermission.reciever,
        ]
      );
    }

    const sender = setPermissionDB?.rows[0];
    if (reciever && sender) {
      io.to(reciever).emit("request", sender);
    }
  });

  socket.on("fetchMessages", async (info) => {
    const fetched = await pool.query(
      `select * from "Messages"
       where ("senderId"=$1 and "recieverId"=$2)
       or ("recieverId"=$1 and "senderId"=$2)`,
      [info.senderId, info.recieverId]
    );

    if (fetched.rows.length > 0) {
      socket.emit("sendingFetchedData", fetched.rows[0]);
    }
  });

  socket.on("sendMessage", async (data) => {
    const reciever = UserMapping.get(data.recieverId);

    const checkUsers = await pool.query(
      `select * from "Messages"
       where ("senderId"=$1 and "recieverId"=$2)
       or ("recieverId"=$1 and "senderId"=$2)`,
      [data.id, data.recieverId]
    );

    if (checkUsers.rows.length > 0) {
      await pool.query(
        `
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
        `,
        [data.id, data.message, checkUsers.rows[0].id]
      );
    } else {
      await pool.query(
        `
        insert into "Messages"("senderId", "recieverId", messages)
        values ($1, $2, ARRAY[
          jsonb_build_object(
            'senderId', $1::text,
            'text', $3::text,
            'createdAt', now()
          )
        ])
        `,
        [data.id, data.recieverId, data.message]
      );
    }

    if (reciever) {
      io.to(reciever).emit("recieveMessage", {
        senderId: data.id,
        recieverId: data.recieverId,
        message: data.message,
      });
    }
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 10000;

server.listen(PORT, () => {
  console.log(`Socket server running on ${PORT}`);
});
