import {Command} from "../command.js";

export class XppleCommand extends Command {

    constructor() {
        super("xpple", "Say hi to me!");
    }

    async execute(reader) {
        this.sendFeedback("Hey!");
    }
}
