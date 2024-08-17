import {View} from "../state-management/Views.js";


export class Search extends View {
    static #singleton = null;

    static getView() {
        return this.#singleton || (this.#singleton = new Search());
    }

    constructor() {
        super({
            name: 'search-home',
            navbar: 'Courses'
        });
    }

    render() {
        const view = super.render({title: 'Find a course!'});
        const searchDiv = document.createElement("div");
        searchDiv.classList.add("container");
        view.appendChild(searchDiv);

        const mainInput = document.createElement("input");

        mainInput.type = "text";
        mainInput.id = "main-keywords";
        mainInput.placeholder = 'Search keywords in course name, description, etc.';
        searchDiv.appendChild(mainInput);
        const ul = document.createElement("ul");
        searchDiv.appendChild(ul)
        mainInput.addEventListener('keyup', async event => {
            event.preventDefault();
            if (event.key === 'Enter') {
                const results = await fetch(`/courses?search=${mainInput.value}`).then(res => res.json())
                console.log(results)
                ul.replaceChildren(...results.map((course) => {

                        const li = document.createElement("li");
                        const name = document.createElement("h1");
                        name.textContent = course['DERIVED_CRSECAT_DESCR200'];
                        li.appendChild(name);
                        const desc = document.createElement("span");
                        desc.textContent = course['SSR_CRSE_OFF_VW_DESCRLONG'][0];
                        li.appendChild(desc);
                        const sections = document.createElement('ul')
                        sections.append(...(course["Subsections"] || []).map((s) => {
                            const lis = document.createElement("li");
                            const year = document.createElement("p");
                            year.innerText = s['DERIVED_CLSRCH_SSS_PAGE_KEYDESCR'];
                            const content = document.createElement("p");
                            content.innerText= s['DERIVED_CLSRCH_DESCR200'];
                            lis.appendChild(year)
                            lis.appendChild(content)
                            return lis
                        }))
                        li.appendChild(sections)
                        return li;
                    })
                )
            }
        })
        return view
    }
}
