import {getUser, insertHTML, sanitize, setColour, setUser} from "../../parser/displayer.js";
import {Command} from "../command.js";

export class SettingsCommand extends Command {

    constructor() {
        super("settings");
    }

    execute(context) {
        context.skip();
        switch (context.readString().toLowerCase()) {
            case "colour" :
                context.skip();
                let parsedColour = context.readString().toLowerCase();
                let style = new Option().style;
                style.color = parsedColour;

                if (style.color !== "") {
                    setColour(parsedColour);
                } else {
                    insertHTML("Shit's invalid.");
                }
                break;
            case "user" :
                context.skip();
                let parsedUser = context.readString().toLowerCase();
                if (parsedUser !== undefined) {
                    setUser(sanitize(parsedUser));
                    document.querySelector("#cli-input-container > span").innerHTML = getUser() + "@main:~$&nbsp;";
                } else {
                    insertHTML("Shit's invalid.");
                }
                break;
            default:
                insertHTML("Usage: settings target_name target_setting");
                break;
        }
    }
}
