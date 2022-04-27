import {Command} from "../command.js";
import {FileManager} from "../file_system/file-manager.js";
import {StringReader} from "../string-reader.js";

export class PwdCommand extends Command {
    public constructor() {
        super("pwd", "Print the path of the current working directory.");
    }

    public override async execute(reader: StringReader): Promise<void> {
        this.sendFeedback(FileManager.getCurrentDirectory().getPath());
    }
}
