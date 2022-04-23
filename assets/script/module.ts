import {CommandHandler} from "./command/command-handler.js";
import {FileManager} from "./command/file_system/file-manager.js";
import {WebStorageManager} from "./web-storage-manager.js";

CommandHandler.init();
FileManager.init();
WebStorageManager.loadDirectoriesAndFiles();
