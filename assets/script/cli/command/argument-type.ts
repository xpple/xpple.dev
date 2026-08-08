import {StringReader} from "./string-reader.js";

export interface ArgumentType<T> {
    parse(reader: StringReader): T
}
