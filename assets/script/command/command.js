import {CommandHandler} from "./command-handler.js";

export /*abstract*/ class Command {

    /**
     * @type {Map<String, Command>}
     */
    static commands = new Map();

    /**
     * @param {Command} command
     */
    static register(command) {
        if (command instanceof Command) {
            Command.commands.set(command.rootLiteral, command);
        } else {
            throw new TypeError();
        }
    }

    /**
     * @param {String} string
     */
    sendFeedback(string) {
        CommandHandler.sendFeedback(string);
    }

    /**
     * @param {String} string
     */
    sendError(string) {
        CommandHandler.sendError(string);
    }

    /**
     * @param {String} rootLiteral
     * @param {String} description
     */
    constructor(rootLiteral, description) {
        if (this.constructor === Command) {
            throw new Error("Object of Abstract Class cannot be created");
        }
        this.rootLiteral = rootLiteral;
        this.description = description;
    }

    /**
     * Execute the command.
     * @param {StringReader} reader
     * @returns {Promise<void>}
     */
    async execute(reader) {
        throw new Error("Method of Abstract Class cannot be called");
    }
}
