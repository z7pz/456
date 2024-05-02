"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreditsCommand = void 0;
const framework_1 = require("@sapphire/framework");
const discord_js_1 = require("discord.js");
const getUser_1 = require("../../utils/getUser");
const ms_1 = __importDefault(require("ms"));
const moment_1 = __importDefault(require("moment"));
class CreditsCommand extends framework_1.Command {
    constructor(context, options) {
        super(context, {
            ...options,
            name: "mysubs",
            aliases: ["ms"],
            description: "add balance",
            enabled: true,
            preconditions: [],
        });
    }
    async messageRun(message, args) {
        const user = await (0, getUser_1.getUser)(message.author.id);
        const embed = new discord_js_1.EmbedBuilder()
            .setTitle("Your subs")
            .setColor("DarkAqua")
            .setDescription(`Your bots: \n` + user.bots.map((c) => `> <:7_:1233799614688133192> \`[${c.id.slice(0, 5)}]\` | _${(0, ms_1.default)((0, moment_1.default)(c.subscriptionEnd).diff((0, moment_1.default)()), {
            long: true,
        })}_`).join('\n'));
        message.reply({
            embeds: [embed]
        });
    }
}
exports.CreditsCommand = CreditsCommand;
