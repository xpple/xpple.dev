import { Command } from "../command.js";
import { FileManager } from "../../file_system/file-manager.js";
import { ExistingDirectoryArgument } from "../arguments/existing-directory-argument.js";
import { IllegalArgumentError } from "../../errors/illegal-argument-error.js";
export class CdCommand extends Command {
    constructor() {
        super("cd", "Go to a directory.");
    }
    async execute(reader) {
        const directory = new ExistingDirectoryArgument().parse(reader);
        if (reader.readString() === "") {
            FileManager.setCurrentDirectory(directory);
            return;
        }
        throw new IllegalArgumentError("Directory does not exist.");
    }
}
