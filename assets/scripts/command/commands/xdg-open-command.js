import {insertHTML} from "../../parser/displayer.js";
import {Command} from "../command.js";

export class XdgOpenCommand extends Command {

    constructor() {
        super("xdg-open");
    }

    execute(context) {
        insertHTML("lmao");
    }
}
