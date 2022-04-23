import {Command} from "../command.js";
import {FileManager} from "../file_system/file-manager.js";
import {IllegalArgumentError} from "../../errors/illegal-argument-error.js";
import {StringReader} from "../string-reader.js";

export class RmCommand extends Command {

    public constructor() {
        super("rm", "Remove a file.");
    }

    public override async execute(reader: StringReader): Promise<void> {
        if (reader.canRead()) {
            const fileString = reader.readString();
            const success = FileManager.getCurrentDirectory().deleteFile(fileString);
            if (!success) {
                throw new IllegalArgumentError("A file with this name does not exist.");
            }
        } else {
            throw new IllegalArgumentError("Expected file name.");
        }
    }
}
