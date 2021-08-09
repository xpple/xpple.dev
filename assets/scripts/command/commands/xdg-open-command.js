import {getCurrentDir, insertHTML} from "../../parser/displayer.js";
import {Command} from "../command.js";
import {CommandSyntaxError} from "../../errors/command-syntax-error.js";

export class XdgOpenCommand extends Command {

    constructor() {
        super("xdg-open");
    }

    async execute(context) {
        context.skip();
        const filePath = context.getRemaining();
        const path = getCurrentDir().resolve(filePath);
        await path.isFile()
            .then(result => {
                if (result === true) {
                    XdgOpenCommand.openFile(path);
                } else {
                    insertHTML("Not a file");
                }
            }).catch(e => {
                throw CommandSyntaxError(e);
            });
    }

    static openFile(path) {

    }
}
