import {FileManager} from "../file_manager/file-manager.js";
import {IllegalArgumentError} from "../../errors/illegal-argument-error.js";

export class PathArgument {

    /**
     * @param {StringReader} reader
     * @returns {Directory}
     */
    parse(reader) {
        let currentDirectory = FileManager.getCurrentDirectory();
        while (reader.canRead()) {
            if (reader.peek() === '.') {
                reader.read();
                if (reader.canRead()) {
                    if (reader.peek() === '.') {
                        reader.read();
                        if (currentDirectory.parent !== null) {
                            currentDirectory = currentDirectory.parent;
                        }
                        if (reader.canRead()) {
                            if (reader.peek() === '/') {
                                reader.read();
                            }
                        }
                    } else if (reader.peek() === '/') {
                        reader.skip();
                    } else {
                        throw new IllegalArgumentError("Expected '.' or '/'.");
                    }
                }
            } else if (reader.peek() === '~') {
                reader.read();
                currentDirectory = FileManager.getRoot();
                if (reader.canRead()) {
                    if (reader.peek() === '/') {
                        reader.read();
                    }
                }
            } else {
                const dirString = reader.readString();
                const dir = currentDirectory.getDirectories().get(dirString);
                if (dir === undefined) {
                    throw new IllegalArgumentError("Directory does not exist.");
                }
                currentDirectory = dir;
                if (reader.canRead()) {
                    if (reader.peek() === '/') {
                        reader.read();
                    }
                }
            }
        }
        return currentDirectory;
    }
}
