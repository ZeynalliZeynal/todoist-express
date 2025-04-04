import "dotenv/config";
import { node_env, port } from "./constants/env";
import { Error } from "mongoose";
import app from "./app";
import connectToDatabase from "./lib/mongo/mongo";
import { initializeScheduler } from "./schedules";
import { createServer } from "node:http";
import { connectToSocket } from "./socket";

process.on("uncaughtException", (error: Error) => {
  console.log("Uncaught Exception!");
  console.log(error.name, error.message);
  process.exit(1);
});

export const appServer = createServer(app);

const server = appServer.listen(port, async () => {
  console.log(`[${node_env}] Server is running on port ${port}`);
  await connectToDatabase();
  initializeScheduler();
  await connectToSocket();
});

process.on("unhandledRejection", (error: Error) => {
  console.log("Unhandled Rejection!");
  console.log(error.name, error.message, error);
  server.close(() => {
    console.error("Server is shutdown.");
    process.exit(1);
  });
});

process.on("uncaughtException", (error: Error) => {
  console.log("Uncaught Exception!");
  console.log(error.name, error.message);
  server.close(() => {
    console.error("Server is shutdown.");
    process.exit(1);
  });
});
