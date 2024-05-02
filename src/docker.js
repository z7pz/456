"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createContainer = exports.listContainers = exports.docker = void 0;
const dockerode_1 = __importDefault(require("dockerode"));
exports.docker = new dockerode_1.default();
function listContainers() {
    return exports.docker.listContainers({ all: true });
}
exports.listContainers = listContainers;
function createContainer(image_name, token) {
    return new Promise((res, rej) => {
        exports.docker.createContainer({
            HostConfig: {},
            Image: image_name,
            Tty: false,
            Env: ["DISCORD_TOKEN=" + token],
        }, async function (err, container) {
            if (err) {
                return rej(err);
            }
            else if (container) {
                try {
                    await container.start();
                }
                catch (err) {
                    rej(`err: ${err}`);
                }
                return res(container);
            }
            return rej();
        });
    });
}
exports.createContainer = createContainer;
