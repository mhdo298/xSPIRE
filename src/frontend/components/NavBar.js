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
        const bar = document.createElement('div');
        bar.id = 'navbar'

        const list = document.createElement('ul');
        Views.singleton().allViews().forEach(view => {
            const line = document.createElement('li');
            const url = document.createElement('a');
            url.href = '#' + view.url;
            url.innerText = view.navbar;
            url.addEventListener('click', async (event) => {
                    event.preventDefault()
                    await this.#events.call('changeView', view)
                }
            )
            line.appendChild(url);
            list.appendChild(line);
        })

        bar.appendChild(list);
        return bar
    }
}