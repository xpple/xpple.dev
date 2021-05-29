class CommandSyntaxError extends Error {

    constructor(message) {
        super(message);
        this.name = "CommandSyntaxError";
    }

    getName() {
        return this.name;
    }
}
