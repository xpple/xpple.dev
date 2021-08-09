import {getUser, setColour, setUser} from "../../parser/displayer.js";
import {Command} from "../command.js";

export class ResetCommand extends Command {

    constructor() {
        super("reset");
    }

    execute(context) {
        setUser("xpple");
        setColour("red");
        document.querySelector("#cli-input-container > span").innerHTML = getUser() + "@main:~$&nbsp;";
    }
}
