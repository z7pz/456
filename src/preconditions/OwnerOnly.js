"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OwnerOnlyPrecondition = void 0;
const framework_1 = require("@sapphire/framework");
const constants_1 = require("../constants");
class OwnerOnlyPrecondition extends framework_1.Precondition {
    async messageRun(message) {
        if (!constants_1.OWNERS.includes(message.author.id))
            return this.error();
        return this.ok();
    }
}
exports.OwnerOnlyPrecondition = OwnerOnlyPrecondition;
