import {CommandHandler} from "./command-handler.js";

export /*abstract*/ class Command {

    static commands = new Map();

    static register(command) {
        if (!(command instanceof Command)) {
            return;
        }
        Command.commands.set(command.rootLiteral, command);
    }

    sendFeedback(string) {
        CommandHandler.sendFeedback(string);
    }

    sendError(string) {
        CommandHandler.sendError(string);
    }

    constructor(rootLiteral) {
        if (this.constructor === Command) {
            throw new Error("Object of Abstract Class cannot be created");
        }
        this.rootLiteral = rootLiteral;
    }

    async execute(context) {
        throw new Error("Method of Abstract Class cannot be called");
    }
}
