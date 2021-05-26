document.querySelector(".input").focus();

let cliContainer = document.querySelector("#cli-container");
let cliInputContainer = document.querySelector("#cli-input-container");
let inputField = document.querySelector(".input");

let history = [];
let n = 0;

let colour = "red";
let user = "xpple";
let os = "windows";

cliInputContainer.addEventListener('keydown', async(e) => {
    if (e.key === "Enter" && e.shiftKey === false && inputField.value !== "") {
        const input = inputField;
        solidify(input);
        let parser = new Parser(input.value);
        await parser.parse();
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
        "<span class='jetbrains red'>" + getPathFromOs(os) + "&nbsp;</span><span class='jetbrains white'>" + sanitizeHTML(element.value) + "</span><br />");
}

function newLine() {
    cliContainer.appendChild(cliInputContainer);
}

function insertHTML(content) {
    let output = document.querySelector("#output").content.cloneNode(true);
    let span = output.querySelector("span");
    span.setAttribute("class", "jetbrains " + colour);
    span.innerHTML = sanitize(content);
    cliContainer.appendChild(output);
}

function sanitize(string) {
    let element = document.createElement("div");
    element.innerText = string;
    return element.innerHTML;
}

function getPathFromOs(os) {
    switch (os) {
        case "windows" :
            return "PS C:\\Users\\" + user + ">";
        case "linux" :
            return "[" + user + "@PC-" + user + " /home/" + user + "/~]$";
        case "mac" :
            return user + ":~"
    }
}
