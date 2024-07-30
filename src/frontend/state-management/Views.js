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
}

export class View {
    name = ''
    url = ''
    navbar = ''

    constructor(name) {
        this.name = name;
        this.url = name;
        this.navbar = name;
        Views.singleton().register(this);
    }
}