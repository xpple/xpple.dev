import {ArgumentType} from "../argument-type.js";
import {Command} from "../command.js";
import {StringReader} from "../string-reader.js";
import {UnknownCommandError} from "../../errors/unknown-command-error.js";

export class CommandArgumentType implements ArgumentType<Command> {

    public parse(reader: StringReader): Command {
        const commandString = reader.readString();
        const command = Command.commands.get(commandString);
        if (command === undefined) {
            throw new UnknownCommandError(commandString);
        }
        return command;
    }
}
