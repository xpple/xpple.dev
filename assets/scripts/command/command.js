export /*abstract*/ class Command {

    static commands = new Map();

    static register(command) {
        if (!(command instanceof Command)) {
            return;
        }
        Command.commands.set(command.rootLiteral, command);
    }

    constructor(rootLiteral) {
        if (this.constructor === Command) {
            throw new Error("Object of Abstract Class cannot be created");
        }
        this.rootLiteral = rootLiteral;
    }

    async execute(context) {
        throw new Error("Method of Abstract Class cannot be called");
    }
}
