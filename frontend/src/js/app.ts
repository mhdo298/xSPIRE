import {hook, refresh} from "./base";
import {Button} from "./components/reusables/inputs/button";
import {Textbox} from "./components/reusables/inputs/textbox";
import {List, ListItem} from "./components/reusables/container/list";

const tasks: string[] = JSON.parse(localStorage.getItem('tasks') || '[]') as string[]
const list = new List<string>({
        classes: ['flex', 'flex-column']
    },
    () => tasks,
    (s, index) => new ListItem({
        classes: ['flex', 'flex-row'],
        children: [
            {
                tag: 'div',
                classes: ['flex', 'flex-row'],
                children: [
                    {
                        tag: 'div',
                        children: [
                            String(index)
                        ]
                    },
                    {
                        tag: 'div',
                        children: [
                            s
                        ]
                    },
                ]
            },
            new Button({children: ['delete!']}, async () => {
                tasks.splice(index, 1)
                localStorage.setItem('tasks', JSON.stringify(tasks))
                await refresh(list)
            })
        ]
    })
)
const textbox = new Textbox({}, 'Tasks: ', undefined, async (self) => {
    if (self.value) {
        tasks.push(self.value)
        localStorage.setItem('tasks', JSON.stringify(tasks))
        self.value = ''
        await refresh(list)
    }
})
const div = {
    tag: 'div',
    children: [
        textbox,
        list
    ]
}
document.addEventListener('DOMContentLoaded', async () => {
    document.body.appendChild(await refresh(div))
})
//