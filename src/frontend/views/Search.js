import {View} from "../state-management/Views.js";

export class Search extends View {
    static #singleton = null;

    static getView() {
        return this.#singleton || (this.#singleton = new Search());
    }

    constructor() {
        super({
            name: 'search-home',
            navbar: 'Search courses'
        });
    }

    render() {
        const view = super.render({title: 'Find a course!'});
        const searchDiv = document.createElement("div");
        searchDiv.classList.add("container");
        view.appendChild(searchDiv);

        const mainInput = document.createElement("input");
        mainInput.type = "text";
        mainInput.id = "main-keywords";
        mainInput.placeholder = 'Search keywords in course name, description, etc.';
        searchDiv.appendChild(mainInput);

        return view
    }
}
