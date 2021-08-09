import {insertHTML} from "../../parser/displayer.js";
import {CommandSyntaxError} from "../../errors/command-syntax-error.js";
import {Command} from "../command.js";

export class IpCommand extends Command {

    constructor() {
        super("ip");
    }

    async execute(context) {
        const response = await fetch("utils.php?ip");

        if (!response.ok) {
            throw CommandSyntaxError();
        }

        const text = await response.text();

        insertHTML(text);
    }
}
