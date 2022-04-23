import {Command} from "../command.js";
import {FileManager} from "../file_system/file-manager.js";
import {IllegalArgumentError} from "../../errors/illegal-argument-error.js";
import {StringReader} from "../string-reader.js";

export class RmDirCommand extends Command {

    public constructor() {
        super("rmdir", "Remove a directory (recursively).");
    }

    public override async execute(reader: StringReader): Promise<void> {
        if (reader.canRead()) {
            const dirString = reader.readString();
            const success = FileManager.getCurrentDirectory().deleteDirectory(dirString);
            if (!success) {
                throw new IllegalArgumentError("A directory with this name does not exist.");
            }
        } else {
            throw new IllegalArgumentError("Expected directory name.");
        }
    }
}
