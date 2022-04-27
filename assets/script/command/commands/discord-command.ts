import {Command} from "../command.js";
import {CommandHandler} from "../command-handler.js";

export class DiscordCommand extends Command {

    public constructor() {
        super("discord", "Get the link to my Discord.");
    }

    public override async execute(): Promise<void> {
        CommandHandler.sendFeedback(`<a href="https://discord.xpple.dev/" target="_blank">https://discord.xpple.dev/</a>`);
    }
}
