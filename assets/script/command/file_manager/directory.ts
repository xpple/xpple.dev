import {File} from "./file.js";
import {isString} from "../utils.js";
import {IllegalArgumentError} from "../../errors/illegal-argument-error.js";

export class Directory {

    static #pattern: RegExp = /^[a-zA-Z ]+$/;

    #files: Map<string, File> = new Map();

    #directories: Map<string, Directory> = new Map();

    #isRoot: boolean = false;

    public constructor(public name: string, public parent?: Directory, isRoot: boolean = false) {
        if (isRoot) {
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

    public getFiles(): Map<string, File> {
        return this.#files;
    }

    public getDirectories(): Map<string, Directory> {
        return this.#directories;
    }

    public isRoot(): boolean {
        return this.#isRoot;
    }

    public addFile(file: File): boolean {
        if (file instanceof File) {
            if (this.#files.has(file.name)) {
                return false;
            }
            this.#files.set(file.name, file);
            return true;
        }
        throw new TypeError();
    }

    public addDirectory(directory: Directory): boolean {
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

    public deleteFile(file: File | string): boolean {
        if (file instanceof File) {
            return this.#files.delete(file.name);
        }
        if (isString(file)) {
            return this.#files.delete(file);
        }
        throw new TypeError();
    }

    public deleteDirectory(directory: Directory | string): boolean {
        if (directory instanceof Directory) {
            return this.#directories.delete(directory.name);
        }
        if (isString(directory)) {
            return this.#directories.delete(directory);
        }
        throw new TypeError();
    }
}
