import {insertHTML} from "../../parser/displayer.js";
import {CommandSyntaxError} from "../../errors/command-syntax-error.js";
import {Command} from "../command.js";

export class PingCommand extends Command {

    constructor() {
        super("ping");
    }

    async execute(context) {
        const response = await fetch("utils.php?ping");

        if (!response.ok) {
            throw CommandSyntaxError();
        }

        const text = await response.text();

        insertHTML(text + " ms");
    }
}
