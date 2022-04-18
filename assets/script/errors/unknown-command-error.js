import {CommandSyntaxError} from "./command-syntax-error.js";

export class UnknownCommandError extends CommandSyntaxError {

    constructor(commandString) {
        super(`Unknown command: ${commandString}`);
    }

    getName() {
        return "UnknownCommandError";
    }
}
