document.querySelector(".input").focus();

let cliContainer = document.querySelector("#cli-container");
let cliInputContainer = document.querySelector("#cli-input-container");
let inputField = document.querySelector(".input");

let history = [];
let n = 0;

inputField.addEventListener('keydown', async(e) => {
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
        "<span class='jetbrains red'>PS C:\\Users\\xpple>&nbsp</span><span class='jetbrains white'>" + element.value + "</span><br />");
}

async function parse(string) {
    switch (string.value.split(" ")[0]) {
        case "ip": {
            const response = await fetch("utils.php?ip");

            if (!response.ok) {
                return;
            }

            const text = await response.text();

            cliContainer.insertAdjacentHTML("beforeend",
                "<span class='jetbrains red'>" + text + "</span><br />");
            break;}
        case "xpple": {
            cliContainer.insertAdjacentHTML("beforeend",
                "<span class='jetbrains red'>Hey!</span><br />");
            break;}
        case "help": {
            const response = await fetch("https://xpple.dev/assets/data/list.json");

            if (!response.ok) return;

            const json = await response.json();

            json.commands.forEach(element => cliContainer.insertAdjacentHTML("beforeend",
                "<span class='jetbrains red'>" + element + "</span><br />"));
            break;}
        case "ping": {
            const response = await fetch("utils.php?ping");

            if (!response.ok) {
                return;
            }

            const text = await response.text();

            cliContainer.insertAdjacentHTML("beforeend",
                "<span class='jetbrains red'>" + text + " ms</span><br />");
            break;}
        case "clear": {
            document.querySelectorAll("#cli-container > br").forEach(element => element.remove());
            document.querySelectorAll("#cli-container > span").forEach(element => element.remove());
            break;}
        case "sudoku": {
            cliContainer.insertAdjacentHTML("beforeend",
                "<span class='jetbrains red'>Coming soon!</span><br />");
            break;}
        default: {
            cliContainer.insertAdjacentHTML("beforeend",
                "<span class='jetbrains red'>" + string.value + " : The term '" + string.value +
                "' is not recognized as the name of a cmdlet, function, script file, or operable program. " +
                "Check the spelling of the name, or if a path was included that the path is correct " +
                "and try again.</span><br />");
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