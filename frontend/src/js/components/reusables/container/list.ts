import {ElementClass, ElementInfo, ElementNode, hook} from "../../../base";

export class ListItem extends ElementClass {
    constructor(node: Partial<ElementNode>) {
        super('li')
        this.extend(node)
    }
}

export class List<T> extends ElementClass {

    list: () => T[];
    toComponent: (_: T, index: number) => ListItem

    constructor(node: ElementInfo, list: () => T[] = () => [], toComponent: (_: T, index: number) => ListItem = () => new ListItem({})) {
        super('ul');
        this.extend(node).extend({
            update: () => {
                this.children = this.list().map(this.toComponent)
            },
        })
        this.list = list
        this.toComponent = toComponent
    }


}