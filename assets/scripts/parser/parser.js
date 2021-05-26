class Parser {

    constructor(string) {
        this.string = string;
        this.stringReader = new StringReader(this.string);
    }

    async parse() {
        switch (this.stringReader.readString()) {
            case "ip" :
                await this.ip();
                break;
            case "xpple" :
                await this.xpple();
                break;
            case "help" :
                await this.help();
                break;
            case "ping" :
                await this.ping();
                break;
            case "clear" :
                await this.clear();
                break;
            case "settings" :
                await this.settings();
                break;
            case "reset" :
                await this.reset();
                break;
            default :
                insertHTML("beforeend", "jetbrains " + colour, this.string + " : The fuck is that supposed to mean?");
                break;
        }
    }

    async ip() {
        const response = await fetch("utils.php?ip");

        if (!response.ok) {
            return;
        }

        const text = await response.text();

        insertHTML("beforeend", "jetbrains " + colour, text);
    }

    async xpple() {
        insertHTML("beforeend", "jetbrains " + colour, "Hey!");
    }

    async help() {
        switch (this.stringReader.readString()) {
            case "xpple" :
                insertHTML("beforeend", "jetbrains " + colour, "Say hi!. Usage: xpple");
                break;
            case "ip" :
                insertHTML("beforeend", "jetbrains " + colour, "Get your ip. Usage: ip");
                break;
            case "help" :
                insertHTML("beforeend", "jetbrains " + colour, "Usage: help target_command");
                break;
            case "ping" :
                insertHTML("beforeend", "jetbrains " + colour, "Get your ping to the server. Usage: ping");
                break;
            case "clear" :
                insertHTML("beforeend", "jetbrains " + colour, "Clear out the screen. Usage: clear");
                break;
            case "sudoku" :
                insertHTML("beforeend", "jetbrains " + colour, "Solve a sudoku. Coming soon.");
                break;
            case "settings" :
                insertHTML("beforeend", "jetbrains " + colour, "Change your settings. Usage: settings target_name target_setting");
                break;
            default :
                insertHTML("beforeend", "jetbrains " + colour, "List of commands:");
                const response = await fetch("https://xpple.dev/assets/data/list.json");

                if (!response.ok) {
                    return;
                }

                const json = await response.json();

                json.commands.forEach(element => insertHTML("beforeend", "jetbrains " + colour, element));
                insertHTML("beforeend", "jetbrains " + colour, "To get help for any cmdlet or function, type: help command_name");
        }
    }

    async ping() {
        const response = await fetch("utils.php?ping");

        if (!response.ok) {
            return;
        }

        const text = await response.text();

        insertHTML("beforeend", "jetbrains " + colour, text + " ms");
    }

    async clear() {
        document.querySelectorAll("#cli-container > br").forEach(element => element.remove());
        document.querySelectorAll("#cli-container > span").forEach(element => element.remove());
    }

    async settings() {
        switch (this.stringReader.readString()) {
            case "colour" :
                switch (this.stringReader.readString()) {
                    case "red" :
                        colour = "red";
                        break;
                    case "blue" :
                        colour = "blue";
                        break;
                    case "white" :
                        colour = "white";
                        break;
                    case "black" :
                        colour = "black";
                        break;
                    default :
                        insertHTML("beforeend", "jetbrains " + colour,
                            "That ain't a colour.");
                        break;
                }
                break;
            case "user" :
                let parsedString = this.stringReader.readString();
                if (parsedString !== undefined) {
                    user = sanitizeHTML(parsedString);
                    document.querySelector("#cli-input-container > span").innerHTML = getPathFromOs(os) + "&nbsp;";
                } else {
                    insertHTML("beforeend", "jetbrains " + colour, "Shit's invalid.");
                }
                break;
            case "os" :
                switch (this.stringReader.readString()) {
                    case "windows" :
                        os = "windows";
                        document.querySelector("#cli-input-container > span").innerHTML = getPathFromOs(os) + "&nbsp;";
                        break;
                    case "linux" :
                        os = "linux";
                        document.querySelector("#cli-input-container > span").innerHTML = getPathFromOs(os) + "&nbsp;";
                        break;
                    case "mac" :
                        os = "mac";
                        document.querySelector("#cli-input-container > span").innerHTML = getPathFromOs(os) + "&nbsp;";
                        break;
                    default:
                        insertHTML("beforeend", "jetbrains " + colour,
                            "Never heard of that.");
                        break;
                }
                break;
            default:
                insertHTML("beforeend", "jetbrains " + colour,
                    "Usage: settings target_name target_setting");
                break;
        }
    }

    async reset() {
        user = "xpple";
        colour = "red";
        os = "windows";
        document.querySelector("#cli-input-container > span").innerHTML = getPathFromOs(os) + "&nbsp;";
    }
}
