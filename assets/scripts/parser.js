document.querySelector(".input").focus();

let cliContainer = document.querySelector("#cli-container");
let cliInputContainer = document.querySelector("#cli-input-container");
let inputField = document.querySelector(".input");

let history = [];
let n = 0;

let colour = "red";
let user = "xpple";

cliInputContainer.addEventListener('keydown', async(e) => {
    if (e.key === "Enter" && e.shiftKey === false && inputField.value !== "") {
        const input = inputField;
        solidify(input);
        await parse(input);
        input.value = "";
        newLine();
        input.focus()

        n = history.length;
    }
    else if (e.key === "Enter" && e.shiftKey === true) {
        newCodeLine();
    }
    else if (e.key === "ArrowUp" && n > 0) {
        n--;
        inputField.value = history[n];
    }
    else if (e.key === "ArrowDown" && n < history.length - 1) {
        n++;
        inputField.value = history[n];
    }
});

function solidify(element) {
    cliContainer.insertAdjacentHTML("beforeend",
        "<span class='jetbrains red'>PS C:\\Users\\" + user + ">&nbsp;</span><span class='jetbrains white'>" + sanitizeHTML(element.value) + "</span><br />");
}

async function parse(string) {
    switch (string.value.split(" ")[0]) {
        case "ip": {
            const response = await fetch("utils.php?ip");

            if (!response.ok) {
                return;
            }

            const text = await response.text();

            insertHTML("beforeend", "jetbrains " + colour, text);
            break;}
        case "xpple": {
            insertHTML("beforeend", "jetbrains " + colour, "Hey!");
            break;}
        case "help": {
            switch (string.value.split(" ")[1]) {
                case "xpple": {
                    insertHTML("beforeend", "jetbrains " + colour, "Say hi!");
                    break;}
                case "ip": {
                    insertHTML("beforeend", "jetbrains " + colour, "Get your ip");
                    break;}
                case "help": {
                    insertHTML("beforeend", "jetbrains " + colour, "Usage: help target_command");
                    break;}
                case "ping": {
                    insertHTML("beforeend", "jetbrains " + colour, "Get your ping to the server");
                    break;}
                case "clear": {
                    insertHTML("beforeend", "jetbrains " + colour, "Clear out the screen");
                    break;}
                case "sudoku": {
                    insertHTML("beforeend", "jetbrains " + colour, "Solve a sudoku");
                    break;}
                case "settings": {
                    insertHTML("beforeend", "jetbrains " + colour, "Change your settings. Usage: settings target_name target_setting");
                    break;}
                default: {
                    insertHTML("beforeend", "jetbrains " + colour, "List of commands:");
                    const response = await fetch("https://xpple.dev/assets/data/list.json");

                    if (!response.ok) return;

                    const json = await response.json();

                    json.commands.forEach(element => insertHTML("beforeend", "jetbrains " + colour, element));
                    insertHTML("beforeend", "jetbrains " + colour, "To get help for any cmdlet or function, type: help command_name");
                }
            }
            break;}
        case "ping": {
            const response = await fetch("utils.php?ping");

            if (!response.ok) {
                return;
            }

            const text = await response.text();

            insertHTML("beforeend", "jetbrains " + colour, text + " ms");
            break;}
        case "clear": {
            document.querySelectorAll("#cli-container > br").forEach(element => element.remove());
            document.querySelectorAll("#cli-container > span").forEach(element => element.remove());
            break;}
        case "sudoku": {
            insertHTML("beforeend", "jetbrains " + colour, "Coming soon!")
            break;}
        case "settings": {
            switch (string.value.split(" ")[1]) {
                case "colour": {
                    switch (string.value.split(" ")[2]) {
                        case "red" : {
                            colour = "red";
                            break;}
                        case "blue" : {
                            colour = "blue";
                            break;}
                        case "white" : {
                            colour = "white";
                            break;}
                        case "black" : {
                            colour = "black";
                            break;}
                        default: {
                            insertHTML("beforeend", "jetbrains " + colour,
                                "Error: unrecognized or incomplete command line.");
                            break;}
                    }
                    break;}
                case "user": {
                    if (string.value.split(" ")[2] !== undefined && string.value.split(" ")[2].trim()) {
                        user = string.value.split(" ")[2];
                        document.querySelector("#cli-input-container > span").innerHTML = "PS C:\\Users\\" + user + ">&nbsp;";
                    }
                    else {
                        insertHTML("beforeend", "jetbrains " + colour, "Invalid user.");
                    }
                    break;}
                default: {
                    insertHTML("beforeend", "jetbrains " + colour,
                        "Usage: settings target_name target_setting");
                    break;}
            }
            break;}
        default: {
            insertHTML("beforeend", "jetbrains " + colour, string.value + " : The term '" + string.value +
                "' is not recognized as the name of a cmdlet, function, script file, or operable program. " +
                "Check the spelling of the name, or if a path was included that the path is correct " +
                "and try again.");
            break;}
    }
    history.push(string.value);
}

function newLine() {
    cliContainer.appendChild(cliInputContainer);
}

function newCodeLine() {
    cliContainer.insertAdjacentHTML("beforeend",
        '<br /><span class="jetbrains red">>> </span><input type="text" class="code-input jetbrains red">');
}

function insertHTML(where, tags, content) {
    cliContainer.insertAdjacentHTML(where, "<span class='" + tags + "'>" + sanitizeHTML(content) + "</span><br />");
}
function sanitizeHTML(HTML) {
    let element = document.createElement("div");
    element.innerText = HTML;
    return element.innerHTML;
}