import {View} from "../state-management/Views.js";

// import {fetch} from "../database/Fetch.js";


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
        if (scheduleInfo.error) {
            const errorMsg = document.createElement('div');
            errorMsg.innerHTML = scheduleInfo.error;
            return errorMsg
        }
        const view = super.render({title: scheduleInfo['name']})
        const dynamicContent = document.createElement("h2");
        dynamicContent.innerText = id
        view.appendChild(dynamicContent);
        const input = document.createElement("input");
        input.type = "text";
        view.appendChild(input)
        const button = document.createElement("button");
        const list = document.createElement("ul");
        input.addEventListener("keyup", async event => {
            event.preventDefault();
            if (event.key === 'Enter') {
                if (!input.value) return
                await this.#addCourse(id, input.value)
                this.#makeItem(list, input.value, id);
                input.value = ''
            }
        })
        button.addEventListener("click", async (e) => {
            e.preventDefault();
            if (!input.value) return
            await this.#addCourse(id, input.value)
            this.#makeItem(list, input.value, id);
            input.value = ''
        })
        this.#renderList(list, scheduleInfo['courses'], id)
        button.innerText = 'Add course'
        view.appendChild(button)
        view.appendChild(list)
        return view
    }

    #renderList(comp, data, id) {
        if (!data) return
        comp.innerHTML = ''
        data.forEach(s => this.#makeItem(comp, s, id))
    }

    #makeItem(comp, s, id) {
        const li = document.createElement("li");
        const div = document.createElement("div");
        div.innerText = s;
        const button = document.createElement("button");
        button.innerText = 'delete'
        button.addEventListener("click", async (e) => {
            e.preventDefault()
            await this.#deleteCourse(id, s)
            comp.removeChild(li)
        })
        li.appendChild(div)
        li.appendChild(button)
        comp.appendChild(li)
    }

    async #getSchedule(id) {
        const res = await fetch(`/schedules/${id}`, {
            method: "GET"
        })
        console.log(res)
        return (await res.json())
    }

    async #addCourse(id, course) {
        if (!course) return
        const res = await fetch(`/schedules/${id}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({course})
        })
        return (await res.json())
    }

    async #deleteCourse(id, course) {
        if (!course) return
        const res = await fetch(`/schedules/${id}`, {
            method: "Delete",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({course})
        })
    }
}