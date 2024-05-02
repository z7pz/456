"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BuyAcceptButtonHandler = void 0;
const framework_1 = require("@sapphire/framework");
const database_1 = require("../../database");
const getUser_1 = require("../../utils/getUser");
const docker_1 = require("../../docker");
const verifyToken_1 = require("../../utils/verifyToken");
const constants_1 = require("../../constants");
const webhooks_1 = require("../../webhooks");
class BuyAcceptButtonHandler extends framework_1.InteractionHandler {
    constructor(ctx, options) {
        super(ctx, {
            ...options,
            interactionHandlerType: framework_1.InteractionHandlerTypes.Button,
        });
    }
    parse(interaction) {
        if (interaction.customId !== "buy+accepted")
            return this.none();
        return this.some();
    }
    async run(interaction) {
        console.log("Getting user!");
        const user = await (0, getUser_1.getUser)(interaction.user.id);
        console.log("!!");
        if (user.balance < constants_1.CONSTS.COSTS) {
            await interaction.reply({
                content: constants_1.MESSAGE.ERROR_NOT_ENGOUH_MONEY,
                ephemeral: true,
            });
        }
        else {
            try {
                console.log("creating bc bot!");
                const first = await database_1.prisma.token.findFirst({
                    where: {
                        used: false,
                    },
                });
                if (!first) {
                    await interaction.reply({
                        content: constants_1.MESSAGE.ERROR_NOT_ENOUGH_TOKEN_STORAGE,
                        ephemeral: true,
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
                    webhooks_1.notificationWebhook.send(`> **Successfully  <@${user.id}> , has been Purchase 1 bot** <:7_:1233799614688133192>`).catch(() => { });
                    webhooks_1.logsWebhook.send(`> **Successfully  <@${user.id}> , has been Purchase 1 bot** <:7_:1233799614688133192>`).catch(() => { });
                    await database_1.prisma.transaction.create({
                        data: {
                            price: Number(constants_1.CONSTS.COSTS),
                        },
                    });
                    const container = await (0, docker_1.createContainer)(constants_1.CONSTS.IMAGE_NAME, interaction.user.id, first.token);
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
                    await database_1.prisma.user.upsert({
                        where: { id: user.id },
                        update: {
                            balance: { decrement: Number(constants_1.CONSTS.COSTS) },
                        },
                        create: {
                            id: user.id,
                        },
                    });
                    const content = constants_1.MESSAGE.SEND_LINK +
                        `https://discord.com/oauth2/authorize?client_id=${data.id}&permissions=2048&scope=bot`;
                    await interaction.user
                        .send({
                        content,
                    })
                        .catch(() => { });
                    await interaction.reply({
                        content,
                        ephemeral: true,
                    });
                }
                catch (err) {
                    return interaction.reply(constants_1.MESSAGE.ERROR_WITH_TOKEN);
                }
            }
            catch (err) {
                console.log(err);
                await interaction.reply({
                    content: constants_1.MESSAGE.ERROR_MAIN,
                    ephemeral: true,
                });
            }
        }
        setTimeout(async () => {
            await interaction.deleteReply().catch(() => { });
        }, 30000);
    }
}
exports.BuyAcceptButtonHandler = BuyAcceptButtonHandler;
