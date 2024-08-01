import {Homepage} from "../views/Homepage";

export class Logo {
    static #singleton = null;

    static getComponent() {
        return this.#singleton || (this.#singleton = new Logo());
    }


    constructor() {
    }

    async render() {
        const logo = document.createElement('a');
        logo.href = Homepage.getView();
        logo.classList.add('logo');
        logo.innerHTML = 'xSPIRE';
        return logo
    }
}