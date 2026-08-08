import {Directory} from "./directory.js";

export abstract class INode {
    protected constructor(public name: string, public parent?: Directory) {
    }

    public getPath(): string {
        const parts = [];

        let directory: Directory | undefined;

        do {
            let currentINode: INode = directory ?? this;

            parts.push(currentINode.name);

            directory = currentINode.parent;
        } while (directory !== undefined)

        parts.reverse();

        return parts.join('/');
    }
}
