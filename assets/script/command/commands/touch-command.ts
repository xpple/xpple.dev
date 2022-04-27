import {Command} from "../command.js";
import {File} from "../file_system/file.js";
import {IllegalArgumentError} from "../../errors/illegal-argument-error.js";
import {StringReader} from "../string-reader.js";
import {ExistingDirectoryArgument} from "../arguments/existing-directory-argument.js";

export class TouchCommand extends Command {

    public constructor() {
        super("touch", "Create a new file.");
    }

    public override async execute(reader: StringReader): Promise<void> {
        const directory = new ExistingDirectoryArgument().parse(reader);
        if (reader.canRead()) {
            const fileString = reader.readString();
            const file = new File(fileString, directory);
            const success = directory.addFile(file);
            if (!success) {
                throw new IllegalArgumentError("A file with this name already exists.");
            }
        } else {
            throw new IllegalArgumentError("Expected file name.");
        }
    }
}
