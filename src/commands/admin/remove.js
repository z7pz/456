"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RemoveBalanceCommand = void 0;
const framework_1 = require("@sapphire/framework");
const database_1 = require("../../database");
const constants_1 = require("../../constants");
class RemoveBalanceCommand extends framework_1.Command {
    constructor(context, options) {
        super(context, {
            ...options,
            name: "remove",
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
            return message.reply("!remove @Someone 10");
        }
        let amount = amountRes.unwrap();
        let user = userRes.unwrap();
        const u = await database_1.prisma.user.findFirst({
            where: { id: user.id, balance: { gt: amount } },
        });
        if (!u) {
            const _ = await database_1.prisma.user.create({
                data: { id: user.id, balance: 0 },
            });
        }
        else {
            const _ = await database_1.prisma.user.update({
                where: { id: user.id },
                data: { balance: { decrement: amount } },
            });
        }
        return message.reply(constants_1.MESSAGE.REMOVE_CREDITS.replace("${coinsToRemove}", amount.toString()).replace("${userId}", user.id));
    }
}
exports.RemoveBalanceCommand = RemoveBalanceCommand;
