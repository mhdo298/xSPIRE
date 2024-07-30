import {NavBar} from "./components/NavBar.js";
import {Homepage} from "./views/Homepage.js";
import {Search} from "./views/Search.js";
import {Schedule} from "./views/Schedule.js";
import {Events} from "./state-management/Events.js";

export class App {
    #mainDiv = null

    constructor() {
        [Homepage, Schedule, Search].forEach(view => view.getView())
    }

    async render(from) {
        const root = document.getElementById(from);
        root.innerHTML = ''

        const navbar = NavBar.getComponent();
        root.appendChild(await navbar.render());

        this.#mainDiv = document.createElement('div')
        this.#mainDiv.id = 'main-view'

        root.appendChild(this.#mainDiv);

        await this.#navigateTo(Homepage.getView())
        Events.singleton().subscribe('changeView', async view => await this.#navigateTo(view))
    }

    async #navigateTo(view) {
        this.#mainDiv.innerHTML = '';
        window.location.hash = view.url
        this.#mainDiv.appendChild(await view.render());
    }

}

const app = new App();
await app.render('root');