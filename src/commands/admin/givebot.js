"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GiveBotCommand = void 0;
const framework_1 = require("@sapphire/framework");
const database_1 = require("../../database");
const verifyToken_1 = require("../../utils/verifyToken");
const docker_1 = require("../../docker");
const constants_1 = require("../../constants");
const webhooks_1 = require("../../webhooks");
class GiveBotCommand extends framework_1.Command {
    constructor(context, options) {
        super(context, {
            ...options,
            name: "gb",
            aliases: [],
            description: "Give bot",
            enabled: true,
            preconditions: ["OwnerOnly"],
        });
    }
    async messageRun(message, args) {
        let userRes = await args.pickResult("user");
        if (userRes.isErr())
            return message.reply("!gb @Someone");
        const user = userRes.unwrap();
        const first = await database_1.prisma.token.findFirst({
            where: {
                used: false,
            },
        });
        if (!first) {
            await message.reply({
                content: constants_1.MESSAGE.ERROR_NOT_ENOUGH_TOKEN_STORAGE,
            });
            return;
        }
        try {
            const { data } = await (0, verifyToken_1.verifyToken)(first.token);
            await database_1.prisma.token.update({
                where: {
                    id: first.id,
                },
                data: {
                    used: true,
                },
            });
            await database_1.prisma.transaction.create({
                data: {
                    price: Number(constants_1.CONSTS.COSTS),
                },
            });
            const container = await (0, docker_1.createContainer)(constants_1.CONSTS.IMAGE_NAME, user.id, first.token);
            const bot = await database_1.prisma.bot.create({
                data: {
                    id: container.id,
                    expired: false,
                    subscriptionEnd: new Date(Date.now() + Number(constants_1.CONSTS.TIME)),
                    subscriptionStart: new Date(),
                    tokenId: first.id,
                    userId: user.id,
                },
            });
            webhooks_1.notificationWebhook
                .send(`> **Successfully  <@${user.id}> , has been Purchase 1 bot** <:7_:1233799614688133192>`)
                .catch(() => { });
            webhooks_1.logsWebhook
                .send(`> **Successfully  <@${user.id}> , has been Purchase 1 bot** <:7_:1233799614688133192>`)
                .catch(() => { });
            const content = {
                content: "",
                tts: false,
                embeds: [
                    {
                        title: "معلومات الإشتراك : ",
                        description: `<:20:1233799830938058752> Owner: <@${user.id}>\n<:20:1233799830938058752> Subscription Id: ${bot.id.slice(0, 5)}\n<:20:1233799830938058752> Invite Bot : https://discord.com/oauth2/authorize?client_id=${data.id}&permissions=2048&scope=bot`,
                        color: 2065714,
                        author: {
                            name: `Hi ${user.displayName}`,
                            icon_url: "https://cdn.discordapp.com/attachments/1233800550873829426/1235541583349415966/7.png?ex=6634bf44&is=66336dc4&hm=51bb8c9822fb0736e92638d1308050e0dd639d17a5dbd02fc56b344548f0852a&",
                        },
                        thumbnail: {
                            url: "https://cdn.discordapp.com/attachments/1233800550873829426/1235544164364451965/13.png?ex=6634c1ac&is=6633702c&hm=ff4624cf02216af9169663246bfdcb68ea8d12cd0e936c02aba976744c026745&",
                        },
                        fields: [],
                    },
                ],
                components: [],
            };
            await user
                .send(content)
                .catch(() => { });
            await message.reply(content);
        }
        catch (err) {
            return message.reply(constants_1.MESSAGE.ERROR_WITH_TOKEN);
        }
    }
}
exports.GiveBotCommand = GiveBotCommand;
