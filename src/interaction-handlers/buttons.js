"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BuyButtonHandler = void 0;
const framework_1 = require("@sapphire/framework");
const constants_1 = require("../constants");
const discord_js_1 = require("discord.js");
class BuyButtonHandler extends framework_1.InteractionHandler {
    constructor(ctx, options) {
        super(ctx, {
            ...options,
            interactionHandlerType: framework_1.InteractionHandlerTypes.Button,
        });
    }
    parse(interaction) {
        if (interaction.customId !== "buy")
            return this.none();
        return this.some();
    }
    async run(interaction) {
        console.log("hm?");
        const accepted = new discord_js_1.ButtonBuilder()
            .setCustomId("buy+accepted")
            .setLabel("Yes")
            .setStyle(discord_js_1.ButtonStyle.Success);
        const canceled = new discord_js_1.ButtonBuilder()
            .setCustomId("buy+canceled")
            .setLabel("Cancel")
            .setStyle(discord_js_1.ButtonStyle.Danger);
        const row = new discord_js_1.ActionRowBuilder().addComponents(canceled, accepted);
        await interaction.reply({
            content: constants_1.MESSAGE.MAKE_SURE_YOU_WANT_TO_BUY,
            components: [row],
            ephemeral: true,
        });
        setTimeout(async () => {
            await interaction.deleteReply().catch(() => { });
        }, 30000);
    }
}
exports.BuyButtonHandler = BuyButtonHandler;
