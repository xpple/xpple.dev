import {Directory} from "./directory.js";
import {CommandHandler} from "../command-handler.js";

export class FileManager {

    /**
     * @type {Directory}
     */
    static #root = undefined;
    /**
     * @type {Directory}
     */
    static #currentDirectory = undefined;

    static init() {
        this.#root = new Directory("~", null, true);
        this.setCurrentDirectory(this.#root);
    }

    /**
     * @returns {Directory}
     */
    static getRoot() {
        return this.#root;
    }

    /**
     * @returns {Directory}
     */
    static getCurrentDirectory() {
        return this.#currentDirectory;
    }

    /**
     * @param {Directory} directory
     */
    static setCurrentDirectory(directory) {
        if (directory instanceof Directory) {
            this.#currentDirectory = directory;
            let dirString = directory.name;
            while (directory.parent !== null) {
                directory = directory.parent;
                dirString = directory.name + '/' + dirString;
            }
            const labels = CommandHandler.inputField.labels;
            if (labels.length !== 1) {
                throw new Error("Too many labels were associated to this input field.");
            }
            labels[0].querySelector("span").textContent = dirString;
            CommandHandler.prompt = labels[0].textContent;
        } else {
            throw new TypeError();
        }
    }
}
