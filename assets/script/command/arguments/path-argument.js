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
                reader.skip();
                if (reader.canRead()) {
                    if (reader.peek() === '.') {
                        reader.skip();
                        if (currentDirectory.parent !== null) {
                            currentDirectory = currentDirectory.parent;
                        }
                    }
                }
            } else if (reader.peek() === '~') {
                reader.skip();
                currentDirectory = FileManager.getRoot();
            } else {
                const dirString = reader.readString();
                const dir = currentDirectory.getDirectories().get(dirString);
                if (dir === undefined) {
                    throw new IllegalArgumentError("Directory does not exist.");
                }
                currentDirectory = dir;
            }
            if (reader.canRead()) {
                if (reader.peek() === '/') {
                    reader.skip();
                }
            }
        }
        return currentDirectory;
    }
}