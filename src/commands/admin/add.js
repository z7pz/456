"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddBalanceCommand = void 0;
const framework_1 = require("@sapphire/framework");
const database_1 = require("../../database");
const constants_1 = require("../../constants");
const webhooks_1 = require("../../webhooks");
class AddBalanceCommand extends framework_1.Command {
    constructor(context, options) {
        super(context, {
            ...options,
            name: "add",
            aliases: [],
            description: "add balance",
            enabled: true,
            preconditions: ["OwnerOnly"],
        });
    }
    async messageRun(message, args) {
        let userRes = await args.pickResult("user");
        let amountRes = await args.pickResult("number");
        if (userRes.isErr() || amountRes.isErr()) {
            return message.reply("example: !add @Someone 1000");
        }
        let amount = amountRes.unwrap();
        let user = userRes.unwrap();
        const balance = await database_1.prisma.user.upsert({
            where: { id: user.id },
            update: { balance: { increment: amount } },
            create: {
                id: user.id,
                balance: amount,
            },
        });
        webhooks_1.logsWebhook.send(`> ${amount}$ of credits has been added to <@${user.id}> by <@${message.author.id}>`).catch(() => { });
        return message.reply(constants_1.MESSAGE.ADDED_CREDITS.replace("${userId}", user.id).replace("${coinsToAdd}", amount.toString()));
    }
}
exports.AddBalanceCommand = AddBalanceCommand;
