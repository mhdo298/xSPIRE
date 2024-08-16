import {ElementNode, refresh} from "./base";
import {Button} from "./components/reusables/inputs/button";
import {List, ListItem} from "./components/reusables/container/list";
import {Textbox} from "./components/reusables/inputs/textbox";


const div: ElementNode = {
    tag: 'div',
    children: []
}


const schedule_list = new List({}, async () => {
        const result = await fetch('/api/schedules')
        return await result.json()
    },
    (entry) => {
        return new ListItem({
            children: [JSON.stringify(entry)]
        })
    }
)

const homepage: ElementNode = {
    tag: 'div',
    children: [
        new Button({children: ['Make new schedule!']}, async (b, evt) => {
            const result = await fetch('/api/schedules', {method: "POST"})
            const list = await result.json()
            await schedule_list.add(list)
            await navigate(`/schedules/${list.id}`)
        }),
        schedule_list
    ]
}


const schedule_editor: ElementNode = {
    tag: 'div',
    children: [],
    update: async (self) => {
        const id = window.location.pathname.split('/')[2]
        const schedule_info = await fetch(`/api/schedules/${id}`).then(res => res.json())

        const input = new Textbox({}, 'Course group', undefined, async (self) => {
            const value = self.value
            await fetch(`/api/schedules/${id}?value=${value}`, {method: "POST"})

        })
        self.children = [
            schedule_info['name'],

        ]
    }
}
const error: ElementNode = {
    tag: 'div',
    children: [
        '404: Resource not found =('
    ]
}

window.addEventListener("popstate", async (event) => {
    await navigate(event.state, true)
});
document.addEventListener('DOMContentLoaded', async () => {
    document.body.appendChild(await refresh(div))
    await navigate(window.location.pathname)
})

const routes: Record<string, ElementNode> = {
    '/schedules/*': schedule_editor,
    '/': homepage
}

async function navigate(route: string, back: boolean = false) {
    let page = error
    for (const r in routes) {
        if (RegExp(r).test(route)) {
            page = routes[r]
            break
        }
    }
    div.children = [page]
    if (!back) window.history.pushState(route, '', route)
    await refresh(div)
}
