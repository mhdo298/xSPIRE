import {View} from "../state-management/Views.js";

export class Homepage extends View {
    static #singleton = null;

    static getView() {
        return this.#singleton || (this.#singleton = new Homepage());
    }

    constructor() {
        super('homepage');
    }

    render() {
        const homepage = document.createElement("div");
        homepage.id = this.name
        const title = document.createElement("h1");
        title.innerText = 'Welcome to xSPIRE!';
        homepage.appendChild(title)
        return homepage
    }
}
