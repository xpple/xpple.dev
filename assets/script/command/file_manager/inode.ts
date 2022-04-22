import { Directory } from "./directory";

export abstract class INode {
    public constructor(public name: string, public parent?: Directory) {
    }
}
