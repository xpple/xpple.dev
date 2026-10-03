import { Command } from "../command.js";
import { UnknownCommandError } from "../../errors/unknown-command-error.js";
export class CommandArgumentType {
    parse(reader) {
        const commandString = reader.readString();
        const command = Command.commands.get(commandString);
        if (command === undefined) {
            throw new UnknownCommandError(commandString);
        }
        return command;
    }
}
