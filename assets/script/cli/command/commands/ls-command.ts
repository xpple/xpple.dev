import {Command} from "../command.js";
import {StringReader} from "../string-reader.js";
import {ExistingDirectoryArgument} from "../arguments/existing-directory-argument.js";
import {IllegalArgumentError} from "../../errors/illegal-argument-error.js";

export class LsCommand extends Command {

    public constructor() {
        super("ls", "List all directories and files.");
    }

    public override async execute(reader: StringReader): Promise<void> {
        const directory = new ExistingDirectoryArgument().parse(reader);
        if (reader.readString() === "") {
            for (const dirName of directory.getDirectories().keys()) {
                this.sendFeedback(dirName);
            }
            for (const fileName of directory.getFiles().keys()) {
                this.sendFeedback(fileName);
            }
            return;
        }
        throw new IllegalArgumentError("Directory does not exist.");
    }
}
