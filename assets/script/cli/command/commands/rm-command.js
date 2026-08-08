import { Command } from "../command.js";
import { IllegalArgumentError } from "../../errors/illegal-argument-error.js";
import { ExistingDirectoryArgument } from "../arguments/existing-directory-argument.js";
export class RmCommand extends Command {
    constructor() {
        super("rm", "Remove a file.");
    }
    async execute(reader) {
        const directory = new ExistingDirectoryArgument().parse(reader);
        if (reader.canRead()) {
            const fileString = reader.readString();
            const success = directory.deleteFile(fileString);
            if (!success) {
                throw new IllegalArgumentError("A file with this name does not exist.");
            }
        }
        else {
            throw new IllegalArgumentError("Expected file name.");
        }
    }
}
