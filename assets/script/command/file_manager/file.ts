import {Directory} from "./directory.js";
import {isString} from "../utils.js";
import {IllegalArgumentError} from "../../errors/illegal-argument-error.js";

export class File {

    static #pattern: RegExp = /^[a-zA-Z ]+\.[a-zA-Z]+$/;

    #content: string = "";

    public constructor(public name: string, public parent: Directory) {
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

    public getContent(): string {
        return this.#content;
    }

    public write(string: string | number) {
        if (isString(string)) {
            this.#content = string;
            return;
        } else {
            this.#content = string.toString(10);
        }
    }
}
