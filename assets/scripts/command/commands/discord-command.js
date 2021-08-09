import {insertHTML} from "../../parser/displayer.js";
import {Command} from "../command.js";

export class DiscordCommand extends Command {

    constructor() {
        super("discord");
    }

    execute(context) {
        insertHTML("https://discord.xpple.dev/");
    }
}
