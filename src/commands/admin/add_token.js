"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddTokenCommand = void 0;
const framework_1 = require("@sapphire/framework");
const database_1 = require("../../database");
const verifyToken_1 = require("../../utils/verifyToken");
const constants_1 = require("../../constants");
const webhooks_1 = require("../../webhooks");
class AddTokenCommand extends framework_1.Command {
    constructor(context, options) {
        super(context, {
            ...options,
            name: "add_token",
            aliases: [],
            description: "add balance",
            enabled: true,
            preconditions: ["OwnerOnly"],
        });
    }
    async messageRun(message, args) {
        let tokenRes = await args.pickResult("string");
        if (tokenRes.isErr()) {
            return message.reply("example: !add_token token_here");
        }
        let token = tokenRes.unwrap();
        await message.delete().catch(() => { });
        let msg = await message.channel.send(constants_1.MESSAGE.VERIFING_TOKEN);
        try {
            await (0, verifyToken_1.verifyToken)(token);
            await msg.edit(constants_1.MESSAGE.SAVING_TOKEN);
            await database_1.prisma.token.create({
                data: {
                    token,
                },
            });
            webhooks_1.logsWebhook.send(`> a new token has been added to the storage by <@${message.author.id}>`).catch(() => { });
            await msg.edit(constants_1.MESSAGE.SAVED_TOKEN);
            const ct = database_1.prisma.token.create({
                data: {
                    token: token,
                },
            });
        }
        catch (err) {
            console.log(err);
            return msg.edit({ content: constants_1.MESSAGE.INVALID_TOKEN });
        }
    }
}
exports.AddTokenCommand = AddTokenCommand;
