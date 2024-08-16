import {ElementClass, ElementInfo, ElementNode} from "../../../base";

export class Textbox extends ElementClass {
    input: (b: Textbox, evt: Event) => void;
    enter: (b: Textbox, evt: Event) => void;
    inputBox: ElementNode;


    constructor(node: ElementInfo, label: string, input: (b: Textbox, evt: Event) => void = () => {
                }, enter: (b: Textbox, evt: Event) => void = () => {
                }
    ) {
        super('label')
        this.extend({
            children: [label,
                this.inputBox = new ElementClass('input').extend(node).extend({
                    props: {type: 'text'},
                    events: {
                        input: (_, evt) => {
                            this.input(this, evt)
                        },
                        keyup: (_, evt) => {
                            const e = evt as KeyboardEvent
                            if (e.key === 'Enter') {
                                this.enter(this, evt)
                            }
                        }
                    }
                })]
        })
        this.input = input
        this.enter = enter
    }

    get value(): string {
        return this.inputBox.element ? (this.inputBox.element as HTMLInputElement).value : '';
    }

    set value(value: string) {
        if (this.inputBox.element) (this.inputBox.element as HTMLInputElement).value = value
    }


}