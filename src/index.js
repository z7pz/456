"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const framework_1 = require("@sapphire/framework");
const discord_js_1 = require("discord.js");
const node_cron_1 = __importDefault(require("node-cron"));
const database_1 = require("./database");
const docker_1 = require("./docker");
async function init_bot() {
    const client = new framework_1.SapphireClient({
        intents: [
            discord_js_1.GatewayIntentBits.DirectMessageReactions,
            discord_js_1.GatewayIntentBits.DirectMessages,
            discord_js_1.GatewayIntentBits.GuildEmojisAndStickers,
            discord_js_1.GatewayIntentBits.GuildMembers,
            discord_js_1.GatewayIntentBits.GuildPresences,
            discord_js_1.GatewayIntentBits.GuildMessageReactions,
            discord_js_1.GatewayIntentBits.GuildMessages,
            discord_js_1.GatewayIntentBits.Guilds,
            discord_js_1.GatewayIntentBits.MessageContent,
        ],
        loadMessageCommandListeners: true,
        loadDefaultErrorListeners: true,
        disableMentionPrefix: true,
        defaultPrefix: "!",
    });
    await client.login(process.env.DISCORD_TOKEN);
    return client;
}
async function main() {
    try {
        const client = await init_bot();
        node_cron_1.default.schedule("*/3 * * * * *", async () => {
            let allBots = await database_1.prisma.bot.findMany({
                where: { subscriptionEnd: { lt: new Date() }, expired: false },
            });
            for (const bot of allBots) {
                let containerId = bot.id;
                let container = docker_1.docker.getContainer(containerId);
                container
                    .stop()
                    .catch(console.log)
                    .then((c) => console.log("container stopped"));
                client.users
                    .fetch(bot.userId)
                    .then((user) => user.send(`> Hello there! Your bot has been expired, to renewal please buy from the server again!`));
                await database_1.prisma.bot
                    .delete({
                    where: { id: bot.id },
                })
                    .catch(console.log);
                console.log(`Subscription expired for ${bot.id}`);
            }
        });
    }
    catch (err) {
        console.error(err);
    }
}
main();
