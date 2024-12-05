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
require("dotenv/config");
const env_1 = require("./constants/env");
const app_1 = __importDefault(require("./app"));
const mongo_1 = __importDefault(require("./lib/mongo"));
process.on("uncaughtException", (error) => {
    console.log("Uncaught Exception!");
    console.log(error.name, error.message);
    process.exit(1);
});
const server = app_1.default.listen(env_1.port, () => __awaiter(void 0, void 0, void 0, function* () {
    console.log(`[${env_1.node_env}] Server is running on port ${env_1.port}`);
    yield (0, mongo_1.default)();
}));
process.on("unhandledRejection", (error) => {
    console.log("Unhandled Rejection!");
    console.log(error.name, error.message, error);
    server.close(() => {
        console.error("Server is shutdown.");
        process.exit(1);
    });
});
process.on("uncaughtException", (error) => {
    console.log("Uncaught Exception!");
    console.log(error.name, error.message);
    server.close(() => {
        console.error("Server is shutdown.");
        process.exit(1);
    });
});
