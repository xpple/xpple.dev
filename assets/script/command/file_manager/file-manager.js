import {Directory} from "./directory.js";
import {CommandHandler} from "../command-handler.js";
import {isString} from "../utils.js";
import {File} from "./file.js";

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

    /**
     * @param {Directory} directory
     * @returns {Object}
     */
    static serialise(directory) {
        let contents = {};
        for (const dir of directory.getDirectories().values()) {
            const tmp = this.serialise(dir);
            contents = {...contents, ...tmp};
        }
        for (const [name, file] of directory.getFiles()) {
            contents = {...contents, ...{[name]: file.getContent()}};
        }
        return {
            [directory.name]: {
                ...contents
            }
        };
    }

    /**
     * @param {Object} object
     * @param {Directory} directory - The directory to deserialise into.
     */
    static deserialise(object, directory) {
        for (const [key, value] of Object.entries(object)) {
            if (isString(value)) {
                const file = new File(key, directory);
                file.write(value);
                directory.addFile(file);
            } else {
                const dir = new Directory(key, directory);
                this.deserialise(value, dir);
                directory.addDirectory(dir);
            }
        }
    }
}
