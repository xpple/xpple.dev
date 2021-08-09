import {Command} from "../command.js";
import {getCurrentDir, getUser, insertHTML, setCurrentDir} from "../../parser/displayer.js";
import {CommandSyntaxError} from "../../errors/command-syntax-error.js";

export class CdCommand extends Command {

    constructor() {
        super("cd");
    }

    async execute(context) {
        context.skip();
        const dir = context.getRemaining();
        const path = getCurrentDir().resolve(dir);
        await path.isFile()
            .then(result => {
                if (result === true) {
                    setCurrentDir(path);
                    document.querySelector("#cli-input-container > span").innerHTML = getUser() + "@main:" + getCurrentDir().path + "$&nbsp;";
                } else {
                    insertHTML("Not a directory");
                }
            }).catch(e => {
                throw CommandSyntaxError(e);
            });
    }
}
