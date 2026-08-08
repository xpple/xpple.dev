import {Command} from "../command.js";
import {IllegalArgumentError} from "../../errors/illegal-argument-error.js";
import {StringReader} from "../string-reader.js";
import {ExistingDirectoryArgument} from "../arguments/existing-directory-argument.js";

export class RmCommand extends Command {

    public constructor() {
        super("rm", "Remove a file.");
    }

    public override async execute(reader: StringReader): Promise<void> {
        const directory = new ExistingDirectoryArgument().parse(reader);
        if (reader.canRead()) {
            const fileString = reader.readString();
            const success = directory.deleteFile(fileString);
            if (!success) {
                throw new IllegalArgumentError("A file with this name does not exist.");
            }
        } else {
            throw new IllegalArgumentError("Expected file name.");
        }
    }
}
