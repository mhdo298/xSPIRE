import {View} from "../state-management/Views.js";
import {fetch} from "../database/Fetch.js";
import {Events} from "../state-management/Events.js";
import {ScheduleEditor} from "./ScheduleEditor.js";


export class Schedules extends View {
    static #singleton = null;

    static getView() {
        return this.#singleton || (this.#singleton = new Schedules());
    }

    constructor() {
        super({
            name: 'schedule-home',
            navbar: 'Course schedules'
        });
    }

    async render() {
        const view = super.render({title: 'Course schedules'})
        const list = await (new ScheduleList().render())
        view.appendChild(list);
        return view
    }
}

class ScheduleList {
    #events = null
    #list = null

    constructor() {
        this.#events = Events.singleton()
    }

    async render() {
        const schedules = await this.#getSchedules()
        const listDiv = document.createElement('div')

        const addSchedule = this.#newSchedule()
        listDiv.appendChild(addSchedule)

        this.#list = document.createElement("ul");
        schedules.forEach(schedule => {
            this.#list.appendChild(this.#scheduleItem(schedule.name, schedule.id))
        })
        listDiv.appendChild(this.#list)


        return listDiv
    }

    #newSchedule() {
        const newScheduleDiv = document.createElement("div");

        const scheduleName = document.createElement("input");
        scheduleName.type = "text";
        scheduleName.id = "new-schedule-name";
        scheduleName.placeholder = "New schedule name";
        scheduleName.addEventListener('keyup', async event => {
            if (event.key !== 'Enter') {
                return;
            }
            await this.#addSchedule(scheduleName)
        });
        newScheduleDiv.appendChild(scheduleName);

        const scheduleButton = document.createElement("button");
        scheduleButton.innerText = 'Make new schedule!'
        scheduleButton.addEventListener("click", async () => {
            await this.#addSchedule(scheduleName)
        })
        newScheduleDiv.appendChild(scheduleButton);

        return newScheduleDiv;
    }

    async #addSchedule(scheduleName) {
        const name = scheduleName.value
        const id = await this.#makeSchedule(name);
        this.#list.appendChild(this.#scheduleItem(name, id));
        scheduleName.value = '';
    }

    #scheduleItem(name, id) {
        const scheduleLI = document.createElement("li");
        scheduleLI.classList.add("course");

        const scheduleLink = document.createElement("a");
        scheduleLink.innerText = name;
        const uri = ScheduleEditor.getView().uri + '?id=' + id
        scheduleLink.href = uri
        scheduleLink.addEventListener("click", async event => {
            event.preventDefault()
            await this.#events.call('changeView', uri)
        })
        scheduleLI.appendChild(scheduleLink);

        const deleteButton = document.createElement("button");
        deleteButton.innerText = 'Delete'
        deleteButton.addEventListener("click", async () => {
            this.#list.removeChild(scheduleLI);
            await this.#deleteSchedule(id);
        });
        scheduleLI.appendChild(deleteButton);
        return scheduleLI;
    }


    async #getSchedules() {
        return JSON.parse((await fetch('/schedules')).body)['list']
    }

    async #makeSchedule(name) {
        return JSON.parse((await fetch(`/schedules`, {
            method: 'POST',
            body: JSON.stringify({
                name: name
            })
        })).body)['id']
    }

    async #deleteSchedule(id) {
        await fetch(`/schedules`, {
            method: 'DELETE',
            body: JSON.stringify({
                id: id
            })
        })
    }
}