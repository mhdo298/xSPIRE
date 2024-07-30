export class Views {
    static #singleton = null;

    static singleton() {
        return this.#singleton || (this.#singleton = new Views());
    }

    constructor() {
        this.views = [];
    }

    register(view) {
        this.views.push(view);
    }

    allViews() {
        return this.views;
    }

    navbarViews() {
        return this.views.filter(view => view.navbar);
    }

    getView(uri) {
        return this.views.find(view => uri === view.uri);
    }
}

export class View {
    name = ''
    uri = ''
    navbar = ''

    constructor(options) {
        this.name = options.name || '';
        this.uri = options.uri || ('/' + options.name);
        this.navbar = options.navbar || '';
        Views.singleton().register(this);
    }

    render(options) {
        const view = document.createElement("div");
        view.id = this.name
        if (options) {
            if (options['title']) {
                const title = document.createElement("h1");
                title.innerText = options['title'];
                view.appendChild(title)
            }
        }
        return view
    }
}