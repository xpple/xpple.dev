import {Command} from "../command.js";

export class XppleCommand extends Command {

    constructor() {
        super("xpple");
    }

    async execute(context) {
        this.sendFeedback("Hey!");
    }
}
