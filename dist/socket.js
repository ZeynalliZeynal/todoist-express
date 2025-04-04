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
const connectToSocket = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const io = new socket_io_1.Server(index_1.appServer, {
            cors: {
                origin: env_1.node_env === "development" ? env_1.client_dev_origin : env_1.client_prod_origin,
                methods: ["GET", "POST"],
            },
        });
        io.on("connection", (socket) => {
            console.log(kleur_1.default.bgYellow(`Connected to socket at ${new Date(socket.handshake.time).toLocaleString()}`));
        });
    }
    catch (err) {
        console.log(err);
    }
});
exports.connectToSocket = connectToSocket;
