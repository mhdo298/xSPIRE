import {View} from "../state-management/Views.js";

export class Schedule extends View {
    static #singleton = null;

    static getView() {
        return this.#singleton || (this.#singleton = new Schedule());
    }

    constructor() {
        super('schedule-home');
    }

    render() {
        const scheduleView = document.createElement("div");
        scheduleView.id = this.name
        const title = document.createElement("h1");
        title.innerText = 'Make a new schedule or load an existing one!';
        scheduleView.appendChild(title)
        return scheduleView
    }
}

