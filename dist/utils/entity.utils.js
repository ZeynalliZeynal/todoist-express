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
exports.getEntityByType = getEntityByType;
const http_status_codes_1 = require("http-status-codes");
const project_model_1 = __importDefault(require("../model/project.model"));
const app_error_1 = __importDefault(require("./app-error"));
function getEntityByType(entityType, entityId) {
    return __awaiter(this, void 0, void 0, function* () {
        switch (entityType) {
            case "PROJECT":
                return yield project_model_1.default.findById(entityId);
            default:
                throw new app_error_1.default("Invalid entity type", http_status_codes_1.StatusCodes.BAD_REQUEST);
        }
    });
}
