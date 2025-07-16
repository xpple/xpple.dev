import { Command } from "../command.js";
import { CommandHandler } from "../command-handler.js";
export class DiscordCommand extends Command {
    constructor() {
        super("discord", "Get the link to my Discord.");
    }
    async execute() {
        CommandHandler.sendFeedback(`<a href="https://discord.xpple.dev/" target="_blank">https://discord.xpple.dev/</a>`);
    }
}
