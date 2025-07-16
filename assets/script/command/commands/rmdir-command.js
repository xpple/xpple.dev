import { Command } from "../command.js";
import { IllegalArgumentError } from "../../errors/illegal-argument-error.js";
import { ExistingDirectoryArgument } from "../arguments/existing-directory-argument.js";
export class RmDirCommand extends Command {
    constructor() {
        super("rmdir", "Remove a directory (recursively).");
    }
    async execute(reader) {
        const directory = new ExistingDirectoryArgument().parse(reader);
        if (reader.canRead()) {
            const dirString = reader.readString();
            const success = directory.deleteDirectory(dirString);
            if (!success) {
                throw new IllegalArgumentError("A directory with this name does not exist.");
            }
        }
        else {
            throw new IllegalArgumentError("Expected directory name.");
        }
    }
}
