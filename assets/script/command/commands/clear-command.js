import {Command} from "../command.js";
import {CommandHandler} from "../command-handler.js";

export class ClearCommand extends Command {

    constructor() {
        super("clear");
    }

    async execute(context) {
        CommandHandler.cliContainer.querySelectorAll("span, br").forEach(e => e.remove());
    }
}
