import {StringReader} from "./string-reader.js";
import {insertHTML} from "./displayer.js";
import {Command} from "../command/command.js";

export class Parser {

    constructor(string) {
        this.string = string;
        this.stringReader = new StringReader(this.string);
    }

    async parse() {
        const rootLiteral = this.stringReader.readString().toLowerCase();
        const command = Command.commands.get(rootLiteral);
        if (command === undefined) {
            insertHTML(this.string + " : The fuck is that supposed to mean?");
            return;
        }
        command.execute(this.stringReader);
    }
}
