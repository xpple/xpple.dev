import {Command} from "../command.js";
import {FileManager} from "../file_system/file-manager.js";
import {StringReader} from "../string-reader.js";
import {ExistingDirectoryArgument} from "../arguments/existing-directory-argument.js";
import {IllegalArgumentError} from "../../errors/illegal-argument-error.js";

export class CdCommand extends Command {

    public constructor() {
        super("cd", "Go to a directory.");
    }

    public override async execute(reader: StringReader): Promise<void> {
        const directory = new ExistingDirectoryArgument().parse(reader);
        if (reader.readString() === "") {
            FileManager.setCurrentDirectory(directory);
            return;
        }
        throw new IllegalArgumentError("Directory does not exist.");
    }
}
