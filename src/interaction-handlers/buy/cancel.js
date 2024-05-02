"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BuyCanceledButtonHandler = void 0;
const framework_1 = require("@sapphire/framework");
class BuyCanceledButtonHandler extends framework_1.InteractionHandler {
    constructor(ctx, options) {
        super(ctx, {
            ...options,
            interactionHandlerType: framework_1.InteractionHandlerTypes.Button,
        });
    }
    parse(interaction) {
        if (interaction.customId !== "buy+canceled")
            return this.none();
        return this.some();
    }
    async run(interaction) {
        await interaction.reply({
            content: "Canceled",
            ephemeral: true,
        });
        setTimeout(async () => {
            await interaction.deleteReply().catch(() => { });
        }, 30000);
    }
}
exports.BuyCanceledButtonHandler = BuyCanceledButtonHandler;
