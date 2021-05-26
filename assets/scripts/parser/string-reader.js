class StringReader {
    static isQuotedChar(char) {
        return char === '\"' || char === '\'';
    }

    static isWhitespace(char) {
        return char === ' ' || char === '\t';
    }

    constructor(string) {
        this.string = string;
        this.cursor = 0;
    }

    getString() {
        return this.string;
    }

    readString() {
        this.skipWhitespace();
        if (!this.canRead()) {
            return "";
        }
        const next = this.peek();
        if (StringReader.isQuotedChar(next)) {
            this.skip();
            return this.readQuotedString();
        }
        return this.readUnquotedString();
    }

    readUnquotedString() {
        const start = this.cursor;
        while (this.canRead() && !StringReader.isWhitespace(this.peek())) {
            this.skip();
        }
        return this.string.substring(start, this.cursor);
    }

    readQuotedString() {
        const start = this.cursor;
        while (this.canRead() && !StringReader.isQuotedChar(this.peek())) {
            this.skip();
        }
        return this.string.substring(start, this.cursor);
    }

    skipWhitespace() {
        while (this.canRead() && StringReader.isWhitespace(this.peek())) {
            this.skip();
        }
    }

    skip() {
        this.cursor++;
    }

    peek() {
        return this.string.charAt(this.cursor);
    }

    read() {
        return this.string.charAt(this.cursor++);
    }

    canRead() {
        return this.cursor <= this.string.length;
    }
}
