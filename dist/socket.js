"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectToSocket = void 0;
const socket_io_1 = require("socket.io");
const env_1 = require("./constants/env");
const kleur_1 = __importDefault(require("kleur"));
const index_1 = require("./index");
const user_model_1 = __importDefault(require("./model/user.model"));
const onlineUsers = new Map();
const connectToSocket = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const io = new socket_io_1.Server(index_1.appServer, {
            cors: {
                origin: env_1.node_env === "development" ? env_1.client_dev_origin : env_1.client_prod_origin,
                methods: ["GET", "POST"],
            },
        });
        io.on("connection", (socket) => {
            console.log(kleur_1.default.bgBlue("Connected to Socket"));
            const userId = socket.handshake.query.userId;
            onlineUsers.set(userId, socket.id);
            socket.emit("onlineUsers", Array.from(onlineUsers.keys()));
            if (userId) {
                user_model_1.default.findByIdAndUpdate(userId, {
                    online: true,
                    lastOnline: null,
                }, { new: true }).then((user) => {
                    io.emit("user:status:change", { userId, online: true });
                    console.log(kleur_1.default.green(`🟢 ${user === null || user === void 0 ? void 0 : user.email} is online`));
                });
            }
            socket.on("disconnect", () => {
                if (userId) {
                    user_model_1.default.findByIdAndUpdate(userId, {
                        online: false,
                        lastOnline: new Date(),
                    }, { new: true }).then((user) => {
                        onlineUsers.delete(userId);
                        console.log(kleur_1.default.red(`🔴 ${user === null || user === void 0 ? void 0 : user.email} is offline`));
                        socket.emit("onlineUsers", Array.from(onlineUsers.keys()));
                        io.emit("user:status:change", { userId, online: false });
                    });
                }
            });
        });
    }
    catch (err) {
        console.log(err);
    }
});
exports.connectToSocket = connectToSocket;
