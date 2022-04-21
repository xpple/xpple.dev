import {File} from "./file.js";
import {isString} from "../utils.js";
import {IllegalArgumentError} from "../../errors/illegal-argument-error.js";

export class Directory {

    /**
     * @type {RegExp}
     */
    static #pattern = /^[a-zA-Z ]+$/;

    /**
     * @type {Map<String, File>}
     */
    #files = new Map();

    /**
     * @type {Map<String, Directory>}
     */
    #directories = new Map();

    /**
     * @type {Boolean}
     */
    #isRoot = false;

    /**
     * @param {String} name
     * @param {Directory} parent
     * @param {Boolean} [isRoot=false]
     */
    constructor(name, parent, isRoot = false) {
        if (isRoot) {
            this.name = name;
            this.parent = parent;
            this.#isRoot = true;
            return;
        }
        if (isString(name)) {
            if (Directory.#pattern.test(name)) {
                this.name = name;
            } else {
                throw new IllegalArgumentError("Directory name is invalid.");
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
     * @returns {Map<String, File>}
     */
    getFiles() {
        return this.#files;
    }

    /**
     * @returns {Map<String, Directory>}
     */
    getDirectories() {
        return this.#directories;
    }

    /**
     * @returns {Boolean}
     */
    isRoot() {
        return this.#isRoot;
    }

    /**
     * @param {File} file
     * @returns {Boolean}
     */
    addFile(file) {
        if (file instanceof File) {
            if (this.#files.has(file.name)) {
                return false;
            }
            this.#files.set(file.name, file);
            return true;
        }
        throw new TypeError();
    }

    /**
     * @param {Directory} directory
     * @returns {Boolean}
     */
    addDirectory(directory) {
        if (directory instanceof Directory) {
            if (directory.isRoot()) {
                return false;
            }
            if (this.#directories.has(directory.name)) {
                return false;
            }
            this.#directories.set(directory.name, directory);
            return true;
        }
        throw new TypeError();
    }

    /**
     * @param {File | String} file
     * @returns {Boolean}
     */
    deleteFile(file) {
        if (file instanceof File) {
            return this.#files.delete(file.name);
        }
        if (isString(file)) {
            return this.#files.delete(file);
        }
        throw new TypeError();
    }

    /**
     * @param {Directory | String} directory
     * @returns {Boolean}
     */
    deleteDirectory(directory) {
        if (directory instanceof Directory) {
            return this.#directories.delete(directory.name);
        }
        if (isString(directory)) {
            return this.#directories.delete(directory);
        }
        throw new TypeError();
    }
}
