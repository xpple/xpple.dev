import { Command } from "../command.js";
import { File } from "../../file_system/file.js";
import { IllegalArgumentError } from "../../errors/illegal-argument-error.js";
import { ExistingDirectoryArgument } from "../arguments/existing-directory-argument.js";
export class TouchCommand extends Command {
    constructor() {
        super("touch", "Create a new file.");
    }
    async execute(reader) {
        const directory = new ExistingDirectoryArgument().parse(reader);
        if (reader.canRead()) {
            const fileString = reader.readString();
            const file = new File(fileString, directory);
            const success = directory.addFile(file);
            if (!success) {
                throw new IllegalArgumentError("A file with this name already exists.");
            }
        }
        else {
            throw new IllegalArgumentError("Expected file name.");
        }
    }
}
