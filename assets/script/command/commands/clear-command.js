import {Command} from "../command.js";
import {CommandHandler} from "../command-handler.js";

export class ClearCommand extends Command {

    constructor() {
        super("clear", "Clear the screen.");
    }

    async execute(reader) {
        CommandHandler.cliContainer.querySelectorAll("span, br").forEach(e => e.remove());
    }
}
