"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StockCommand = void 0;
const framework_1 = require("@sapphire/framework");
const database_1 = require("../../database");
const discord_js_1 = require("discord.js");
class StockCommand extends framework_1.Command {
    constructor(context, options) {
        super(context, {
            ...options,
            name: "stock",
            aliases: ["s"],
            description: "add balance",
            enabled: true,
            preconditions: [],
        });
    }
    async messageRun(message, args) {
        const used = await database_1.prisma.token.findMany({
            where: {
                used: true,
            },
        });
        const nused = await database_1.prisma.token.findMany({
            where: {
                used: false,
            },
        });
        const embed = new discord_js_1.EmbedBuilder()
            .setTitle("Bot Stock!")
            .setColor("DarkAqua")
            .setTimestamp()
            .setDescription(`> **Available Bots : \`${nused.length.toString()}\`\n> Sold Bots: \`${used.length.toString()}\`**`);
        message.reply({ embeds: [embed] });
    }
}
exports.StockCommand = StockCommand;
