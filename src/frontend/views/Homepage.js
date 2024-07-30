import {View} from "../state-management/Views.js";

export class Homepage extends View {
    static #singleton = null;

    static getView() {
        return this.#singleton || (this.#singleton = new Homepage());
    }

    constructor() {
        super({
            name: 'homepage',
            navbar: 'Home'
        });
    }

    render() {
        const view = super.render({title: 'Welcome to xSPIRE!'})
        return view
    }
}
