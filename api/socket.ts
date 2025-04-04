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

      if (userId) {
        onlineUsers.set(userId, socket.id);
        const user = UserModel.findByIdAndUpdate(
          userId,
          {
            online: true,
            lastOnline: null,
          },
          { new: true },
        );
        io.emit("user:status:change", { userId, online: true });
        user.then((data) =>
          console.log(kleur.green(`🟢 ${data?.email} is online`)),
        );
      }

      socket.on("disconnect", () => {
        if (userId) {
          onlineUsers.delete(userId);
          const user = UserModel.findByIdAndUpdate(
            userId,
            {
              online: false,
              lastOnline: new Date(),
            },
            { new: true },
          );
          io.emit("user:status:change", { userId, online: false });
          user.then((data) =>
            console.log(kleur.red(`🔴 ${data?.email} is offline`)),
          );
        }
      });
    });
  } catch (err) {
    console.log(err);
  }
};
