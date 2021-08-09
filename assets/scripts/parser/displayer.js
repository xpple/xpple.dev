import {Parser} from "./parser.js";
import {CommandSyntaxError} from "../errors/command-syntax-error.js";
import {XdgOpenCommand} from "../command/commands/xdg-open-command.js";
import {HelpCommand} from "../command/commands/help-command.js";
import {IpCommand} from "../command/commands/ip-command.js";
import {XppleCommand} from "../command/commands/xpple-command.js";
import {ClearCommand} from "../command/commands/clear-command.js";
import {DiscordCommand} from "../command/commands/discord-command.js";
import {PingCommand} from "../command/commands/ping-command.js";
import {ResetCommand} from "../command/commands/reset-command.js";
import {SettingsCommand} from "../command/commands/settings-command.js";
import {Command} from "../command/command.js";
import {Path} from "../file_system/path.js";
import {CdCommand} from "../command/commands/cd-command.js";
import {IllegalArgumentError} from "../errors/illegal-argument-error.js";

document.querySelector(".input").focus();

let cliContainer = document.querySelector("#cli-container");
let cliInputContainer = document.querySelector("#cli-input-container");
let inputField = document.querySelector(".input");

let history = [];
let n = 0;

let colour = "red";
let user = "xpple";
let currentDir = new Path(window.location.origin, ["~"]);

Command.register(new CdCommand());
Command.register(new ClearCommand());
Command.register(new DiscordCommand());
Command.register(new HelpCommand());
Command.register(new IpCommand());
Command.register(new PingCommand());
Command.register(new ResetCommand());
Command.register(new SettingsCommand());
Command.register(new XdgOpenCommand());
Command.register(new XppleCommand());

cliInputContainer.addEventListener('keydown', async(e) => {
    if (e.key === "Enter" && e.shiftKey === false && inputField.value !== "") {
        const input = inputField;
        solidify(input);
        const parser = new Parser(input.value);
        try {
            await parser.parse();
        } catch (e) {
            if (e instanceof CommandSyntaxError || IllegalArgumentError) {
                insertHTML(e.getName());
            } else {
                insertHTML("UnknownError");
            }
        }
        history.push(input.value);
        input.value = "";
        newLine();
        input.focus();
        n = history.length;
    } else if (e.key === "Enter" && e.shiftKey === true) {
        //newCodeLine();
    } else if (e.key === "ArrowUp" && n > 0) {
        n--;
        inputField.value = history[n];
    } else if (e.key === "ArrowDown" && n < history.length - 1) {
        n++;
        inputField.value = history[n];
    }
});

function solidify(element) {
    cliContainer.insertAdjacentHTML("beforeend",
        "<span class='jetbrains red'>" + user + "@main:" + getCurrentDir().path + "$&nbsp;</span><span class='jetbrains white'>" + sanitize(element.value) + "</span><br />");
}

function newLine() {
    cliContainer.appendChild(cliInputContainer);
}

export function insertHTML(content) {
    let output = document.querySelector("#output").content.cloneNode(true);
    let span = output.querySelector("span");
    span.setAttribute("class", "jetbrains");
    span.style.color = colour;
    span.innerHTML = sanitize(content);
    cliContainer.appendChild(output);
}

export function sanitize(string) {
    let element = document.createElement("div");
    element.innerText = string;
    return element.innerHTML;
}

export function getUser() {
    return user;
}

export function setUser(newUser) {
    user = newUser;
}

export function getColour() {
    return colour;
}

export function setColour(newColour) {
    colour = newColour;
}

export function getCurrentDir() {
    return currentDir;
}

export function setCurrentDir(newCurrentDir) {
    currentDir = newCurrentDir;
}