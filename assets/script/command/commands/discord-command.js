import {Command} from "../command.js";

export class DiscordCommand extends Command {

    constructor() {
        super("discord");
    }

    async execute(context) {
        this.sendFeedback(`<a href="https://discord.xpple.dev/" target="_blank">https://discord.xpple.dev/</a>`);
    }
}
