import {Command} from "../command.js";
import {IllegalArgumentError} from "../../errors/illegal-argument-error.js";
import {StringReader} from "../string-reader.js";
import {ExistingDirectoryArgument} from "../arguments/existing-directory-argument.js";

export class CatCommand extends Command {

    public constructor() {
        super("cat", "View the contents of a file.");
    }

    public override async execute(reader: StringReader): Promise<void> {
        const directory = new ExistingDirectoryArgument().parse(reader);
        if (reader.canRead()) {
            const fileString = reader.readString();
            const file = directory.getFiles().get(fileString);
            if (file === undefined) {
                throw new IllegalArgumentError("File does not exist.");
            }
            this.sendFeedback(file.getContent());
        } else {
            throw new IllegalArgumentError("Expected file name.");
        }
    }
}
