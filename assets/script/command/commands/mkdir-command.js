import { Command } from "../command.js";
import { Directory } from "../../file_system/directory.js";
import { IllegalArgumentError } from "../../errors/illegal-argument-error.js";
import { ExistingDirectoryArgument } from "../arguments/existing-directory-argument.js";
export class MkDirCommand extends Command {
    constructor() {
        super("mkdir", "Create a new directory.");
    }
    async execute(reader) {
        const directory = new ExistingDirectoryArgument().parse(reader);
        if (reader.canRead()) {
            const dirString = reader.readString();
            const dir = new Directory(dirString, directory);
            const success = directory.addDirectory(dir);
            if (!success) {
                throw new IllegalArgumentError("A directory with this name already exists.");
            }
        }
        else {
            throw new IllegalArgumentError("Expected directory name.");
        }
    }
}
