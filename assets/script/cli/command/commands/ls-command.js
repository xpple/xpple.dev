import { Command } from "../command.js";
import { ExistingDirectoryArgument } from "../arguments/existing-directory-argument.js";
import { IllegalArgumentError } from "../../errors/illegal-argument-error.js";
export class LsCommand extends Command {
    constructor() {
        super("ls", "List all directories and files.");
    }
    async execute(reader) {
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
