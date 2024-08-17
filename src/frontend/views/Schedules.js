import {View} from "../state-management/Views.js";
// import {fetch} from "../database/Fetch.js";
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
            navbar: 'Schedules'
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
        listDiv.id = 'schedule-div'
        const addSchedule = this.#newSchedule()
        listDiv.appendChild(addSchedule)

        this.#list = document.createElement("ul");
        this.#list.id = 'schedule-list'
        schedules.forEach(schedule => {
            this.#list.appendChild(this.#scheduleItem(schedule.name, schedule.id))
        })
        listDiv.appendChild(this.#list)


        return listDiv
    }

    #newSchedule() {
        const newScheduleDiv = document.createElement("div");
        newScheduleDiv.classList.add('container-new-schedule')

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
        scheduleButton.id = "new-schedule-button";
        scheduleButton.addEventListener("click", async () => {
            await this.#addSchedule(scheduleName)
        })
        newScheduleDiv.appendChild(scheduleButton);

        return newScheduleDiv;
    }

    async #addSchedule(scheduleName) {
        const name = scheduleName.value
        if (!name) return
        const id = await this.#makeSchedule(name);
        this.#list.appendChild(this.#scheduleItem(name, id));
        scheduleName.value = '';
    }

    #scheduleItem(name, id) {
        const scheduleLI = document.createElement("li");
        scheduleLI.classList.add("schedule-item");

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
        let response = await fetch('/schedules')
        return await response.json()
    }

    async #makeSchedule(name) {
        let response = await fetch(`/schedules`, {
            headers: {
                "Content-Type": "application/json",
            },
            method: 'POST',
            body: JSON.stringify({
                name: name
            }),

        })
        return (await response.json())['id']
    }

    async #deleteSchedule(id) {
        await fetch(`/schedules/${id}`, {
            method: 'DELETE',
        })
    }
}