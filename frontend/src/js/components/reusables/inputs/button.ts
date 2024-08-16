import {ElementClass, ElementInfo} from "../../../base";

export class Button extends ElementClass {

    handler: (b: Button, evt: Event) => void;

    constructor(node: ElementInfo, handler: (b: Button, evt: Event) => void = () => {
    }) {
        super('button')
        this.extend(node).extend({
            props: {'type': 'button'},
            events: {
                click: (self, evt) => {
                    this.handler(this, evt)
                },
            }
        })
        this.handler = handler
    }
}