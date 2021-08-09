import {insertHTML} from "../../parser/displayer.js";
import {Command} from "../command.js";

export class XppleCommand extends Command {

    constructor() {
        super("xpple");
    }

    execute(context) {
        insertHTML("Hey!");
    }
}
