import {View} from "../state-management/Views.js";

export class Search extends View {
    static #singleton = null;

    static getView() {
        return this.#singleton || (this.#singleton = new Search());
    }

    constructor() {
        super('search-home');
    }

    render() {
        const searchView = document.createElement("div");
        searchView.id = this.name
        const title = document.createElement("h1");
        title.innerText = 'Find a course!';
        searchView.appendChild(title)
        return searchView
    }
}
