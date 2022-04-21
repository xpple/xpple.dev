import {Directory} from "./directory.js";
import {isString} from "../utils.js";
import {IllegalArgumentError} from "../../errors/illegal-argument-error.js";

export class File {

    /**
     * @type {RegExp}
     */
    static #pattern = /^[a-zA-Z ]+\.[a-zA-Z]+$/;

    /**
     * @type {String}
     */
    #content = "";

    /**
     * @param {String} name
     * @param {Directory} parent
     */
    constructor(name, parent) {
        if (isString(name)) {
            if (File.#pattern.test(name)) {
                this.name = name;
            } else {
                throw new IllegalArgumentError("File name is invalid.");
            }
        } else {
            throw new TypeError();
        }
        if (parent instanceof Directory) {
            this.parent = parent;
        } else {
            throw new TypeError();
        }
    }

    /**
     * @returns {String}
     */
    getContent() {
        return this.#content;
    }

    /**
     * @param {String | Number} string
     */
    write(string) {
        if (isString(string)) {
            this.#content = string;
            return;
        }
        if (string instanceof Number) {
            this.#content = string.toString(10);
        }
    }
}
