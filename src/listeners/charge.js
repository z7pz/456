"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChargeListener = void 0;
const framework_1 = require("@sapphire/framework");
const database_1 = require("../database");
const constants_1 = require("../constants");
const webhooks_1 = require("../webhooks");
class ChargeListener extends framework_1.Listener {
    constructor(context, options) {
        super(context, {
            ...options,
            event: "messageCreate",
        });
    }
    async run(message) {
        if (message.channel.id !== constants_1.CONSTS.CHARGE_CHANNEL)
            return;
        if (message.author.id == constants_1.CONSTS.PROBOT) {
            if (!message.content.includes("has transferred"))
                return;
            let id = message.content.match(/(?<=\<@!).*(?=\>)/g);
            let username = message.content.match(/(?<=\| ).*(?=\,)/g);
            let amount = message.content.match(/(?<=\`\$)[0-9]*(?=\`)/g);
            if (!id?.[0] || !username?.[0] || !amount?.[0]) {
                console.log("none");
                return;
            }
            if (id[0] !== constants_1.CONSTS.BANK_ACCOUNT) {
                return;
            }
            if (isNaN(Number(amount[0]))) {
                console.log("nan");
                return;
            }
            const users = await message.guild.members.fetch();
            let data = users.find((c) => c.user.username == username[0]);
            if (!data || data == undefined) {
                message.channel.send(`please support add ${amount} to ${username[0]}...`);
                return;
            }
            let update = await database_1.prisma.user.upsert({
                where: { id: data.id },
                update: {
                    balance: { increment: Number(amount[0]) },
                },
                create: {
                    id: data.id,
                },
            });
            webhooks_1.logsWebhook.send(`> <@${data.user.id}> has charged ${amount}$`).catch(() => { });
            console.log("user updated into " + update.balance);
            message.reply(constants_1.MESSAGE.TRANSACTION_SUCESS.replace("${price}", amount[0].toString()) + ` \`${update.balance}\``);
            console.log(update);
        }
        if (!message.author.bot) {
        }
    }
}
exports.ChargeListener = ChargeListener;
