import {Command} from "../command.js";

export class ClearCommand extends Command {

    constructor() {
        super("clear");
    }

    execute(context) {
        document.querySelectorAll("#cli-container > br").forEach(element => element.remove());
        document.querySelectorAll("#cli-container > span").forEach(element => element.remove());
    }
}
