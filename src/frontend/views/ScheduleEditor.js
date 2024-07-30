import {View} from "../state-management/Views.js";
import {fetch} from "../database/Fetch.js";


export class ScheduleEditor extends View {
    static #singleton = null;

    static getView() {
        return this.#singleton || (this.#singleton = new ScheduleEditor());
    }

    constructor() {
        super({
            name: 'schedule-editor'
        });
    }

    async render() {
        const id = new URLSearchParams(window.location.search).get('id')
        const scheduleInfo = await this.#getSchedule(id);
        return super.render({title: scheduleInfo['name']})
    }

    async #getSchedule(id) {
        const res = await fetch("/schedules", {
            method: "GET", body: JSON.stringify({id: id})
        })
        return JSON.parse(res.body)
    }
}