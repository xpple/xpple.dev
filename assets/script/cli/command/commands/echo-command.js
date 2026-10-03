import { Command } from "../command.js";
export class EchoCommand extends Command {
    constructor() {
        super("echo", "Print something to the screen.");
    }
    async execute(reader) {
        const text = reader.getRemaining();
        this.sendFeedback(text);
    }
}
