import {CommandHandler} from "./command-handler.js";
import {StringReader} from "./string-reader.js";

export abstract class Command {

    public static commands: Map<string, Command> = new Map<string, Command>();

    public static register(command: Command): void {
        Command.commands.set(command.rootLiteral, command);
    }

    public sendFeedback(string: string): void {
        CommandHandler.sendFeedback(CommandHandler.sanitiseString(string));
    }

    public sendError(string: string): void {
        CommandHandler.sendError(CommandHandler.sanitiseString(string));
    }

    protected constructor(public rootLiteral: string, public description: string) {
    }

    public async execute(reader: StringReader): Promise<void> {
        throw new Error("Method of Abstract Class cannot be called");
    }
}
