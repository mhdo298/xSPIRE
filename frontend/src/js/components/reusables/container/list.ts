import {ElementClass, ElementInfo, ElementNode, hook, refresh} from "../../../base";

export class ListItem extends ElementClass {
    constructor(node: Partial<ElementNode>) {
        super('li')
        this.extend(node)
    }
}

export class List<T> extends ElementClass {

    list: () => T[] | Promise<T[]>;
    toComponent: (_: T, index: number) => ListItem | Promise<ListItem>
    refresh = true

    constructor(node: ElementInfo, list: () => T[] | Promise<T[]> = () => [], toComponent: (_: T, index: number) => ListItem | Promise<ListItem> = () => new ListItem({})) {
        super('ul');
        this.extend(node).extend({
            update: async () => {
                if (this.refresh) {
                    this.children = await Promise.all((await this.list()).map(this.toComponent))
                    this.refresh = false
                }
            },
        })
        this.list = list
        this.toComponent = toComponent
    }

    async add(...items: T[]) {
        this.children.push(...await Promise.all(items.map(this.toComponent)))
        await refresh(this)
    }
}