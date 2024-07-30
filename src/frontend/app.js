import {NavBar} from "./components/NavBar.js";
import {Homepage} from "./views/Homepage.js";
import {Search} from "./views/Search.js";
import {Schedules} from "./views/Schedules.js";
import {Events} from "./state-management/Events.js";
import {Views} from "./state-management/Views.js";
import {ScheduleEditor} from "./views/ScheduleEditor.js";

export class App {
    #header = null
    #mainDiv = null
    #views = null
    #events = null

    constructor() {
        [Homepage, Schedules, Search, ScheduleEditor].forEach(view => view.getView())
        this.#views = Views.singleton()

        this.#events = Events.singleton()

        this.#header = document.createElement('header')
        document.body.appendChild(this.#header)

        this.#mainDiv = document.createElement('div')
        this.#mainDiv.id = 'main-view'
        this.#mainDiv.classList.add('container')
        document.body.appendChild(this.#mainDiv);
    }

    async render() {

        const headerContainer = document.createElement('div')
        headerContainer.classList.add('container')
        this.#header.appendChild(headerContainer)
        const navbar = NavBar.getComponent();
        headerContainer.appendChild(await navbar.render());


        await this.#navigateTo(document.location.href, false)
        this.#events.subscribe('changeView', async uri => await this.#navigateTo(uri, false))
        window.addEventListener("popstate", (event) => {
            this.#navigateTo(event.state, true)
        });
    }

    async #navigateTo(uri, back) {
        const url = new URL(uri, window.location)
        console.log(url)
        const view = this.#views.getView(url.pathname) || Homepage.getView();
        this.#mainDiv.innerHTML = '';
        if (!back) window.history.pushState(view.name, view.title, uri)
        this.#mainDiv.appendChild(await view.render());
    }

}

const app = new App();
await app.render();