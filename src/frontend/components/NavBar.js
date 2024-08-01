import {Events} from "../state-management/Events.js";
import {Views} from "../state-management/Views.js";

export class NavBar {
    static #singleton = null;

    static getComponent() {
        return this.#singleton || (this.#singleton = new NavBar());
    }

    #events;


    constructor() {
        this.#events = Events.singleton()
    }

    async render() {
        const bar = document.createElement('nav');
        bar.id = 'navbar'

        const list = document.createElement('ul');
        Views.singleton().navbarViews().forEach(view => {
            const line = document.createElement('li');
            list.appendChild(line);

            const url = document.createElement('a');
            url.href = view.uri;
            url.innerText = view.navbar;
            url.addEventListener('click', async (event) => {
                    event.preventDefault()
                    await this.#events.call('changeView', view.uri)
                }
            )
            line.appendChild(url);
        })

        bar.appendChild(list);
        return bar
    }
}