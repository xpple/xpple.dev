import {Command} from "../command.js";

export class HelpCommand extends Command {

    constructor() {
        super("help");
    }

    async execute(context) {
        this.sendFeedback("Available commands:");
        for (const rootLiteral of Command.commands.keys()) {
            this.sendFeedback(" - " + rootLiteral);
        }
    }
}
