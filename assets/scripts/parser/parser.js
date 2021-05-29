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
                insertHTML(this.string + " : The fuck is that supposed to mean?");
                break;
        }
    }

    async ip() {
        const response = await fetch("utils.php?ip");

        if (!response.ok) {
            return;
        }

        const text = await response.text();

        insertHTML(text);
    }

    async xpple() {
        insertHTML("Hey!");
    }

    async help() {
        this.stringReader.skip();
        switch (this.stringReader.readString()) {
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
            default :
                insertHTML("List of commands:");
                const response = await fetch("https://xpple.dev/assets/data/list.json");

                if (!response.ok) {
                    return;
                }

                const json = await response.json();

                json.commands.forEach(element => insertHTML(element));
                insertHTML("To get help for any cmdlet or function, type: help command_name");
        }
    }

    async ping() {
        const response = await fetch("utils.php?ping");

        if (!response.ok) {
            return;
        }

        const text = await response.text();

        insertHTML(text + " ms");
    }

    async clear() {
        document.querySelectorAll("#cli-container > br").forEach(element => element.remove());
        document.querySelectorAll("#cli-container > span").forEach(element => element.remove());
    }

    async settings() {
        this.stringReader.skip();
        switch (this.stringReader.readString()) {
            case "colour" :
                this.stringReader.skip();
                let parsedColour = this.stringReader.readString();
                let style = new Option().style;
                style.color = parsedColour;

                if (style.color !== "") {
                    colour = parsedColour;
                } else {
                    insertHTML("Shit's invalid.");
                }
                break;
            case "user" :
                this.stringReader.skip();
                let parsedUser = this.stringReader.readString();
                if (parsedUser !== undefined) {
                    user = sanitize(parsedUser);
                    document.querySelector("#cli-input-container > span").innerHTML = user + "@main:~$&nbsp;";
                } else {
                    insertHTML("Shit's invalid.");
                }
                break;
            default:
                insertHTML("Usage: settings target_name target_setting");
                break;
        }
    }

    async reset() {
        user = "xpple";
        colour = "red";
        document.querySelector("#cli-input-container > span").innerHTML = user + "@main:~$&nbsp;";
    }
}
