import { Command } from "../command.js";
import { CommandArgumentType } from "../arguments/command-argument-type.js";
export class HelpCommand extends Command {
    constructor() {
        super("help", "Get help.");
    }
    async execute(reader) {
        if (reader.canRead()) {
            const command = new CommandArgumentType().parse(reader);
            this.sendFeedback(command.description);
            return;
        }
        this.sendFeedback("Available commands:");
        for (const command of Command.commands.values()) {
            this.sendFeedback(" - " + command.rootLiteral);
        }
        this.sendFeedback("To get help for a specific command, type 'help <command>'.");
    }
}
