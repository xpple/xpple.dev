import {insertHTML} from "../../parser/displayer.js";
import {Command} from "../command.js";

export class HelpCommand extends Command {

    constructor() {
        super("help");
    }

    async execute(context) {
        context.skip();
        switch (context.readString().toLowerCase()) {
            case "xpple" :
                insertHTML("Say hi!. Usage: xpple");
                break;
            case "ip" :
                insertHTML("Get your ip. Usage: ip");
                break;
            case "help" :
                insertHTML("Usage: help target_command");
                break;
            case "ping" :
                insertHTML("Get your ping to the server. Usage: ping");
                break;
            case "clear" :
                insertHTML("Clear out the screen. Usage: clear");
                break;
            case "settings" :
                insertHTML("Change your settings. Usage: settings target_name target_setting");
                break;
            case "reset":
                insertHTML("Reset your settings. Usage: reset")
                break;
            case "discord":
                insertHTML("Get the link to my Discord. Usage: discord")
                break;
            default :
                insertHTML("List of commands:");
                const response = await fetch("https://xpple.dev/assets/data/list.json");

                if (!response.ok) {
                    break;
                }

                const json = await response.json();

                json.commands.forEach(element => insertHTML(element));
                insertHTML("To get help for any cmdlet or function, type: help command_name");
                break;
        }
    }
}
