import { Server } from "socket.io";
import {
  client_dev_origin,
  client_prod_origin,
  node_env,
} from "./constants/env";
import kleur from "kleur";
import { appServer } from "./index";

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
      console.log(
        kleur.bgYellow(
          `Connected to socket at ${new Date(socket.handshake.time).toLocaleString()}`,
        ),
      );
    });
  } catch (err) {
    console.log(err);
  }
};
