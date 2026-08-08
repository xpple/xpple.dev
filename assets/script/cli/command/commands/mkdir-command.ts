import {Command} from "../command.js";
import {Directory} from "../../file_system/directory.js";
import {IllegalArgumentError} from "../../errors/illegal-argument-error.js";
import {StringReader} from "../string-reader.js";
import {ExistingDirectoryArgument} from "../arguments/existing-directory-argument.js";

export class MkDirCommand extends Command {

    public constructor() {
        super("mkdir", "Create a new directory.");
    }

    public override async execute(reader: StringReader): Promise<void> {
        const directory = new ExistingDirectoryArgument().parse(reader);
        if (reader.canRead()) {
            const dirString = reader.readString();
            const dir = new Directory(dirString, directory);
            const success = directory.addDirectory(dir);
            if (!success) {
                throw new IllegalArgumentError("A directory with this name already exists.");
            }
        } else {
            throw new IllegalArgumentError("Expected directory name.");
        }
    }
}
