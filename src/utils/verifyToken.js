"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = void 0;
const axios_1 = __importDefault(require("axios"));
async function verifyToken(token) {
    return axios_1.default.get("https://discord.com/api/users/@me", {
        headers: {
            Authorization: "Bot " + token,
        },
    });
}
exports.verifyToken = verifyToken;
