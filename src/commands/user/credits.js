"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreditsCommand = void 0;
const framework_1 = require("@sapphire/framework");
const getUser_1 = require("../../utils/getUser");
class CreditsCommand extends framework_1.Command {
    constructor(context, options) {
        super(context, {
            ...options,
            name: "credits",
            aliases: ["balance", "c"],
            description: "add balance",
            enabled: true,
            preconditions: [],
        });
    }
    async messageRun(message, args) {
        const userRes = await args.pickResult("user");
        const user = userRes.isErr() ? message.author : userRes.unwrap();
        const data = await (0, getUser_1.getUser)(user.id);
        return message.reply(`${user} \`${data.balance}\` <:18:1233799786982014996>.`);
    }
}
exports.CreditsCommand = CreditsCommand;
