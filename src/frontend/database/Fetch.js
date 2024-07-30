function getOrDefault(name, defaultValue) {
    const value = window.localStorage.getItem(name);
    if (value === null) {
        set(name, defaultValue);
        return defaultValue;
    } else {
        return JSON.parse(value);
    }
}

function set(name, value) {
    window.localStorage.setItem(name, JSON.stringify(value));
}

function schedules(options) {
    switch (options.method) {
        case 'POST': {
            const body = JSON.parse(options.body);
            const name = body['name']
            let uuid = self.crypto.randomUUID();
            let list = getOrDefault('schedules', []);
            list.push({id: uuid, name: name})
            console.log(list)
            set('schedules', list);
            return {
                status: 200,
                statusText: 'OK',
                body: JSON.stringify({
                    id: uuid
                })
            }
        }
        case 'DELETE': {
            const body = JSON.parse(options.body);
            const id = body['id']
            let list = getOrDefault('schedules', []);
            set('schedules', list.filter(item => item.id !== id));
            return {
                status: 200,
                statusText: 'OK',
            }
        }
        case 'GET': {
            let list = getOrDefault('schedules', []);
            if (options.body) {
                const body = JSON.parse(options.body);
                const id = body['id']
                return {
                    status: 200,
                    statusText: 'OK',
                    body: JSON.stringify(list.find(item => item.id === id))
                }
            } else {
                return {
                    status: 200,
                    statusText: 'OK',
                    body: JSON.stringify({
                        list
                    })
                }
            }
        }
        default:
            break
    }
}

export function fetch(
    path,
    options = {method: 'GET'},
) {
    console.log(path);
    console.log(options);
    return new Promise((resolve, _) => {
        switch (path) {
            case '/schedules':
                resolve(schedules(options))
                break
            default:
                console.log(path)
                resolve({
                    status: 200,
                    statusText: 'OK',
                    body: JSON.stringify([])
                })
        }
    })
}