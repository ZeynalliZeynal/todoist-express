import { Server } from "socket.io";
import {
  client_dev_origin,
  client_prod_origin,
  node_env,
} from "./constants/env";
import kleur from "kleur";
import { appServer } from "./index";
import UserModel from "./model/user.model";

const onlineUsers = new Map();

export const connectToSocket = async () => {
  try {
    const io = new Server(appServer, {
      cors: {
        origin:
          node_env === "development" ? client_dev_origin : client_prod_origin,
        methods: ["GET", "POST"],
      },
    });

    io.on("connection", (socket) => {
      const userId = socket.handshake.query.userId as string;
      onlineUsers.set(userId, socket.id);

      socket.emit("onlineUsers", Array.from(onlineUsers.keys()));

      if (userId) {
        UserModel.findByIdAndUpdate(
          userId,
          {
            online: true,
            lastOnline: null,
          },
          { new: true },
        ).then((user) => {
          io.emit("user:status:change", { userId, online: true });
          console.log(kleur.green(`🟢 ${user?.email} is online`));
        });
      }

      socket.on("disconnect", () => {
        if (userId) {
          UserModel.findByIdAndUpdate(
            userId,
            {
              online: false,
              lastOnline: new Date(),
            },
            { new: true },
          ).then((user) => {
            onlineUsers.delete(userId);
            console.log(kleur.red(`🔴 ${user?.email} is offline`));
            socket.emit("onlineUsers", Array.from(onlineUsers.keys()));
            io.emit("user:status:change", { userId, online: false });
          });
        }
      });
    });
  } catch (err) {
    console.log(err);
  }
};
