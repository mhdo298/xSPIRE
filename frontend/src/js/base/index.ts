export type ElementInfo = {
    events?: Record<string, (self: ElementNode, evt: Event) => void>;
    props?: Record<string, string>;
    classes?: string[];
    children?: (ElementNode | string)[];
    element?: HTMLElement; // where the rendering result is stored
    update?: (self: ElementNode) => (void | Promise<void>);
}


export type ElementNode = ElementInfo & {
    tag: string;
}


export class ElementClass implements ElementNode {
    tag: string;
    events: Record<string, (self: ElementNode, evt: Event) => void> = {};
    props: Record<string, string> = {};
    classes: string[] = [];
    children: (ElementNode | string)[] = [];
    element: HTMLElement; // where the rendering result is stored
    update?: (self: ElementNode) => (void | Promise<void>);

    constructor(tag: string) {
        this.tag = tag;
        this.element = document.createElement(tag)
    }

    extend(node: ElementInfo) {
        if (this.events) Object.assign(this.events, node.events)
        if (this.props) Object.assign(this.props, node.props)
        this.classes.push(...(node.classes || []))
        this.children.push(...(node.children || []))
        this.update = node.update
        return this
    }
}


export const refresh: (_: ElementNode) => Promise<Node> = async (node) => {

    const element = node.element || document.createElement(node.tag)
    if (node.update) await node.update(node)
    if (node.events) {
        const events = node.events
        Object.keys(events).forEach(key => element.addEventListener(key, (event: Event) =>
            events[key](node, event)
        ))
    }


    // add all classes
    if (node.classes) {
        element.className = '';
        element.classList.add(...node.classes);
    }
    // set all attributes
    if (node.props) {
        const props = node.props
        Object.keys(props).forEach(key => element.setAttribute(key, props[key]));
    }
    if (node.children) {
        // render all children
        element.replaceChildren(...(await Promise.all(node.children.map(child =>
            typeof child === 'string' ? document.createTextNode(child) : refresh(child)))))
    }
    return node.element = element
};

export function hook<T>(object: T, hooks: Record<string, Function>, context?: any) {
    for (let key in hooks) {
        const actual = key as keyof T
        const original = object[actual] as Function;
        object[actual] = makeHook(object, context, original, hooks[key]) as T[Extract<keyof T, string>]
    }
}

function makeHook<T extends Function>(originalContext: any, newContext: any, original: T, hook: T) {
    return (...args: any[]) => {
        hook.apply(newContext, args)
        return original.apply(originalContext, args)
    }
}