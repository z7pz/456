"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BuyMessageCommand = void 0;
const framework_1 = require("@sapphire/framework");
const constants_1 = require("../../constants");
const discord_js_1 = require("discord.js");
class BuyMessageCommand extends framework_1.Command {
    constructor(context, options) {
        super(context, {
            ...options,
            name: "buy_message",
            aliases: ["bm"],
            description: "send buy message",
            preconditions: ["OwnerOnly"],
        });
    }
    async messageRun(message) {
        let buy = new discord_js_1.ButtonBuilder()
            .setStyle(discord_js_1.ButtonStyle.Success)
            .setLabel("Buy")
            .setCustomId("buy");
        const row = new discord_js_1.ActionRowBuilder().addComponents(buy);
        return message.channel.send({
            content: constants_1.MESSAGE.MAIN_BUY_MESSAGE,
            components: [row],
        });
    }
}
exports.BuyMessageCommand = BuyMessageCommand;
