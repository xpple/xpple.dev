import {IllegalArgumentError} from "../errors/illegal-argument-error.js";

export class Path {

    static #SEPARATOR = "/";

    constructor(string, stringArray) {
        if (typeof string === "string" || string instanceof String) {
            this.absolute = string.startsWith(Path.#SEPARATOR);
            this.root = string;
        } else {
            throw new IllegalArgumentError();
        }
        if (Array.isArray(stringArray)) {
            this.path = stringArray.join(Path.#SEPARATOR);
        } else {
            this.path = "";
        }
    }

    isAbsolute() {
        return this.absolute;
    }

    getRoot() {
        return this.root;
    }

    getPath() {
        return this.path;
    }

    getFileName() {
        const lastIndex = this.path.lastIndexOf(Path.#SEPARATOR);
        if (lastIndex === -1) {
            return this.path;
        }
        return new Path(this.path.substring(lastIndex + 1, this.path.length));
    }

    getParent() {
        const lastIndex = this.path.lastIndexOf(Path.#SEPARATOR);
        if (lastIndex === -1) {
            return null;
        }
        const temp = this.path.substring(0, lastIndex);
        return new Path(this.root, temp.split(Path.#SEPARATOR));
    }

    getNameCount() {
        return this.path.split(Path.#SEPARATOR).length;
    }

    getName(index) {
        if (!Number.isInteger(index)) {
            throw IllegalArgumentError();
        }
        if (index < 0 || index >= this.getNameCount()) {
            throw IllegalArgumentError();
        }
        return this.path.split(Path.#SEPARATOR)[index];
    }

    startsWith(otherPath) {
        if (!(otherPath instanceof Path)) {
            return false;
        }
        if (this.root.startsWith(otherPath.root)) {
            return this.path.startsWith(otherPath.path);
        }
        return false;
    }

    resolve(otherPathString) {
        if (!(typeof otherPathString === "string" || otherPathString instanceof String)) {
            throw IllegalArgumentError();
        }
        if (this.path === "~" || this.path === "") {
            return new Path(this.root, otherPathString.split(Path.#SEPARATOR));
        }
        if (otherPathString === "~") {
            return new Path(this.root, ["~"]);
        }
        let temp = this;
        while (otherPathString.startsWith(".." + Path.#SEPARATOR)) {
            otherPathString = otherPathString.substring(otherPathString.indexOf(".." + Path.#SEPARATOR));
            temp = temp.getParent();
        }
        temp = temp.path.split(Path.#SEPARATOR).concat(otherPathString.split(Path.#SEPARATOR));
        return new Path(this.root, temp);
    }

    resolveSibling(otherPathString) {
        if (!(typeof otherPathString === "string" || otherPathString instanceof String)) {
            throw IllegalArgumentError();
        }
        const parent = this.getParent();
        return parent == null ? new Path(this.root, otherPathString) : parent.resolve(otherPathString);
    }

    async isFile() {
        const url = this.absolute ? this.root + this.path : window.location.href + this.path;
        const response = await fetch(url);
        return response.status !== 404;
    }

    /* async toFile() {
        if (!await this.isFile()) {
            return null;
        }
        const url = this.absolute ? window.location.origin + "/tree/" + this.path : window.location.href + this.path;
        const response = await fetch(url);
        if (!response.ok) {
            return null;
        }
        const text = await response.text();
        return new File([text], this.getFileName());
    } */

    toString() {
        return this.root + this.path;
    }
}
