import {ArgumentType} from "../argument-type.js";
import {StringReader} from "../string-reader.js";
import {FileManager} from "../../file_system/file-manager.js";
import {Directory} from "../../file_system/directory.js";

export class ExistingDirectoryArgument implements ArgumentType<Directory> {

    private currentDirectory: Directory;

    public constructor(currentDirectory?: Directory) {
        this.currentDirectory = currentDirectory ?? FileManager.getCurrentDirectory();
    }

    public parse(reader: StringReader): Directory {
        if (reader.canRead()) {
            if (reader.peek() === '~') {
                reader.skip();
                this.currentDirectory = FileManager.getRoot();
                if (reader.canRead()) {
                    reader.expect('/');
                }
            }
        }
        while (reader.canRead()) {
            if (reader.peek() === '.') {
                reader.skip();
                if (reader.canRead()) {
                    if (reader.peek() === '.') {
                        reader.skip();
                        if (this.currentDirectory.parent !== undefined) {
                            this.currentDirectory = this.currentDirectory.parent;
                        }
                    }
                }
            } else {
                const cursor = reader.getCursor();
                const dirString = reader.readString();
                const dir = this.currentDirectory.getDirectories().get(dirString);
                if (dir === undefined) {
                    reader.setCursor(cursor);
                    return this.currentDirectory;
                }
                this.currentDirectory = dir;
            }
            if (reader.canRead()) {
                if (reader.peek() === '/') {
                    reader.skip();
                }
            }
        }
        return this.currentDirectory;
    }
}
