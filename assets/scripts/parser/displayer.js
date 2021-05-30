import {Parser} from "./parser";
import {CommandSyntaxError} from "../errors/command-syntax-error";

document.querySelector(".input").focus();

let cliContainer = document.querySelector("#cli-container");
let cliInputContainer = document.querySelector("#cli-input-container");
let inputField = document.querySelector(".input");

let history = [];
let n = 0;

export let colour = "red";
export let user = "xpple";

cliInputContainer.addEventListener('keydown', async(e) => {
    if (e.key === "Enter" && e.shiftKey === false && inputField.value !== "") {
        const input = inputField;
        solidify(input);
        const parser = new Parser(input.value);
        try {
            await parser.parse();
        } catch (e) {
            if (e instanceof CommandSyntaxError) {
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
        "<span class='jetbrains red'>" + user + "@main:~$&nbsp;</span><span class='jetbrains white'>" + sanitize(element.value) + "</span><br />");
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
